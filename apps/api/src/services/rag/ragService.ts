import { PineconeClient } from './pineconeClient';
import { embeddingService } from './embeddingService';
import {
  SearchOptions,
  SearchResult,
  PineconeIndexType,
  PineconeSearchParams,
  Job,
  Resume,
} from './types';
import { jobsPrisma, resumePrisma } from '@/prisma/client';
import { aiService } from '@/services/ai/aiService';
import type { InputJsonValue } from '@prisma/client/runtime/library';

// 向量元数据类型
type VectorMetadata = Record<string, string | number | boolean | string[] | null | undefined>;

// 搜索过滤器类型
type SearchFilters = Record<string, string | number | boolean | string[] | undefined>;

/**
 * RAG服务，提供向量存储和检索功能
 */
export const ragService = {
  // 向量内存缓存，用于临时存储刚处理的向量数据，避免Pinecone索引延迟问题
  vectorCache: new Map<
    string,
    {
      vector: number[];
      metadata: VectorMetadata;
      timestamp: number;
    }
  >(),

  /**
   * 从缓存中获取向量数据
   * @param id 向量ID
   * @returns 缓存的向量数据或null
   */
  getVectorFromCache(id: string) {
    const cached = this.vectorCache.get(id);
    if (!cached) return null;

    // 检查缓存是否过期（默认10分钟）
    const now = Date.now();
    if (now - cached.timestamp > 10 * 60 * 1000) {
      this.vectorCache.delete(id);
      return null;
    }

    return cached;
  },

  /**
   * 将向量数据存入缓存
   * @param id 向量ID
   * @param vector 向量数据
   * @param metadata 元数据
   */
  cacheVector(id: string, vector: number[], metadata: VectorMetadata) {
    this.vectorCache.set(id, {
      vector,
      metadata,
      timestamp: Date.now(),
    });

    // 清理过期缓存（简单实现）
    if (this.vectorCache.size > 100) {
      const keysToDelete: string[] = [];
      const now = Date.now();

      this.vectorCache.forEach((value, key) => {
        if (now - value.timestamp > 10 * 60 * 1000) {
          keysToDelete.push(key);
        }
      });

      keysToDelete.forEach(key => this.vectorCache.delete(key));
    }
  },

  /**
   * 初始化RAG服务
   */
  async init() {
    await PineconeClient.init();
    console.log('RAG服务初始化完成');
  },

  /**
   * 批量处理岗位信息，生成向量并存储
   * @param jobIds 需要处理的岗位ID列表
   * @returns 处理结果统计
   */
  async processJobs(jobIds: string[]) {
    try {
      // 获取岗位数据
      const jobs = await jobsPrisma.job_posting.findMany({
        where: { topic_id: { in: jobIds } },
      });

      if (!jobs.length) {
        throw new Error('未找到指定的岗位');
      }

      const results = {
        total: jobs.length,
        success: 0,
        failed: 0,
        errors: [] as string[],
      };

      // 批量处理岗位
      for (const job of jobs) {
        try {
          const jobData: Job = {
            id: job.topic_id.toString(),
            title: job.position_name,
            description: job.content || '',
            companyName: job.company,
            salaryRange:
              job.min_salary && job.max_salary ? `${job.min_salary}-${job.max_salary}` : undefined,
            location: job.location || undefined,
            responsibilities: job.content || '', // 职责应该在主要描述中
            requirements: job.content2 || '', // 要求应该在content2中
            // 这里可能需要从tag关系表中获取技能
            skills: [],
            industry: undefined,
            experienceYears: undefined,
            educationLevel: undefined,
            level: job.lever_name || undefined,
          };

          await this.processJob(jobData);
          results.success++;
        } catch (error) {
          results.failed++;
          results.errors.push(`岗位ID ${job.topic_id.toString()}: ${(error as Error).message}`);
        }
      }

      return results;
    } catch (error) {
      console.error('批量处理岗位失败:', error);
      throw error;
    }
  },

  /**
   * 处理单个岗位信息，生成向量并存储
   * @param job 岗位数据
   * @returns 处理后的向量ID和操作状态
   */
  async processJob(job: Job) {
    try {
      // 从岗位描述中提取结构化信息
      const structuredData = await this.extractJobStructuredData(job);

      // 生成岗位的向量表示
      const vector = await embeddingService.generateEmbedding(
        this.formatJobForEmbedding(job, structuredData)
      );

      // 准备元数据
      const metadata = {
        id: job.id,
        title: job.title,
        company: job.companyName,
        required_skills: structuredData.requiredSkills,
        preferred_skills: structuredData.preferredSkills,
        parsed_required_skills: structuredData.parsedRequiredSkills,
        parsed_preferred_skills: structuredData.parsedPreferredSkills,
        experience_years: structuredData.experienceYears,
        education_level: structuredData.educationLevel,
        industry: structuredData.industry,
        salary_range: job.salaryRange,
        location: job.location,
        job_level: structuredData.jobLevel,
        update_time: new Date().toISOString(),
      };

      console.log('🚀 ~ processJob ~ metadata:', metadata);
      // 存储向量到向量数据库
      const vectorId = `job_${job.id}`;
      const upsertResult = await PineconeClient.upsert(
        {
          id: vectorId,
          vector: vector,
          metadata: metadata,
        },
        PineconeIndexType.JOB
      );

      // 同时将向量保存到内存缓存，以便立即使用
      this.cacheVector(vectorId, vector, metadata);
      console.log(`📦 岗位向量已保存到内存缓存: ${vectorId}`);

      // 判断向量存储是否成功
      const isVectorizeSuccess = upsertResult.success;
      console.log(
        `🚀 ${isVectorizeSuccess ? '✅ 成功' : '❌ 失败'} 向量化岗位 ${job.id}, vectorId: ${vectorId}`
      );

      return {
        vectorId,
        vectorizeSuccess: isVectorizeSuccess,
        upsertResult,
        vector: vector,
        metadata: metadata,
      };
    } catch (error) {
      console.error('处理岗位失败:', error);
      return {
        id: job.id,
        vectorizeSuccess: false,
        error: error instanceof Error ? error.message : '未知错误',
      };
    }
  },

  /**
   * 处理并存储单个简历的向量。
   * @param resume 完整的简历数据对象。
   * @returns 返回生成的向量ID和操作状态。
   */
  async vectorizeAndStoreResume(resume: Resume): Promise<{
    vectorizeSuccess: boolean;
    vectorId?: string;
    upsertResult?: { success: boolean; count: number; data?: unknown; error?: string };
    id: string;
    vector?: number[];
    metadata?: VectorMetadata;
    error?: string;
  }> {
    try {
      let structuredData: {
        skills: string[];
        experienceYears: number | null;
        educationLevel: string | null;
        industryExperience: string[];
        location: string;
        keyAchievements: string[];
        salaryFlexible?: boolean;
      };

      // 检查简历是否已有解析结果(parsedData)，如果有则直接使用，避免重复解析
      if (
        resume.parsedData &&
        typeof resume.parsedData === 'object' &&
        'skills' in resume.parsedData &&
        'educationLevel' in resume.parsedData &&
        'experienceYears' in resume.parsedData
      ) {
        console.log(`🔄 使用简历 ${resume.id} 已有的解析数据，跳过AI解析`);
        // 直接使用已存在的解析数据，确保格式符合要求
        structuredData = {
          skills: Array.isArray(resume.parsedData.skills) ? resume.parsedData.skills : [],
          experienceYears: Number(resume.parsedData.experienceYears) || 0,
          educationLevel: String(resume.parsedData.educationLevel || '未知'),
          industryExperience: Array.isArray(resume.parsedData.industryExperience)
            ? resume.parsedData.industryExperience
            : [],
          location: String(resume.parsedData.location || '未知'),
          keyAchievements: Array.isArray(resume.parsedData.keyAchievements)
            ? resume.parsedData.keyAchievements
            : [],
          salaryFlexible: Boolean(resume.parsedData.salaryFlexible),
        };
      } else {
        console.log(`🔍 简历 ${resume.id} 未解析，开始AI解析`);
        // 如果没有已解析的数据，则调用AI服务进行解析
        structuredData = await aiService.extractResumeInfo(resume);
      }

      // 生成简历的向量表示
      const vector = await embeddingService.generateEmbedding(
        this.formatResumeForEmbedding(resume, structuredData)
      );

      // 准备元数据
      const metadata = {
        id: resume.id,
        owner: resume.userId,
        skills: structuredData.skills,
        experience_years: structuredData.experienceYears,
        education_level: structuredData.educationLevel,
        industry_experience: structuredData.industryExperience,
        location: structuredData.location,
        update_time: new Date().toISOString(),
      };

      // 存储向量到向量数据库
      const vectorId = `resume_${resume.id}`;
      const upsertResult = await PineconeClient.upsert(
        {
          id: vectorId,
          vector: vector,
          metadata: metadata,
        },
        PineconeIndexType.RESUME
      );

      // 同时将向量保存到内存缓存，以便立即使用
      this.cacheVector(vectorId, vector, metadata);
      console.log(`📦 向量已保存到内存缓存: ${vectorId}`);

      // 判断向量存储是否成功
      const isVectorizeSuccess = upsertResult.success;

      console.log(
        `🚀 ${isVectorizeSuccess ? '✅ 成功' : '❌ 失败'} 向量化简历 ${resume.id}, vectorId: ${vectorId}`
      );

      // 返回详细的结果对象
      return {
        id: resume.id,
        vectorId,
        vectorizeSuccess: isVectorizeSuccess,
        upsertResult,
        vector, // 显式返回向量数据
        metadata, // 显式返回元数据
      };
    } catch (error) {
      console.error('处理简历失败:', error);
      // 发生错误时，返回错误状态
      return {
        id: resume.id,
        vectorizeSuccess: false,
        error: error instanceof Error ? error.message : '未知错误',
      };
    }
  },

  /**
   * 查找与简历匹配的岗位
   * @param resumeId 简历ID
   * @param topK 返回结果数量
   * @param filters 过滤条件
   * @returns 匹配的岗位列表及详细分析
   */
  async findMatchingJobs(
    resumeId: string,
    topK: number = 5,
    filters: SearchFilters = {}
  ): Promise<import('./types').EnhancedMatch[]> {
    try {
      // 1. 获取简历向量
      const resumeVector = await this.getResumeVector(resumeId);
      if (!resumeVector?.vector) {
        console.log('⚠️ 未找到简历向量，无法进行匹配');
        return [];
      }

      // 2. 使用向量相似度查找匹配的岗位
      console.log('🔍 根据向量相似度查找匹配岗位...');
      const searchResult = await this.findSimilarJobs(resumeVector.vector, {
        topK,
        filters,
      });

      // 如果没有结果，返回空数组
      if (!searchResult.matches?.length) {
        console.log('ℹ️ 未找到匹配的岗位');
        return [];
      }

      console.log(`✅ 找到 ${searchResult.matches.length} 个匹配的岗位`);

      // 3. 获取匹配的岗位详细信息
      const enhancedMatches = await Promise.all(
        searchResult.matches.map(async match => {
          try {
            // 从元数据中提取岗位ID
            let jobId = match?.id;
            if (!jobId) {
              throw new Error('岗位ID未找到');
            } else {
              jobId = jobId.split('_')[1];
            }
            console.log('🚀 ~ searchResult.matches.map ~ jobId:', jobId);

            // 获取完整的岗位信息
            const job = await jobsPrisma.job_posting.findUnique({
              where: { topic_id: jobId },
            });

            if (!job) {
              throw new Error(`找不到ID为 ${jobId} 的岗位`);
            }

            // 准备岗位数据对象
            const jobData: Job = {
              id: job.topic_id.toString(),
              title: job.position_name,
              description: job.content || '',
              companyName: job.company || undefined,
              responsibilities: job.content || '',
              requirements: job.content2 || '',
              benefits: job.content3 || '', // 福利待遇
              companyIntroduction: job.company_introduction || '', // 公司介绍
              companyWebsite: job.company_website || '', // 公司网站
              salaryRange:
                job.min_salary && job.max_salary
                  ? `${job.min_salary}-${job.max_salary}`
                  : undefined,
              location: job.location || undefined,
              skills: [],
              level: job.lever_name || undefined,
            };

            // 4. 对每个岗位进行详细分析
            let matchDetails;
            try {
              const resume = await resumePrisma.resume.findUnique({
                where: { id: resumeId },
              });

              if (resume) {
                const resumeData: Resume = {
                  id: resume.id,
                  userId: resume.userId,
                  content: resume.content,
                  name: resume.title || '',
                  parsedData: resume.parsedData as Resume['parsedData'],
                };

                // 调用AI服务进行详细匹配分析
                matchDetails = await aiService.enhanceMatching(resumeData, jobData);
              }
            } catch (error) {
              console.warn(`🔶 对简历 ${resumeId} 和岗位 ${jobData.id} 的详细分析失败:`, error);
              matchDetails = {
                overallMatchScore: match.score || 0,
                // 提供默认值
                skillsMatch: { score: 0, analysis: '分析失败' },
                experienceMatch: { score: 0, analysis: '分析失败' },
                educationMatch: { score: 0, analysis: '分析失败' },
                summary: '详细分析处理失败，仅提供向量相似度分数',
                recommendations: ['无法提供个性化建议'],
              };
            }

            return {
              job: jobData,
              similarity: match.score || 0,
              matchDetails: matchDetails || {
                overallMatchScore: match.score || 0,
                // 提供默认值
                skillsMatch: { score: 0, analysis: '未进行分析' },
                experienceMatch: { score: 0, analysis: '未进行分析' },
                educationMatch: { score: 0, analysis: '未进行分析' },
                summary: '仅提供向量相似度分数',
                recommendations: ['无个性化建议'],
              },
            };
          } catch (error) {
            console.error(`处理匹配岗位时出错:`, error);
            return null;
          }
        })
      );

      // 过滤出有效的结果
      const validMatches = enhancedMatches.filter(Boolean) as import('./types').EnhancedMatch[];

      // 5. 构建向量分数映射
      const vectorScores = new Map<string, number>();
      searchResult.matches.forEach(m => {
        // 向量ID格式为 job_<jobId>，移除 job_ 前缀获取真实的岗位ID
        const jobId = m.id?.startsWith('job_') ? m.id.substring(4) : m.id;
        if (jobId) {
          vectorScores.set(jobId, m.score || 0);
        }
      });

      // 6. 多因素加权重排序 - 不仅依赖向量相似度
      const rerankedMatches = this.rerankMatchesByMultipleFactors(validMatches, vectorScores);

      console.log(`📊 重排序完成，返回 ${rerankedMatches.length} 个结果`);
      return rerankedMatches;
    } catch (error) {
      console.error('查找匹配岗位失败:', error);
      throw error;
    }
  },

  /**
   * 多因素加权重排序
   * 综合向量相似度和AI分析结果进行重新排序
   * @param matches 原始匹配结果
   * @param vectorScores 向量相似度分数映射 (jobId -> score)
   * @returns 重排序后的结果
   */
  rerankMatchesByMultipleFactors(
    matches: import('./types').EnhancedMatch[],
    vectorScores: Map<string, number> = new Map()
  ): import('./types').EnhancedMatch[] {
    if (!matches.length) return matches;

    // 权重配置 - 技能匹配最重要
    const WEIGHTS = {
      vectorSimilarity: 0.2, // 向量相似度权重降低，仅作为初筛
      skillsMatch: 0.35, // 技能匹配最重要
      experienceMatch: 0.2, // 经验匹配
      educationMatch: 0.1, // 学历匹配
      salaryMatch: 0.15, // 薪资匹配
    };

    const scoredMatches = matches.map(match => {
      const details = match.matchDetails;
      const breakdown = details?.scoreBreakdown;

      // 提取各维度分数（归一化到0-1）
      const vectorScore = vectorScores.get(match.job.id) || 0;
      const skillsScore = (breakdown?.skillsScore || 0) / 100;
      const experienceScore = (breakdown?.experienceScore || 0) / 100;
      const educationScore = (breakdown?.educationScore || 0) / 100;
      const salaryScore = breakdown?.salaryScore || details?.salaryMatch?.matchScore || 0.5;

      // 计算加权综合分数
      const weightedScore =
        vectorScore * WEIGHTS.vectorSimilarity +
        skillsScore * WEIGHTS.skillsMatch +
        experienceScore * WEIGHTS.experienceMatch +
        educationScore * WEIGHTS.educationMatch +
        salaryScore * WEIGHTS.salaryMatch;

      return {
        match,
        weightedScore,
        vectorScore,
      };
    });

    // 按加权分数降序排序
    scoredMatches.sort((a, b) => b.weightedScore - a.weightedScore);

    console.log('📈 重排序分数详情:');
    scoredMatches.slice(0, 5).forEach((item, index) => {
      console.log(
        `  ${index + 1}. ${item.match.job.title}: 加权=${Math.round(item.weightedScore * 100)}, 向量=${Math.round(item.vectorScore * 100)}`
      );
    });

    return scoredMatches.map(item => item.match);
  },

  /**
   * 简历匹配的多因素加权重排序
   * @param matches 原始匹配结果
   * @param vectorScores 向量相似度分数映射 (resumeId -> score)
   * @returns 重排序后的结果
   */
  rerankResumeMatchesByMultipleFactors(
    matches: { resume: Resume; matchDetails: import('@/services/ai/aiService').MatchResult }[],
    vectorScores: Map<string, number> = new Map()
  ): { resume: Resume; matchDetails: import('@/services/ai/aiService').MatchResult }[] {
    if (!matches.length) return matches;

    // 权重配置
    const WEIGHTS = {
      vectorSimilarity: 0.2,
      skillsMatch: 0.35,
      experienceMatch: 0.2,
      educationMatch: 0.1,
      salaryMatch: 0.15,
    };

    const scoredMatches = matches.map(match => {
      const details = match.matchDetails;
      const breakdown = details?.scoreBreakdown;

      const vectorScore = vectorScores.get(match.resume.id) || 0;
      const skillsScore = (breakdown?.skillsScore || 0) / 100;
      const experienceScore = (breakdown?.experienceScore || 0) / 100;
      const educationScore = (breakdown?.educationScore || 0) / 100;
      const salaryScore = breakdown?.salaryScore || details?.salaryMatch?.matchScore || 0.5;

      const weightedScore =
        vectorScore * WEIGHTS.vectorSimilarity +
        skillsScore * WEIGHTS.skillsMatch +
        experienceScore * WEIGHTS.experienceMatch +
        educationScore * WEIGHTS.educationMatch +
        salaryScore * WEIGHTS.salaryMatch;

      return { match, weightedScore, vectorScore };
    });

    scoredMatches.sort((a, b) => b.weightedScore - a.weightedScore);

    console.log('📈 简历重排序分数详情:');
    scoredMatches.slice(0, 5).forEach((item, index) => {
      console.log(
        `  ${index + 1}. 简历${item.match.resume.id}: 加权=${Math.round(item.weightedScore * 100)}, 向量=${Math.round(item.vectorScore * 100)}`
      );
    });

    return scoredMatches.map(item => item.match);
  },

  /**
   * 为指定岗位查找匹配的简历，并进行AI增强分析。
   * @param jobId 岗位ID
   * @param topK 返回的结果数量
   * @param filters 过滤条件
   * @returns 包含AI分析的简历匹配列表
   */
  async findMatchingResumes(
    jobId: string,
    topK: number,
    filters: SearchFilters = {}
  ): Promise<import('./types').EnhancedMatchForResume[]> {
    // 1. 获取岗位向量
    let jobVector = await this.getJobVector(jobId);
    if (!jobVector?.vector) {
      const jobData = await jobsPrisma.job_posting.findUnique({ where: { topic_id: jobId } });
      if (!jobData) throw new Error(`找不到ID为 ${jobId} 的岗位`);
      await this.processJob(jobData as unknown as Job);
      jobVector = await this.getJobVector(jobId);
      if (!jobVector?.vector) throw new Error(`为岗位 ${jobId} 创建向量失败`);
    }

    // 2. 搜索相似简历
    const searchResults = await this.findSimilarResumes(jobVector.vector, { topK, filters });

    if (!searchResults.matches.length) {
      return [];
    }

    // 3. AI 增强分析
    const resumeIds = searchResults.matches.map(match => match.id);
    const resumes = await resumePrisma.resume.findMany({ where: { id: { in: resumeIds } } });
    const job = await jobsPrisma.job_posting.findUnique({ where: { topic_id: jobId } });
    if (!job) throw new Error(`找不到ID为 ${jobId} 的岗位`);

    // 将岗位数据转换为AI服务需要的格式，避免每个简历都重新提取岗位结构化数据
    const jobForAI: Job = {
      id: job.topic_id.toString(),
      title: job.position_name,
      description: job.content || '',
      companyName: job.company || undefined,
      responsibilities: job.content || '',
      requirements: job.content2 || '',
      salaryRange:
        job.min_salary && job.max_salary ? `${job.min_salary}-${job.max_salary}` : undefined,
      location: job.location || undefined,
      skills: [],
      level: job.lever_name || undefined,
    };

    // 构建向量分数映射
    const vectorScores = new Map<string, number>();
    searchResults.matches.forEach(m => {
      // 简历向量ID格式为 resume_xxx，需要提取原始ID
      const resumeId = m.id?.startsWith('resume_') ? m.id.substring(7) : m.id;
      if (resumeId) {
        vectorScores.set(resumeId, m.score || 0);
      }
    });

    const enhancedMatches = await Promise.all(
      resumes.map(async resume => {
        // 为每个简历创建适配AI服务的对象
        const resumeForAI: Resume = {
          id: resume.id,
          userId: resume.userId,
          content: resume.content,
          name: resume.title || undefined,
          parsedData: resume.parsedData as Resume['parsedData'],
        };

        const matchDetails = await aiService.enhanceMatching(resumeForAI, jobForAI);
        return { resume: resumeForAI, matchDetails };
      })
    );

    // 多因素加权重排序
    const rerankedMatches = this.rerankResumeMatchesByMultipleFactors(
      enhancedMatches,
      vectorScores
    );

    return rerankedMatches as import('./types').EnhancedMatchForResume[];
  },

  /**
   * 获取岗位向量信息
   * @param jobId 岗位ID或向量ID
   * @returns 岗位向量信息，如果不存在则返回null
   */
  async getJobVector(jobId: string) {
    try {
      // 如果输入的是岗位ID而不是向量ID，进行转换
      const vectorId = jobId.startsWith('job_') ? jobId : `job_${jobId}`;

      // 先从内存缓存中获取向量数据
      const cachedVector = this.getVectorFromCache(vectorId);
      if (cachedVector) {
        console.log(`🔍 从缓存中获取岗位向量: ${vectorId}`);
        return {
          id: vectorId,
          vector: cachedVector.vector,
          metadata: cachedVector.metadata,
        };
      }

      // 如果缓存中没有，则从Pinecone获取
      console.log(`🔍 从Pinecone获取岗位向量: ${vectorId}`);
      const vector = await PineconeClient.fetch(vectorId);

      if (!vector) {
        return null;
      }

      return {
        id: vectorId,
        vector: vector.vector,
        metadata: vector.metadata,
      };
    } catch (error) {
      console.error('获取岗位向量失败:', error);
      throw error;
    }
  },

  /**
   * 获取简历向量信息
   * @param resumeId 简历ID或向量ID
   * @returns 简历向量信息，如果不存在则返回null
   */
  async getResumeVector(resumeId: string) {
    try {
      // 如果输入的是简历ID而不是向量ID，进行转换
      const vectorId = resumeId.startsWith('resume_') ? resumeId : `resume_${resumeId}`;

      // 先从内存缓存中获取向量数据
      const cachedVector = this.getVectorFromCache(vectorId);
      if (cachedVector) {
        console.log(`🔍 从缓存中获取向量: ${vectorId}`);
        return {
          id: vectorId,
          vector: cachedVector.vector,
          metadata: cachedVector.metadata,
        };
      }

      // 如果缓存中没有，则从Pinecone获取
      console.log(`🔍 从Pinecone获取向量: ${vectorId}`);
      const vector = await PineconeClient.fetch(vectorId);

      if (!vector) {
        return null;
      }

      return {
        id: vectorId,
        vector: vector.vector,
        metadata: vector.metadata,
      };
    } catch (error) {
      console.error('获取简历向量失败:', error);
      throw error;
    }
  },

  /**
   * 查找与指定向量相似的岗位
   * @param vector 查询向量
   * @param options 搜索选项
   * @returns 搜索结果
   */
  async findSimilarJobs(vector: number[], options: SearchOptions): Promise<SearchResult> {
    try {
      // 准备搜索参数
      const searchParams: PineconeSearchParams = {
        vector,
        topK: options.topK || 10,
        includeValues: options.includeValues || false,
        indexType: PineconeIndexType.JOB,
      };

      // 只有当过滤器非空时才添加到参数中
      if (options.filters && Object.keys(options.filters).length > 0) {
        searchParams.filter = options.filters;
        console.log('📋 应用过滤器:', JSON.stringify(options.filters, null, 2));
      } else {
        console.log('⚠️ 未应用过滤器，将返回所有结果');
      }

      // 执行向量搜索
      const searchResult = await PineconeClient.search(searchParams);

      // 如果搜索失败，返回空结果
      if (!searchResult.success) {
        console.warn(`⚠️ 向量搜索失败: ${searchResult.error}`);
        return {
          matches: [],
          totalCandidates: 0,
          searchTimeMs: searchResult.searchTimeMs || 0,
          searchSuccess: false,
          error: searchResult.error,
        };
      }

      // 设置默认最低相似度阈值，过滤低质量结果
      const DEFAULT_MIN_SCORE = 0.65; // 余弦相似度 0.65 以下的结果质量通常较差
      let matches = searchResult.matches || [];
      const minScore = options.minScore ?? DEFAULT_MIN_SCORE;

      if (minScore > 0) {
        const beforeCount = matches.length;
        matches = matches.filter(match => (match.score || 0) >= minScore);
        console.log(
          `📊 岗位搜索过滤低分结果: ${beforeCount} -> ${matches.length} (阈值: ${minScore})`
        );
      }

      return {
        matches,
        totalCandidates: searchResult.count || 0,
        searchTimeMs: searchResult.searchTimeMs || 0,
        searchSuccess: true,
      };
    } catch (error) {
      console.error('岗位向量搜索失败:', error);
      return {
        matches: [],
        totalCandidates: 0,
        searchTimeMs: 0,
        searchSuccess: false,
        error: error instanceof Error ? error.message : '未知错误',
      };
    }
  },

  /**
   * 查找与指定向量相似的简历
   * @param vector 查询向量
   * @param options 搜索选项
   * @returns 搜索结果
   */
  async findSimilarResumes(vector: number[], options: SearchOptions): Promise<SearchResult> {
    try {
      // 准备搜索参数
      const searchParams: PineconeSearchParams = {
        vector,
        topK: options.topK || 10,
        includeValues: options.includeValues || false,
        indexType: PineconeIndexType.RESUME,
      };

      // 只有当过滤器非空时才添加到参数中
      if (options.filters && Object.keys(options.filters).length > 0) {
        searchParams.filter = options.filters;
        console.log('📋 应用过滤器:', JSON.stringify(options.filters, null, 2));
      } else {
        console.log('⚠️ 未应用过滤器，将返回所有结果');
      }

      // 执行向量搜索
      const searchResult = await PineconeClient.search(searchParams);

      // 如果搜索失败，返回空结果
      if (!searchResult.success) {
        console.warn(`⚠️ 简历向量搜索失败: ${searchResult.error}`);
        return {
          matches: [],
          totalCandidates: 0,
          searchTimeMs: searchResult.searchTimeMs || 0,
          searchSuccess: false,
          error: searchResult.error,
        };
      }

      // 设置默认最低相似度阈值，过滤低质量结果
      const DEFAULT_MIN_SCORE = 0.65; // 余弦相似度 0.65 以下的结果质量通常较差
      let matches = searchResult.matches || [];
      const minScore = options.minScore ?? DEFAULT_MIN_SCORE;

      if (minScore > 0) {
        const beforeCount = matches.length;
        matches = matches.filter(match => (match.score || 0) >= minScore);
        console.log(
          `📊 简历搜索过滤低分结果: ${beforeCount} -> ${matches.length} (阈值: ${minScore})`
        );
      }

      return {
        matches,
        totalCandidates: searchResult.count || 0,
        searchTimeMs: searchResult.searchTimeMs || 0,
        searchSuccess: true,
      };
    } catch (error) {
      console.error('简历向量搜索失败:', error);
      return {
        matches: [],
        totalCandidates: 0,
        searchTimeMs: 0,
        searchSuccess: false,
        error: error instanceof Error ? error.message : '未知错误',
      };
    }
  },

  /**
   * 删除岗位向量
   * @param jobId 岗位ID
   */
  async deleteJobVector(jobId: string) {
    try {
      const vectorId = `job_${jobId}`;
      await PineconeClient.delete(vectorId);
    } catch (error) {
      console.error('删除岗位向量失败:', error);
      throw error;
    }
  },

  /**
   * 删除简历向量
   * @param resumeId 简历ID
   */
  async deleteResumeVector(resumeId: string) {
    try {
      await PineconeClient.delete(`resume_${resumeId}`);
    } catch (error) {
      console.error(`删除简历向量 ${resumeId} 失败:`, error);
      throw error;
    }
  },

  /**
   * 从岗位数据中提取结构化信息
   * @param job 岗位数据
   * @returns 结构化的岗位信息
   */
  async extractJobStructuredData(job: Job): Promise<{
    requiredSkills: string[];
    preferredSkills: string[];
    parsedRequiredSkills: string[];
    parsedPreferredSkills: string[];
    experienceYears: number;
    educationLevel: string;
    industry: string;
    jobLevel: string;
  }> {
    try {
      // 使用AI服务提取岗位结构化信息
      const jobInfo = await aiService.extractJobInfo(job);
      return {
        requiredSkills: jobInfo.requiredSkills || [],
        preferredSkills: jobInfo.preferredSkills || [],
        parsedRequiredSkills: jobInfo.parsedRequiredSkills || [],
        parsedPreferredSkills: jobInfo.parsedPreferredSkills || [],
        experienceYears: jobInfo.experienceYears || 0,
        educationLevel: jobInfo.educationLevel || '',
        industry: jobInfo.industry || '',
        jobLevel: jobInfo.jobLevel || '',
      };
    } catch (error) {
      console.error('提取岗位结构化数据失败:', error);
      // 返回默认值
      return {
        requiredSkills: [],
        preferredSkills: [],
        parsedRequiredSkills: [],
        parsedPreferredSkills: [],
        experienceYears: 0,
        educationLevel: '',
        industry: '',
        jobLevel: '',
      };
    }
  },

  /**
   * 从简历数据中提取结构化信息
   * @param resume 简历数据
   * @returns 结构化的简历信息
   */
  async extractResumeStructuredData(resume: Resume): Promise<{
    skills: string[];
    experienceYears: number | null;
    educationLevel: string | null;
    industryExperience: string[];
    location: string;
    keyAchievements: string[];
    salaryFlexible?: boolean;
  }> {
    // 这里简单地调用AI服务
    return await aiService.extractResumeInfo(resume);
  },

  /**
   * 格式化岗位信息用于生成Embedding
   * 优化策略：与简历格式对称，按重要性排列字段
   * @param job 岗位数据
   * @param structuredData 结构化岗位数据
   * @returns 格式化后的文本
   */
  formatJobForEmbedding(
    job: Job,
    structuredData: {
      requiredSkills: string[];
      preferredSkills: string[];
      parsedRequiredSkills: string[];
      parsedPreferredSkills: string[];
      experienceYears: number;
      educationLevel: string;
      industry: string;
      jobLevel: string;
      salaryFlexible?: boolean;
    }
  ): string {
    // 1. 合并所有技能并去重（最重要的匹配因素）- 限制数量与简历对称
    const allSkills = [
      ...(structuredData.requiredSkills || []),
      ...(structuredData.preferredSkills || []),
      ...(structuredData.parsedRequiredSkills || []),
      ...(structuredData.parsedPreferredSkills || []),
    ];
    const uniqueSkills = [...new Set(allSkills)].slice(0, 15);
    const skillsText = uniqueSkills.length > 0 ? `技能要求: ${uniqueSkills.join(', ')}` : '';

    // 2. 经验和学历要求（次重要）
    const expText = `经验要求: ${structuredData.experienceYears || 0}年`;
    const eduText = `学历要求: ${structuredData.educationLevel || '不限'}`;

    // 3. 行业信息
    const industryText = structuredData.industry ? `所属行业: ${structuredData.industry}` : '';

    // 4. 职责和要求摘要（智能截取）
    const responsibilitiesSummary = this.extractKeyContent(job.responsibilities || '', 1500);
    const requirementsSummary = this.extractKeyContent(job.requirements || '', 1500);

    // 按重要性排列，与简历格式对称
    return [
      `职位: ${job.title || ''}`,
      skillsText,
      expText,
      eduText,
      industryText,
      `工作地点: ${job.location || ''}`,
      `职位级别: ${structuredData.jobLevel || ''}`,
      responsibilitiesSummary ? `职责: ${responsibilitiesSummary}` : '',
      requirementsSummary ? `要求: ${requirementsSummary}` : '',
    ]
      .filter(Boolean)
      .join('\n');
  },

  /**
   * 格式化简历信息用于生成Embedding
   * 优化策略：按重要性排列字段，技能优先，智能截断内容
   * @param resume 简历数据
   * @param structuredData 结构化简历信息
   * @returns 用于Embedding的字符串
   */
  formatResumeForEmbedding(
    resume: Resume,
    structuredData: {
      skills: string[];
      experienceYears: number | null;
      educationLevel: string | null;
      industryExperience: string[];
      location: string;
      keyAchievements: string[];
      salaryFlexible?: boolean;
    }
  ): string {
    // 1. 技能放最前面（最重要的匹配因素）- 限制数量避免噪音
    const skillsText =
      structuredData.skills?.length > 0
        ? `核心技能: ${structuredData.skills.slice(0, 15).join(', ')}`
        : '';

    // 2. 工作经验和学历（次重要）
    const expText = `工作经验: ${structuredData.experienceYears || 0}年`;
    const eduText = `学历: ${structuredData.educationLevel || '未知'}`;

    // 3. 行业经验
    const industryText =
      structuredData.industryExperience?.length > 0
        ? `行业经验: ${structuredData.industryExperience.slice(0, 5).join(', ')}`
        : '';

    // 4. 主要成就（突出亮点）
    const achievementsText =
      structuredData.keyAchievements?.length > 0
        ? `主要成就: ${structuredData.keyAchievements.slice(0, 5).join('; ')}`
        : '';

    // 5. 简历内容摘要（智能截取关键内容，而不是全文）
    const contentSummary = this.extractKeyContent(resume.content, 3000);

    // 按重要性排列，便于向量模型捕捉关键信息
    return [
      skillsText,
      expText,
      eduText,
      industryText,
      `工作地点: ${structuredData.location || '未知'}`,
      achievementsText,
      `经历摘要: ${contentSummary}`,
    ]
      .filter(Boolean)
      .join('\n');
  },

  /**
   * 从简历内容中提取关键信息
   * 优先保留包含关键词的段落
   * @param content 原始内容
   * @param maxLength 最大长度
   * @returns 提取的关键内容
   */
  extractKeyContent(content: string, maxLength: number): string {
    if (!content) return '';
    if (content.length <= maxLength) return content;

    // 关键词模式 - 这些段落通常包含重要信息
    const keywordPatterns = [
      /项目经验|工作经历|技术栈|负责|开发|设计|实现|优化|搭建|主导/,
      /React|Vue|Node|Python|Java|Go|TypeScript|JavaScript|SQL|Docker|K8s/i,
      /管理|带领|团队|业绩|成果|提升|增长|完成/,
    ];

    // 按段落分割
    const paragraphs = content.split(/\n\n+|\n(?=[一二三四五六七八九十]|[0-9]+\.|\d+、)/);

    // 优先保留包含关键词的段落
    const scoredParagraphs = paragraphs.map(para => {
      let score = 0;
      for (const pattern of keywordPatterns) {
        if (pattern.test(para)) score += 1;
      }
      return { para, score };
    });

    // 按分数排序，优先保留高分段落
    scoredParagraphs.sort((a, b) => b.score - a.score);

    let result = '';
    for (const { para } of scoredParagraphs) {
      if (result.length + para.length > maxLength) {
        // 如果还有空间，截取部分内容
        const remaining = maxLength - result.length;
        if (remaining > 100) {
          result += para.substring(0, remaining) + '...';
        }
        break;
      }
      result += para + '\n';
    }

    return result.trim();
  },

  /**
   * 处理简历并查找匹配的岗位 - 一站式处理流程
   * 实现时序图中的完整流程：解析、向量化和匹配
   * @param resumeId 简历ID
   * @returns 包含处理后的简历数据、匹配结果和原始岗位数据
   */
  async processResumeAndFindMatches(resumeId: string): Promise<{
    resumeData: Resume;
    matches: import('./types').EnhancedMatch[];
    rawJobsData: Record<string, unknown>[]; // 原始岗位数据
  }> {
    try {
      // 步骤 1: 获取简历数据
      const resume = await resumePrisma.resume.findUnique({
        where: { id: resumeId },
      });

      if (!resume) {
        throw new Error(`简历 ${resumeId} 不存在`);
      }

      // 创建一个符合aiService要求的Resume对象
      const resumeForProcessing: Resume = {
        id: resume.id,
        userId: resume.userId,
        content: resume.content,
        name: resume.title || undefined,
        parsedData: resume.parsedData as Resume['parsedData'],
      };

      // 步骤 2: 检查解析状态，如果未解析则解析
      let structuredData: import('@/services/ai/aiService').ResumeStructuredInfo | null = null;

      if (
        !resume.parsedData ||
        typeof resume.parsedData !== 'object' ||
        !('skills' in resume.parsedData)
      ) {
        console.log(`🔍 简历 ${resumeId} 未解析，开始解析...`);
        structuredData = await aiService.extractResumeInfo(resumeForProcessing);

        // 更新简历的解析数据
        await resumePrisma.resume.update({
          where: { id: resumeId },
          data: {
            parsedData: structuredData as unknown as InputJsonValue,
            status: 'parsed',
          },
        });

        // 更新处理对象的parsedData
        resumeForProcessing.parsedData = structuredData as Resume['parsedData'];
      }

      // 步骤 3: 检查向量化状态，如果未向量化则向量化
      let resumeVector = await this.getResumeVector(resumeId);

      if (!resumeVector?.vector) {
        console.log(`🔢 简历 ${resumeId} 向量不存在，生成新向量`);
        const vectorResult = await this.vectorizeAndStoreResume(resumeForProcessing);

        // 使用从内存中返回的向量数据，而不是重新从Pinecone获取
        if (vectorResult.vectorizeSuccess && vectorResult.vector && vectorResult.metadata) {
          resumeVector = {
            id: vectorResult.vectorId || `resume_${resumeId}`,
            vector: vectorResult.vector,
            metadata: vectorResult.metadata,
          };

          // 更新简历状态
          await resumePrisma.resume.update({
            where: { id: resumeId },
            data: {
              vectorId: resumeVector.id,
              status: 'vectorized',
            },
          });
        }
      }

      // 步骤 4: 查找匹配的岗位
      console.log(`🔍 查找与简历 ${resumeId} 匹配的岗位`);
      const topK = 10;
      const matches = await this.findMatchingJobs(resumeId, topK);

      // 步骤 5: 获取原始岗位数据（不包含向量）
      const jobIds = matches.map(match => match.job.id);
      const rawJobsData = await jobsPrisma.job_posting.findMany({
        where: { topic_id: { in: jobIds } },
      });

      // 按照匹配分数排序原始岗位数据
      const sortedRawJobs = jobIds
        .map(id => rawJobsData.find(job => job.topic_id.toString() === id))
        .filter((job): job is NonNullable<typeof job> => job !== undefined);

      // 更新简历状态为已匹配
      await resumePrisma.resume.update({
        where: { id: resumeId },
        data: { status: 'matched' },
      });

      // 清理matches中的向量数据
      const cleanedMatches = matches.map(match => ({
        ...match,
        job: {
          ...match.job,
          vector: undefined, // 移除向量数据
          embedding: undefined, // 移除embedding数据
        },
      }));

      return {
        resumeData: resumeForProcessing,
        matches: cleanedMatches,
        rawJobsData: sortedRawJobs,
      };
    } catch (error) {
      console.error(`处理简历 ${resumeId} 并查找匹配岗位失败:`, error);
      throw error;
    }
  },

  /**
   * 对指定的简历和岗位对进行一对一的AI增强匹配分析
   * @param resumeId 简历ID
   * @param jobId 岗位ID
   * @returns 详细的匹配分析结果
   */
  async getEnhancedMatchingForPair(
    resumeId: string,
    jobId: string
  ): Promise<import('./types').EnhancedMatch> {
    try {
      // 获取简历数据
      const resume = await resumePrisma.resume.findUnique({
        where: { id: resumeId },
      });

      if (!resume) {
        throw new Error(`找不到ID为 ${resumeId} 的简历`);
      }

      // 获取岗位数据
      const job = await jobsPrisma.job_posting.findUnique({
        where: { topic_id: jobId },
      });

      if (!job) {
        throw new Error(`找不到ID为 ${jobId} 的岗位`);
      }

      // 准备AI服务需要的数据格式
      const resumeForAI: Resume = {
        id: resume.id,
        userId: resume.userId,
        content: resume.content,
        name: resume.title || '',
        parsedData:
          typeof resume.parsedData === 'object' && resume.parsedData !== null
            ? (resume.parsedData as Resume['parsedData'])
            : undefined,
      };

      const jobForAI: Job = {
        id: job.topic_id.toString(),
        title: job.position_name,
        description: job.content || '',
        companyName: job.company || undefined,
        responsibilities: job.content || '',
        requirements: job.content2 || '',
        salaryRange:
          job.min_salary && job.max_salary ? `${job.min_salary}-${job.max_salary}` : undefined,
        location: job.location || undefined,
        skills: [],
        level: job.lever_name || undefined,
      };

      // 调用AI服务进行匹配分析
      const matchDetails = await aiService.enhanceMatching(resumeForAI, jobForAI);

      // 返回匹配结果
      return {
        job: jobForAI,
        matchDetails,
      };
    } catch (error) {
      console.error(`简历 ${resumeId} 和岗位 ${jobId} 的匹配分析失败:`, error);
      throw error;
    }
  },
};
