import { PineconeClient } from './pineconeClient';
import { embeddingService } from './embeddingService';
import { SearchOptions, SearchResult, PineconeIndexType, PineconeSearchParams, Match, ResumeVector } from './types';
import { jobsPrisma, resumePrisma } from '@/prisma/client';
import { aiService } from '@/services/ai/aiService';
import { Job, Resume } from './types';
import { SmartFilterBuilder, SearchType } from './smartFilterBuilder';


/**
 * RAG服务，提供向量存储和检索功能
 */
export const ragService = {
  // 向量内存缓存，用于临时存储刚处理的向量数据，避免Pinecone索引延迟问题
  vectorCache: new Map<string, {
    vector: number[];
    metadata: Record<string, any>;
    timestamp: number;
  }>(),

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
  cacheVector(id: string, vector: number[], metadata: Record<string, any>) {
    this.vectorCache.set(id, {
      vector,
      metadata,
      timestamp: Date.now()
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
        where: { topic_id: { in: jobIds.map(id => BigInt(id)) } }
      });

      if (!jobs.length) {
        throw new Error('未找到指定的岗位');
      }

      const results = {
        total: jobs.length,
        success: 0,
        failed: 0,
        errors: [] as string[]
      };

      // 批量处理岗位
      for (const job of jobs) {
        try {
          const jobData: Job = {
            id: job.topic_id.toString(),
            title: job.position_name,
            description: job.content || '',
            companyName: job.company,
            salaryRange: job.min_salary && job.max_salary ? 
              `${job.min_salary}-${job.max_salary}` : undefined,
            location: job.location || undefined,
            responsibilities: job.content2 || undefined,
            requirements: job.content3 || undefined,
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
        update_time: new Date().toISOString()
      };

      console.log("🚀 ~ processJob ~ metadata:", metadata)
      // 存储向量到向量数据库
      const vectorId = `job_${job.id}`;
      const upsertResult = await PineconeClient.upsert({
        id: vectorId,
        vector: vector,
        metadata: metadata
      }, PineconeIndexType.JOB);

      // 同时将向量保存到内存缓存，以便立即使用
      this.cacheVector(vectorId, vector, metadata);
      console.log(`📦 岗位向量已保存到内存缓存: ${vectorId}`);

      // 判断向量存储是否成功
      const isVectorizeSuccess = upsertResult.success;
      console.log(`🚀 ${isVectorizeSuccess ? '✅ 成功' : '❌ 失败'} 向量化岗位 ${job.id}, vectorId: ${vectorId}`);

      return {
        vectorId,
        vectorizeSuccess: isVectorizeSuccess,
        upsertResult,
        vector: vector,
        metadata: metadata
      };
    } catch (error) {
      console.error('处理岗位失败:', error);
      return {
        id: job.id,
        vectorizeSuccess: false,
        error: error instanceof Error ? error.message : '未知错误'
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
    upsertResult?: { success: boolean; count: number; data?: any; error?: string };
    id: string;
    vector?: number[];
    metadata?: Record<string, any>;
    error?: string;
  }> {
    try {
      let structuredData: {
        skills: string[];
        experienceYears: number;
        educationLevel: string;
        industryExperience: string[];
        location: string;
        keyAchievements: string[];
        salaryFlexible?: boolean;
      };
      
      // 检查简历是否已有解析结果(parsedData)，如果有则直接使用，避免重复解析
      if (resume.parsedData && typeof resume.parsedData === 'object' && 
          'skills' in resume.parsedData && 
          'educationLevel' in resume.parsedData && 
          'experienceYears' in resume.parsedData) {
        
        console.log(`🔄 使用简历 ${resume.id} 已有的解析数据，跳过AI解析`);
        // 直接使用已存在的解析数据，确保格式符合要求
        structuredData = {
          skills: Array.isArray(resume.parsedData.skills) ? resume.parsedData.skills : [],
          experienceYears: Number(resume.parsedData.experienceYears) || 0,
          educationLevel: String(resume.parsedData.educationLevel || '未知'),
          industryExperience: Array.isArray(resume.parsedData.industryExperience) ? 
                            resume.parsedData.industryExperience : [],
          location: String(resume.parsedData.location || '未知'),
          keyAchievements: Array.isArray(resume.parsedData.keyAchievements) ? 
                          resume.parsedData.keyAchievements : [],
          salaryFlexible: Boolean(resume.parsedData.salaryFlexible)
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
        update_time: new Date().toISOString()
      };

      // 存储向量到向量数据库
      const vectorId = `resume_${resume.id}`;
      const upsertResult = await PineconeClient.upsert({
        id: vectorId,
        vector: vector,
        metadata: metadata
      }, PineconeIndexType.RESUME);
      
      // 同时将向量保存到内存缓存，以便立即使用
      this.cacheVector(vectorId, vector, metadata);
      console.log(`📦 向量已保存到内存缓存: ${vectorId}`);
      
      // 判断向量存储是否成功
      const isVectorizeSuccess = upsertResult.success;
      
      console.log(`🚀 ${isVectorizeSuccess ? '✅ 成功' : '❌ 失败'} 向量化简历 ${resume.id}, vectorId: ${vectorId}`);
      
      // 返回详细的结果对象
      return {
        id: resume.id,
        vectorId,
        vectorizeSuccess: isVectorizeSuccess,
        upsertResult,
        vector, // 显式返回向量数据
        metadata // 显式返回元数据
      };
    } catch (error) {
      console.error('处理简历失败:', error);
      // 发生错误时，返回错误状态
      return {
        id: resume.id,
        vectorizeSuccess: false,
        error: error instanceof Error ? error.message : '未知错误'
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
  async findMatchingJobs(resumeId: string, topK: number = 5, filters: Record<string, any> = {}): Promise<import('./types').EnhancedMatch[]> {
    try {
      // 1. 获取简历向量
      const resumeVector = await this.getResumeVector(resumeId);
      if (!resumeVector?.vector) {
        console.log('⚠️ 未找到简历向量，无法进行匹配');
        return [];
      }
      
      // 2. 使用向量相似度查找匹配的岗位
      console.log('🔍 根据向量相似度查找匹配岗位...');
      console.log("🚀 ~ findMatchingJobs ~ resumeVector.vector:", resumeVector.vector)
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
        searchResult.matches.map(async (match) => {
          try {
            // 从元数据中提取岗位ID
            let jobId = match?.id;
            if (!jobId) {
              throw new Error('岗位ID未找到');
            } else {
              jobId = jobId.split('_')[1];
            }
            console.log("🚀 ~ searchResult.matches.map ~ jobId:", jobId)
            
            // 获取完整的岗位信息
            const job = await jobsPrisma.job_posting.findUnique({
              where: { topic_id: BigInt(jobId) }
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
              responsibilities: job.content2 || undefined,
              requirements: job.content3 || undefined,
              salaryRange: job.min_salary && job.max_salary ? 
                `${job.min_salary}-${job.max_salary}` : undefined,
              location: job.location || undefined,
              skills: [],
              level: job.lever_name || undefined,
            };
            
            // 4. 对每个岗位进行详细分析
            let matchDetails;
            try {
              const resume = await resumePrisma.resume.findUnique({
                where: { id: resumeId }
              });
              console.log("🚀 ~ searchResult.matches.map ~ resume:", resume)
              
              if (resume) {
                const resumeData: Resume = {
                  id: resume.id,
                  userId: resume.userId,
                  content: resume.content,
                  name: resume.title || '',
                  parsedData: resume.parsedData as any
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
              }
            };
          } catch (error) {
            console.error(`处理匹配岗位时出错:`, error);
            return null;
          }
        })
      );
      
      // 过滤出有效的结果并返回
      return enhancedMatches.filter(Boolean) as import('./types').EnhancedMatch[];
      
    } catch (error) {
      console.error('查找匹配岗位失败:', error);
      throw error;
    }
  },

  /**
   * 为指定岗位查找匹配的简历，并进行AI增强分析。
   * @param jobId 岗位ID
   * @param topK 返回的结果数量
   * @param filters 过滤条件
   * @returns 包含AI分析的简历匹配列表
   */
  async findMatchingResumes(jobId: string, topK: number, filters: Record<string, any> = {}): Promise<import('./types').EnhancedMatchForResume[]> {
    // 1. 获取岗位向量
    let jobVector = await this.getJobVector(jobId);
    if (!jobVector?.vector) {
      const jobData = await jobsPrisma.job_posting.findUnique({ where: { topic_id: BigInt(jobId) }});
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
    const job = await jobsPrisma.job_posting.findUnique({ where: { topic_id: BigInt(jobId) }});
    if (!job) throw new Error(`找不到ID为 ${jobId} 的岗位`);

    // 将岗位数据转换为AI服务需要的格式，避免每个简历都重新提取岗位结构化数据
    const jobForAI: Job = {
      id: job.topic_id.toString(),
      title: job.position_name,
      description: job.content || '',
      companyName: job.company || undefined,
      responsibilities: job.content2 || undefined,
      requirements: job.content3 || undefined,
      salaryRange: job.min_salary && job.max_salary ? 
        `${job.min_salary}-${job.max_salary}` : undefined,
      location: job.location || undefined,
      skills: [],
      level: job.lever_name || undefined,
    };

    const enhancedMatches = await Promise.all(
      resumes.map(async (resume) => {
        // 为每个简历创建适配AI服务的对象
        const resumeForAI = {
          id: resume.id,
          userId: resume.userId,
          content: resume.content,
          name: resume.title || undefined,
          parsedData: resume.parsedData || undefined
        } as Resume;
        
        const matchDetails = await aiService.enhanceMatching(resumeForAI, jobForAI);
        return { resume, matchDetails };
      })
    );

    // 按AI评分排序
    enhancedMatches.sort((a, b) => b.matchDetails.score - a.matchDetails.score);

    return enhancedMatches as import('./types').EnhancedMatchForResume[];
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
          metadata: cachedVector.metadata
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
        metadata: vector.metadata
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
          metadata: cachedVector.metadata
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
        metadata: vector.metadata
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
        indexType: PineconeIndexType.JOB
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
      console.log("🚀 ~ findSimilarJobs ~ searchResult:", searchResult);
      
      // 如果搜索失败，返回空结果
      if (!searchResult.success) {
        console.warn(`⚠️ 向量搜索失败: ${searchResult.error}`);
        return {
          matches: [],
          totalCandidates: 0,
          searchTimeMs: searchResult.searchTimeMs || 0,
          searchSuccess: false,
          error: searchResult.error
        };
      }
      
      // 如果有最小分数要求，过滤结果
      let matches = searchResult.matches || [];
      if (options.minScore && options.minScore > 0) {
        matches = matches.filter(match => (match.score || 0) >= (options.minScore || 0));
      }
      
      return {
        matches,
        totalCandidates: searchResult.count || 0,
        searchTimeMs: searchResult.searchTimeMs || 0,
        searchSuccess: true
      };
    } catch (error) {
      console.error('简历向量搜索失败:', error);
      return {
        matches: [],
        totalCandidates: 0,
        searchTimeMs: 0,
        searchSuccess: false,
        error: error instanceof Error ? error.message : '未知错误'
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
        indexType: PineconeIndexType.RESUME
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
          error: searchResult.error
        };
      }
      
      // 如果有最小分数要求，过滤结果
      let matches = searchResult.matches || [];
      if (options.minScore && options.minScore > 0) {
        matches = matches.filter(match => (match.score || 0) >= (options.minScore || 0));
      }
      
      return {
        matches,
        totalCandidates: searchResult.count || 0,
        searchTimeMs: searchResult.searchTimeMs || 0,
        searchSuccess: true
      };
    } catch (error) {
      console.error('简历向量搜索失败:', error);
      return {
        matches: [],
        totalCandidates: 0,
        searchTimeMs: 0,
        searchSuccess: false,
        error: error instanceof Error ? error.message : '未知错误'
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
        jobLevel: jobInfo.jobLevel || ''
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
        jobLevel: ''
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
    experienceYears: number;
    educationLevel: string;
    industryExperience: string[];
    location: string;
    keyAchievements: string[];
  }> {
    // 这里简单地调用AI服务
    return await aiService.extractResumeInfo(resume);
  },

  /**
   * 格式化岗位信息用于生成Embedding
   * @param job 岗位数据
   * @param structuredData 结构化岗位数据
   * @returns 格式化后的文本
   */
  formatJobForEmbedding(job: Job, structuredData: {
    requiredSkills: string[];
    preferredSkills: string[];
    parsedRequiredSkills: string[];
    parsedPreferredSkills: string[];
    experienceYears: number;
    educationLevel: string;
    industry: string;
    jobLevel: string;
    salaryFlexible?: boolean;
  }): string {
    // 构建用于生成向量的文本
    return `
职位标题: ${job.title || ''}
公司名称: ${job.companyName || ''}
职位描述: ${job.description || ''}
职位要求: ${job.requirements || ''}
职位职责: ${job.responsibilities || ''}
必备技能: ${structuredData.requiredSkills?.join(', ') || ''}
加分技能: ${structuredData.preferredSkills?.join(', ') || ''}
解析后的必备技能: ${structuredData.parsedRequiredSkills?.join(', ') || ''}
解析后的加分技能: ${structuredData.parsedPreferredSkills?.join(', ') || ''}
工作经验要求: ${structuredData.experienceYears || 0}年
学历要求: ${structuredData.educationLevel || ''}
行业: ${structuredData.industry || ''}
职位级别: ${structuredData.jobLevel || ''}
工作地点: ${job.location || ''}
薪资范围: ${job.salaryRange || ''}
    `.trim();
  },

  /**
   * 格式化简历信息用于生成Embedding
   * @param resume 简历数据
   * @param structuredData 结构化简历信息
   * @returns 用于Embedding的字符串
   */
  formatResumeForEmbedding(resume: Resume, structuredData: {
    skills: string[];
    experienceYears: number;
    educationLevel: string;
    industryExperience: string[];
    location: string;
    keyAchievements: string[];
    salaryFlexible?: boolean;
  }): string {
    // 将关键信息拼接成一个字符串
    return `
      求职者地点: ${structuredData.location}
      学历: ${structuredData.educationLevel}
      工作经验: ${structuredData.experienceYears}年
      行业经验: ${structuredData.industryExperience.join(', ')}
      技能: ${structuredData.skills.join(', ')}
      主要成就: ${structuredData.keyAchievements.join('; ')}
      简历内容: ${resume.content}
      薪资范围: ${structuredData.salaryFlexible}
    `.trim();
  },

  /**
   * 处理简历并查找匹配的岗位 - 一站式处理流程
   * 实现时序图中的完整流程：解析、向量化和匹配
   * @param resumeId 简历ID
   * @returns 包含处理后的简历数据和匹配结果
   */
  async processResumeAndFindMatches(resumeId: string): Promise<{
    resumeData: Resume;
    matches: import('./types').EnhancedMatch[];
  }> {
    try {
      // 步骤 1: 获取简历数据
      const resume = await resumePrisma.resume.findUnique({ 
        where: { id: resumeId } 
      });
      
      if (!resume) {
        throw new Error(`找不到ID为 ${resumeId} 的简历`);
      }
      
      // 步骤 2: 准备简历对象
      const resumeForProcessing: Resume = {
        id: resume.id,
        userId: resume.userId,
        content: resume.content,
        name: resume.title || '',
        // 使用类型断言将数据库中的JSON值转换为Resume接口需要的类型
        parsedData: (typeof resume.parsedData === 'object' && resume.parsedData !== null) 
          ? resume.parsedData as any 
          : undefined
      };
      
      // 步骤 3: 解析简历（如果尚未解析）
      let structuredData;
      if (!resume.parsedData || 
          typeof resume.parsedData !== 'object' || 
          !('skills' in resume.parsedData)) {
        console.log(`🔍 简历 ${resumeId} 未解析，开始解析...`);
        structuredData = await aiService.extractResumeInfo(resumeForProcessing);
        
        // 更新简历的解析数据
        await resumePrisma.resume.update({
          where: { id: resumeId },
          data: { 
            parsedData: structuredData as any, // 使用类型断言处理 Prisma JSON 字段兼容性
            status: 'parsed'
          }
        });
        
        // 更新处理对象的parsedData
        resumeForProcessing.parsedData = structuredData;
      }
      
      // 步骤 4: 向量化简历
      console.log(`📊 开始向量化简历 ${resumeId}...`);
      // 检查向量是否已存在
      let resumeVector = await this.getResumeVector(resumeId);
      
      if (!resumeVector?.vector) {
        console.log(`🔢 简历 ${resumeId} 向量不存在，生成新向量`);
        const vectorResult = await this.vectorizeAndStoreResume(resumeForProcessing);
        
        // 使用从内存中返回的向量数据，而不是重新从Pinecone获取
        if (vectorResult.vectorizeSuccess && vectorResult.vector && vectorResult.metadata) {
          resumeVector = {
            id: vectorResult.vectorId || `resume_${resumeId}`,
            vector: vectorResult.vector,
            metadata: vectorResult.metadata
          };
        } else {
          console.log(`⚠️ 向量化失败或结果不完整，尝试从缓存获取`);
          // 再次尝试从缓存或数据库获取
          resumeVector = await this.getResumeVector(resumeId);
          
          if (!resumeVector?.vector) {
            throw new Error(`无法为简历 ${resumeId} 生成向量，匹配过程终止`);
          }
        }
      }
      
      // 步骤 5: 查找匹配的岗位
      console.log(`🔍 查找与简历 ${resumeId} 匹配的岗位...`);
      const topK = 5; // 默认返回5个匹配结果

      
      // 方案1：使用智能过滤器
      const filterParams = {
        searchType: SearchType.CANDIDATE_TO_JOB,
        candidateData: {
          parsedRequiredSkills: resumeForProcessing.parsedData?.skills || []
        }
      };
      console.log('📋 构建智能过滤器参数:', JSON.stringify(filterParams, null, 2));
      
      const filter = SmartFilterBuilder.buildFilter(filterParams);
      console.log('🔍 生成的过滤器:', JSON.stringify(filter, null, 2));
      
      // 使用内存中的向量数据查找匹配结果
      const matches = await this.findMatchingJobs(resumeId, topK, filter || {});
      
      // 步骤 6: 返回最终结果
      const updatedResume = await resumePrisma.resume.findUnique({
        where: { id: resumeId }
      });
      
      return {
        resumeData: updatedResume as Resume,
        matches
      };
    } catch (error) {
      console.error(`处理简历 ${resumeId} 失败:`, error);
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
        where: { id: resumeId }
      });
      
      if (!resume) {
        throw new Error(`找不到ID为 ${resumeId} 的简历`);
      }
      
      // 获取岗位数据
      const job = await jobsPrisma.job_posting.findUnique({
        where: { topic_id: BigInt(jobId) }
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
        parsedData: (typeof resume.parsedData === 'object' && resume.parsedData !== null) 
          ? resume.parsedData as any 
          : undefined
      };
      
      const jobForAI: Job = {
        id: job.topic_id.toString(),
        title: job.position_name,
        description: job.content || '',
        companyName: job.company || undefined,
        responsibilities: job.content2 || undefined,
        requirements: job.content3 || undefined,
        salaryRange: job.min_salary && job.max_salary ? 
          `${job.min_salary}-${job.max_salary}` : undefined,
        location: job.location || undefined,
        skills: [],
        level: job.lever_name || undefined,
      };
      
      // 调用AI服务进行匹配分析
      const matchDetails = await aiService.enhanceMatching(resumeForAI, jobForAI);
      
      // 返回匹配结果
      return {
        job: jobForAI,
        matchDetails
      };
    } catch (error) {
      console.error(`简历 ${resumeId} 和岗位 ${jobId} 的匹配分析失败:`, error);
      throw error;
    }
  },
};