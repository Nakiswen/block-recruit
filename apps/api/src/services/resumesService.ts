import * as resumesModel from '@/models/resumesModel';
import * as jobsModel from '@/models/jobsModel';
import { ragService } from '@/services/rag/ragService';
import { aiService } from '@/services/ai/aiService';
import type { Resume } from '@/prisma/web3cv';
import type { job_posting } from '@/prisma/web3jobs';
import type { EnhancedMatch, EnhancedMatchForResume } from '@/services/rag/types';
import { getRealResumeId, getRealResumeIdAsync } from '@/utils/resumeIdMap';
import redis from '@/utils/redis';

// 定义业务错误类型
export class BusinessError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'BusinessError';
  }
}

/**
 * 上传简历，只保存原始内容，不做处理
 * @param userId 用户ID
 * @param content 简历内容
 * @param fileName 文件名
 * @param fileType 文件类型
 * @param fileSize 文件大小
 * @returns 简历ID
 */
export async function uploadResume(
  userId: string,
  content: string,
  fileName?: string,
  fileType?: string,
  fileSize?: number
): Promise<string> {
  // 仅创建简历记录，不做处理
  const resume = await resumesModel.createResume(
    userId, content, fileName, fileType, fileSize
  );
  return resume.id;
}

/**
 * 解析简历内容，生成结构化数据
 * @param resumeId 简历ID
 * @returns 更新后的简历对象
 */
export async function parseResume(resumeId: string): Promise<Resume> {
  // 获取简历信息
  const resume = await resumesModel.getResumeById(resumeId);
  if (!resume) {
    throw new BusinessError(`简历 ${resumeId} 不存在`, 'RESUME_NOT_FOUND');
  }

  try {
    // 检查是否已经有解析过的数据
    if (resume.parsedData && typeof resume.parsedData === 'object' && 
        'skills' in resume.parsedData && 'educationLevel' in resume.parsedData) {
      console.log(`📄 简历 ${resumeId} 已有解析结果，跳过解析步骤`);
      
      // 更新状态为已解析
      await resumesModel.updateResumeStatus(resumeId, 'parsed');
      return resume;
    }
    
    console.log(`🔍 开始解析简历 ${resumeId}`);
    
    // 创建一个符合aiService要求的Resume对象
    const resumeForAI = {
      id: resume.id,
      userId: resume.userId,
      content: resume.content,
      name: resume.title || undefined,  // 使用undefined而不是null
      summary: '',
      workExperience: '',
      projects: '',
      education: '',
      skills: [] as string[],
      parsedData: undefined  // 确保parsedData是undefined而不是null
    };
    
    // 使用AI服务解析简历文本
    const structuredData = await aiService.extractResumeInfo(resumeForAI);
    console.log(`✅ 简历 ${resumeId} 解析完成`);
    
    // 将解析结果保存到简历记录
    const updatedResume = await resumesModel.updateResume(resumeId, {
      parsedData: structuredData,
      status: 'parsed'
    });
    
    return updatedResume;
  } catch (error) {
    // 解析失败，更新状态
    await resumesModel.updateResumeStatus(resumeId, 'parse_failed');
    
    throw new BusinessError(
      `简历解析失败: ${error instanceof Error ? error.message : '未知错误'}`,
      'PARSE_FAILED'
    );
  }
}

/**
 * 向量化简历
 * @param resumeId 简历ID
 * @returns 向量化后的简历对象
 * @throws BusinessError 如果简历不存在、未解析或向量化失败
 */
