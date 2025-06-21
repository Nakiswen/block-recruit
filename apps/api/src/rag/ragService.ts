import { PineconeClient } from './pineconeClient';
import { embeddingService } from './embeddingService';
import { SearchOptions, SearchResult, PineconeIndexType } from './types';
import { jobsPrisma, resumePrisma } from '@/prisma/client';
import { aiService } from '@/ai/aiService';
import { Job, Resume } from './types';

// Pinecone搜索结果类型
type PineconeSearchResult = {
  id: string;
  score: number;
  metadata: Record<string, any>;
  vector?: number[];
};

/**
 * RAG服务，提供向量存储和检索功能
 */
export const ragService = {
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
   * @returns 处理后的向量ID
   */
  async processJob(job: Job) {
    try {
      // 从岗位描述中提取结构化信息
      const structuredData = await this.extractJobStructuredData(job);
      
      // 生成岗位的向量表示
      const vector = await embeddingService.generateEmbedding(
        this.formatJobForEmbedding(job, structuredData)
      );

      // 存储向量到向量数据库
      const vectorId = `job_${job.id}`;
      await PineconeClient.upsert({
        id: vectorId,
        vector: vector,
        metadata: {
          id: job.id,
          title: job.title,
          company: job.companyName,
          required_skills: structuredData.requiredSkills,
          preferred_skills: structuredData.preferredSkills,
          experience_years: structuredData.experienceYears,
          education_level: structuredData.educationLevel,
          industry: structuredData.industry,
          salary_range: job.salaryRange,
          location: job.location,
          job_level: structuredData.jobLevel,
          update_time: new Date().toISOString()
        }
      });

      return vectorId;
    } catch (error) {
      console.error('处理岗位失败:', error);
      throw error;
    }
  },

  /**
   * 处理简历信息，生成向量并存储
   * @param resumeId 简历ID
   * @returns 处理后的向量ID
   */
  async processResume(resumeId: string) {
    try {
      // 获取简历数据
      const resumeData = await resumePrisma.resume.findUnique({
        where: { id: resumeId }
      });

      if (!resumeData) {
        throw new Error('未找到指定的简历');
      }

      // 构建简历对象
      const resume: Resume = {
        id: resumeData.id,
        userId: resumeData.userId,
        content: resumeData.content,
        parsedContent: resumeData.parsedContent || undefined,
        // 以下字段可能需要从解析的内容中获取
        skills: [],
        experienceYears: 0,
        educationLevel: '',
        industry: '',
        location: '',
        summary: '',
        workExperience: '',
        projects: '',
        education: ''
      };

      // 从简历中提取结构化信息
      const structuredData = await this.extractResumeStructuredData(resume);
      
      // 生成简历的向量表示
      const vector = await embeddingService.generateEmbedding(
        this.formatResumeForEmbedding(resume, structuredData)
      );

      // 存储向量到向量数据库
      const vectorId = `resume_${resume.id}`;
      await PineconeClient.upsert({
        id: vectorId,
        vector: vector,
        metadata: {
          id: resume.id,
          owner: resume.userId,
          skills: structuredData.skills,
          experience_years: structuredData.experienceYears,
          education_level: structuredData.educationLevel,
          industry_experience: structuredData.industryExperience,
          location: structuredData.location,
          update_time: new Date().toISOString()
        }
      });

      return vectorId;
    } catch (error) {
      console.error('处理简历失败:', error);
      throw error;
    }
  },

  /**
   * 获取岗位向量信息
   * @param jobId 岗位ID
   * @returns 岗位向量信息，如果不存在则返回null
   */
  async getJobVector(jobId: string) {
    try {
      const vectorId = `job_${jobId}`;
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
   * @param resumeId 简历ID
   * @returns 简历向量信息，如果不存在则返回null
   */
  async getResumeVector(resumeId: string) {
    try {
      const vectorId = `resume_${resumeId}`;
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
   * @param options 查询选项
   * @returns 相似岗位列表
   */
  async findSimilarJobs(vector: number[], options: SearchOptions): Promise<SearchResult> {
    try {
      const startTime = Date.now();
      
      // 执行向量搜索，指定使用岗位索引
      const searchResults = await PineconeClient.search({
        vector,
        topK: options.topK || 50,
        filter: options.filters || {},
        minScore: options.minScore || 0.5,
        indexType: PineconeIndexType.JOB
      });
      
      const searchTimeMs = Date.now() - startTime;
      
      return {
        matches: searchResults.map((result: PineconeSearchResult) => ({
          id: result.metadata.id,
          score: result.score,
          metadata: result.metadata
        })),
        totalCandidates: searchResults.length,
        searchTimeMs
      };
    } catch (error) {
      console.error('查找相似岗位失败:', error);
      throw error;
    }
  },

  /**
   * 查找与指定向量相似的简历
   * @param vector 查询向量
   * @param options 查询选项
   * @returns 相似简历列表
   */
  async findSimilarResumes(vector: number[], options: SearchOptions): Promise<SearchResult> {
    try {
      const startTime = Date.now();
      
      // 执行向量搜索，指定使用简历索引
      const searchResults = await PineconeClient.search({
        vector,
        topK: options.topK || 50,
        filter: options.filters || {},
        minScore: options.minScore || 0.5,
        indexType: PineconeIndexType.RESUME
      });
      
      const searchTimeMs = Date.now() - startTime;
      
      return {
        matches: searchResults.map((result: PineconeSearchResult) => ({
          id: result.metadata.id,
          score: result.score,
          metadata: result.metadata
        })),
        totalCandidates: searchResults.length,
        searchTimeMs
      };
    } catch (error) {
      console.error('查找相似简历失败:', error);
      throw error;
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
      const vectorId = `resume_${resumeId}`;
      await PineconeClient.delete(vectorId);
    } catch (error) {
      console.error('删除简历向量失败:', error);
      throw error;
    }
  },

  /**
   * 从岗位中提取结构化数据
   * @param job 岗位数据
   * @returns 结构化的岗位信息
   */
  async extractJobStructuredData(job: Job): Promise<{
    requiredSkills: string[];
    preferredSkills: string[];
    experienceYears: number;
    educationLevel: string;
    industry: string;
    jobLevel: string;
  }> {
    // 通过AI服务从job中提取结构化信息
    // 构造AI服务需要的Job对象，补全必需字段
    const aiJob = {
      id: job.id,
      title: job.title,
      description: job.description,
      companyName: job.companyName || '',
      responsibilities: job.responsibilities || '',
      requirements: job.requirements || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      jobType: '',
      weights: {},
      parsedRequirements: {},
      vectorMetadata: {}
    };
    const aiResult = await aiService.extractJobInfo(aiJob);
    return {
      requiredSkills: aiResult.requiredSkills,
      preferredSkills: aiResult.preferredSkills,
      experienceYears: aiResult.experienceYears,
      educationLevel: aiResult.educationLevel,
      industry: aiResult.industry,
      jobLevel: aiResult.jobLevel
    };
  },

  /**
   * 从简历中提取结构化数据
   * @param resume 简历数据
   * @returns 结构化的简历信息
   */
  async extractResumeStructuredData(resume: Resume): Promise<{
    skills: string[];
    experienceYears: number;
    educationLevel: string;
    industryExperience: string[];
    location: string;
  }> {
    // 通过AI服务从简历中提取结构化信息
    // 构造AI服务需要的Resume对象，补全必需字段
    const aiResume = {
      id: resume.id,
      userId: resume.userId,
      content: resume.content,
      parsedContent: resume.parsedContent || undefined,
      skills: resume.skills || [],
      experienceYears: resume.experienceYears || 0,
      educationLevel: resume.educationLevel || '',
      industry: resume.industry || '',
      location: resume.location || ''
    };
    const aiResult = await aiService.extractResumeInfo(aiResume);
    return {
      skills: aiResult.skills || [],
      experienceYears: aiResult.experienceYears || 0,
      educationLevel: aiResult.educationLevel || '',
      industryExperience: aiResult.industryExperience || [],
      location: aiResult.location || ''
    };
  },

  /**
   * 格式化岗位信息用于生成embedding
   * @param job 岗位数据
   * @param structuredData 结构化岗位数据
   * @returns 格式化后的文本
   */
  formatJobForEmbedding(job: Job, structuredData: {
    requiredSkills: string[];
    preferredSkills: string[];
    experienceYears: number;
    educationLevel: string;
    industry: string;
    jobLevel: string;
  }): string {
    return `
      职位标题: ${job.title}
      公司名称: ${job.companyName || ''}
      工作地点: ${job.location || ''}
      薪资范围: ${job.salaryRange || ''}
      岗位描述: ${job.description || ''}
      岗位职责: ${job.responsibilities || ''}
      必备技能: ${structuredData.requiredSkills.join(', ')}
      加分技能: ${structuredData.preferredSkills.join(', ')}
      工作经验要求: ${structuredData.experienceYears}年
      学历要求: ${structuredData.educationLevel}
      行业: ${structuredData.industry}
      岗位级别: ${structuredData.jobLevel}
    `;
  },

  /**
   * 格式化简历信息用于生成embedding
   * @param resume 简历数据
   * @param structuredData 结构化简历数据
   * @returns 格式化后的文本
   */
  formatResumeForEmbedding(resume: Resume, structuredData: {
    skills: string[];
    experienceYears: number;
    educationLevel: string;
    industryExperience: string[];
    location: string;
  }): string {
    return `
      姓名: ${resume.name || ''}
      技能: ${structuredData.skills.join(', ')}
      工作经验: ${structuredData.experienceYears}年
      学历: ${structuredData.educationLevel}
      行业经验: ${structuredData.industryExperience.join(', ')}
      工作地点: ${structuredData.location}
      个人简介: ${resume.summary || ''}
      工作经历: ${resume.workExperience || ''}
      项目经历: ${resume.projects || ''}
      教育背景: ${resume.education || ''}
    `;
  }
}; 