export async function vectorizeResume(resumeId: string): Promise<Resume> {
  // 获取简历数据
  const resume = await resumesModel.getResumeById(resumeId);
  if (!resume) {
    throw new BusinessError(`ID为 ${resumeId} 的简历不存在`, 'RESUME_NOT_FOUND');
  }

  if (resume.status !== 'parsed') {
    throw new BusinessError(
      `简历 ${resumeId} 尚未解析结构化数据，无法进行向量化`,
      'RESUME_NOT_PARSED'
    );
  }

  try {
    // 创建一个符合ragService要求的Resume对象
    const resumeForRAG = {
      id: resume.id,
      userId: resume.userId,
      content: resume.content,
      title: resume.title,
      parsedData: resume.parsedData
    };
    
    // 向量化存储
    const resumeVector = await ragService.vectorizeAndStoreResume(resumeForRAG as unknown as Resume);
    
    // 获取向量ID
    const vectorId = `resume_${resumeId}`;
    
    // 更新简历的向量ID
    await resumesModel.updateResumeVectorId(resumeId, vectorId);
    return resumeVector as unknown as Resume;
  } catch (error) {
    // 检查是否是Pinecone初始化错误
    if (error instanceof Error && 
        (error.message.includes('未初始化') || 
         error.message.includes('初始化失败') || 
         error.message.includes('Pinecone'))) {
      
      // 更新状态为已处理但未向量化
      await resumesModel.updateResumeStatus(resumeId, 'processed');
      throw new BusinessError(
        `向量数据库未初始化，简历 ${resumeId} 无法进行向量化`,
        'VECTORDB_NOT_INITIALIZED'
      );
    }
    
    // 其他错误则更新状态为向量化失败并抛出异常
    await resumesModel.updateResumeStatus(resumeId, 'vectorize_failed');
    throw new BusinessError(
      `简历向量化失败: ${error instanceof Error ? error.message : '未知错误'}`,
      'VECTORIZE_FAILED'
    );
  }
}

/**
 * 上传简历并启动异步处理流程 - 完全异步版本
 * 立即返回临时ID，后台异步完成所有处理
 * @param userId 用户ID
 * @param content 简历内容
 * @param fileName 文件名
 * @param fileType 文件类型
 * @param fileSize 文件大小
 * @returns 临时简历ID
 */
export async function createResumeAndProcessAsync(
  userId: string,
  content: string,
  fileName?: string,
  fileType?: string, 
  fileSize?: number
): Promise<string> {
  // 生成临时ID
  const tempResumeId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // 启动完全异步的处理流程
  processResumeCompletelyAsync(tempResumeId, userId, content, fileName, fileType, fileSize).catch(error => {
    console.error(`异步处理简历 ${tempResumeId} 失败:`, error);
  });
  
  return tempResumeId;
}

/**
 * 完全异步处理简历的完整流程
 * @param tempResumeId 临时简历ID
 * @param userId 用户ID
 * @param content 简历内容
 * @param fileName 文件名
 * @param fileType 文件类型
 * @param fileSize 文件大小
 */
async function processResumeCompletelyAsync(
  tempResumeId: string,
  userId: string,
  content: string,
  fileName?: string,
  fileType?: string,
  fileSize?: number
): Promise<void> {
  try {
    console.log(`🔄 开始完全异步处理简历 ${tempResumeId}`);
    
    // 步骤1: 异步保存到数据库
    const resumeId = await uploadResume(userId, content, fileName, fileType, fileSize);
    console.log(`✅ 简历 ${tempResumeId} 已保存到数据库，真实ID: ${resumeId}`);
    
    // 步骤2: 异步解析简历
    await parseResume(resumeId);
    console.log(`✅ 简历 ${resumeId} 解析完成`);
    
    // 步骤3: 异步向量化简历
    await vectorizeResume(resumeId);
    console.log(`✅ 简历 ${resumeId} 向量化完成`);
  
    // 步骤4: 异步执行岗位匹配
    const matches = await getMatchedJobsForResume(resumeId);
    console.log(`✅ 简历 ${resumeId} 匹配完成，找到 ${matches.length} 个岗位`);
    
    // 更新状态为已匹配
    await resumesModel.updateResumeStatus(resumeId, 'matched');
    
    console.log(`🎉 简历 ${resumeId} 完全异步处理完成`);
  } catch (error) {
    console.error(`❌ 简历 ${tempResumeId} 完全异步处理失败:`, error);
    
    // 根据错误类型更新状态（如果有真实resumeId）
    if (error instanceof BusinessError && error.code !== 'RESUME_NOT_FOUND') {
      // 这里需要根据实际情况处理错误状态更新
    }
  }
}

/**
 * 上传简历、进行向量化处理并立即执行岗位匹配 (同步版本)
 * 警告: 此方法会阻塞API调用，可能造成较长响应时间
 * @param userId 用户ID
 * @param content 简历内容
 * @param fileName 文件名
 * @returns 简历ID和处理结果
 */
export async function createResumeAndMatchJobs(
  userId: string,
  content: string,
  fileName: string,
  fileType?: string,
  fileSize?: number
): Promise<{ 
  resumeId: string; 
  parseResult?: Resume;
  vectorizeResult?: Resume;
  matches?: EnhancedMatch[];
  rawJobsData?: any[];
}> {
  // 步骤 1: 创建简历记录
  const resumeId = await uploadResume(userId, content, fileName, fileType, fileSize);
  const result = { resumeId };
  
  try {
    // 按照时序图流程，将解析、向量化和匹配操作委托给 ragService 处理
    // 这样可以避免重复的解析和向量化操作
    const processResult = await ragService.processResumeAndFindMatches(resumeId);
    
    // 更新结果对象
    console.log("🚀 ~ processResult.matches:", processResult.matches)
    return {
      resumeId,
      parseResult: processResult.resumeData as unknown as Resume,
      vectorizeResult: processResult.resumeData as unknown as Resume,
      matches: processResult.matches || [],
      rawJobsData: processResult.rawJobsData || []
    };
  } catch (error) {
    console.error(`处理简历 ${resumeId} 失败:`, error);
    return result;
  }
}

/**
 * 根据指定的简历ID，获取与其匹配的岗位列表。
 * @param resumeId - 目标简历的ID。
 * @param filters - （可选）用于过滤匹配结果的条件，例如最低匹配分数。
 * @returns 返回一个包含增强匹配信息的岗位列表。
 * @throws 如果简历ID不存在，则抛出错误。
 */
export async function getMatchedJobsForResume(
  resumeId: string,
  filters: {
    minMatchScore?: number;
    location?: string;
    industry?: string;
    educationLevel?: string;
    experienceYears?: number;
  } = {}
): Promise<EnhancedMatch[]> {
  // 生成缓存键，包含过滤条件
  const filterString = JSON.stringify(filters);
  const cacheKey = `resume:match:${resumeId}:${filterString}`;
  
  // 1. 先查Redis缓存
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log(`✅ 从缓存获取简历 ${resumeId} 的匹配岗位`);
    return JSON.parse(cached);
  }

  // 2. 没有缓存才调用 RAG服务 匹配岗位
  // 验证简历是否存在
  const resume: Resume | null = await resumesModel.getResumeById(resumeId);
  if (!resume) {
    throw new Error('简历不存在');
  }
  
  console.log(`🔍 为简历 ${resumeId} 查找匹配岗位`);
  // 调用RAG服务查找匹配的岗位，默认返回最多10条结果
  const topK = 10;
  const matches = await ragService.findMatchingJobs(resumeId, topK, filters);
  
  // 确保返回的是岗位原始业务数据而非embedding数据
  // 过滤掉不需要的向量数据，减小缓存体积
  const cleanedMatches = matches.map(match => ({
    ...match,
    job: {
      ...match.job,
      vector: undefined, // 移除向量数据
      embedding: undefined // 移除embedding数据
    }
  }));

  // 3. 写入Redis缓存，设置过期时间（1小时）
  await redis.set(cacheKey, JSON.stringify(cleanedMatches), 'EX', 3600);
  console.log(`💾 缓存简历 ${resumeId} 的匹配岗位结果，有效期1小时`);

  return cleanedMatches;
}

/**
 * 根据指定的岗位ID，获取与其匹配的简历列表。
 * @param jobId - 目标岗位的ID。
 * @param filters - （可选）用于过滤匹配结果的条件，例如最低匹配分数、地理位置等。
 * @returns 返回一个包含增强匹配信息的简历列表。
 * @throws 如果岗位ID不存在，则抛出错误。
 */
export async function getMatchedResumesForJob(
  jobId: string,
  filters: {
    minMatchScore?: number;
    location?: string;
    educationLevel?: string;
    experienceYears?: number;
    skills?: string[];
  } = {}
): Promise<EnhancedMatchForResume[]> {
  // 验证岗位是否存在
  const job: job_posting | null = await jobsModel.getJobById(jobId);
  if (!job) {
    throw new Error('岗位不存在');
  }

  // 调用RAG服务查找匹配的简历，默认返回最多10条结果
  const topK = 10;
  return await ragService.findMatchingResumes(jobId, topK, filters);
}

/**
 * 对指定的简历和岗位对进行一对一的AI增强匹配分析。
 * @param resumeId - 目标简历的ID。
 * @param jobId - 目标岗位的ID。
 * @returns 返回一个包含详细AI分析的匹配结果对象。
 * @throws 如果简历或岗位不存在，则抛出错误。
 */
export async function getEnhancedMatchForPair(
  resumeId: string,
  jobId: string
): Promise<import('@/services/rag/types').EnhancedMatch> {
  try {
    // 直接调用ragService的方法，避免重复代码
    return await ragService.getEnhancedMatchingForPair(resumeId, jobId);
  } catch (error) {
    console.error(`为简历 ${resumeId} 和岗位 ${jobId} 的增强匹配分析失败:`, error);
    throw error;
  }
}

/**
 * 获取简历处理进度
 * @param resumeId 简历ID（可能是临时ID）
 * @returns 处理进度信息
 */
export async function getResumeProgress(resumeId: string): Promise<{
  progress: number;
  status: 'processing' | 'done' | 'failed';
  jobs?: any[];
}> {
  console.log(`🔍 获取简历 ${resumeId} 的处理进度`);
  
  // 如果是临时ID，需要特殊处理
  if (resumeId.startsWith('temp_')) {
    // 使用异步方法获取真实ID
    const realId = await getRealResumeIdAsync(resumeId);
    if (!realId) {
      // 还没处理完，继续返回processing
      console.log(`⏳ 临时ID ${resumeId} 尚未关联到真实ID，返回初始进度`);
      return {
        progress: 10, // 临时ID表示刚开始处理
        status: 'processing'
      };
    }
    console.log(`✅ 临时ID ${resumeId} 已关联到真实ID ${realId}，递归查询进度`);
    // 已有真实ID，递归查真实ID的进度
    return getResumeProgress(realId);
  }

  // 获取简历信息
  const resume = await resumesModel.getResumeById(resumeId);
  if (!resume) {
    console.log(`❌ 简历 ${resumeId} 不存在`);
    throw new BusinessError(`简历 ${resumeId} 不存在`, 'RESUME_NOT_FOUND');
  }

  console.log(`📊 简历 ${resumeId} 当前状态: ${resume.status}`);

  // 根据简历状态计算进度
  let progress = 0;
  let status: 'processing' | 'done' | 'failed' = 'processing';

  switch (resume.status) {
    case 'created':
      progress = 10;
      break;
    case 'parsed':
      progress = 40;
      break;
    case 'vectorized':
      progress = 70;
      break;
    case 'matched':
      progress = 100;
      status = 'done';
      break;
    case 'parse_failed':
    case 'vectorize_failed':
    case 'match_failed':
    case 'process_failed':
      progress = 0;
      status = 'failed';
      break;
    default:
      progress = 0;
  }

  // 如果处理完成，获取匹配的岗位
  let jobs: any[] = [];
  if (status === 'done') {
    try {
      console.log(`🔍 简历 ${resumeId} 已处理完成，获取匹配岗位`);
      
      // 先尝试从缓存获取匹配结果
      const cacheKey = `resume:match:${resumeId}:{}`;
      const cached = await redis.get(cacheKey);
      
      if (cached) {
        console.log(`✅ 从缓存获取简历 ${resumeId} 的匹配岗位`);
        jobs = JSON.parse(cached);
      } else {
        // 缓存不存在，重新获取匹配结果
        console.log(`🔄 缓存未命中，重新获取简历 ${resumeId} 的匹配岗位`);
        jobs = await getMatchedJobsForResume(resumeId);
      }
      
      console.log(`✅ 简历 ${resumeId} 匹配到 ${jobs.length} 个岗位`);
    } catch (error) {
      console.error(`❌ 获取简历 ${resumeId} 匹配岗位失败:`, error);
      // 即使获取岗位失败，也不影响进度返回
    }
  }

  return {
    progress,
    status,
    jobs: status === 'done' ? jobs : undefined
  };
} 