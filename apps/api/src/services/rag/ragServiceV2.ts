/**
 * RAG 服务 V2 版本
 * 提供增强的向量存储和检索功能，支持技能标准化和统一标签结构
 */

import { PineconeClient } from './pineconeClient.js';
import { embeddingService } from './embeddingService.js';
import { Job, Resume, UnifiedMetadata, MatchingResult, PineconeIndexType } from './types.js';
import { jobsPrisma, resumePrisma } from '@/prisma/client.js';
import {
  aiServiceEnhanced,
  EnhancedResumeInfo,
  EnhancedJobInfo,
} from '@/services/ai/aiServiceEnhanced.js';
import { matchingService } from './matchingService.js';
import { ragService } from './ragService.js';
import type { InputJsonValue } from '@prisma/client/runtime/library';

// 最大 Embedding 文本长度
const MAX_EMBEDDING_TEXT_LENGTH = 4000;

/**
 * RAG 服务 V2
 */
export const ragServiceV2 = {
  /**
   * V2 版本：格式化简历用于 Embedding
   * 技能优先，使用结构化格式，限制长度
   */
  formatResumeForEmbeddingV2(resume: Resume, enhancedInfo: EnhancedResumeInfo): string {
    const parts: string[] = [];

    // 1. 标准化技能放最前面（最重要）
    if (enhancedInfo.normalizedSkills.length > 0) {
      const skillsStr = enhancedInfo.normalizedSkills
        .map(s => s.normalized)
        .slice(0, 20)
        .join(', ');
      parts.push(`技能: ${skillsStr}`);
    }

    // 2. 技能分类
    if (enhancedInfo.skillCategories.length > 0) {
      parts.push(`技能分类: ${enhancedInfo.skillCategories.join(', ')}`);
    }

    // 3. 岗位类型
    parts.push(`目标岗位: ${enhancedInfo.targetJobType}`);

    // 4. 经验和学历
    parts.push(`工作经验: ${enhancedInfo.experienceYears || 0}年`);
    parts.push(`学历: ${enhancedInfo.educationLevel || '未知'}`);

    // 5. 行业经验
    if (enhancedInfo.industryExperience && enhancedInfo.industryExperience.length > 0) {
      parts.push(`行业经验: ${enhancedInfo.industryExperience.slice(0, 5).join(', ')}`);
    }

    // 6. 地点
    if (enhancedInfo.location) {
      parts.push(`地点: ${enhancedInfo.location}`);
    }

    // 7. 主要成就（限制数量）
    if (enhancedInfo.keyAchievements && enhancedInfo.keyAchievements.length > 0) {
      parts.push(`成就: ${enhancedInfo.keyAchievements.slice(0, 3).join('; ')}`);
    }

    // 8. 简历内容摘要（智能截取，填充剩余空间）
    const currentLength = parts.join('\n').length;
    const remainingLength = MAX_EMBEDDING_TEXT_LENGTH - currentLength - 50;

    if (remainingLength > 200 && resume.content) {
      const contentSummary = ragService.extractKeyContent(resume.content, remainingLength);
      if (contentSummary) {
        parts.push(`经历: ${contentSummary}`);
      }
    }

    const result = parts.join('\n');

    // 确保不超过最大长度
    if (result.length > MAX_EMBEDDING_TEXT_LENGTH) {
      return result.substring(0, MAX_EMBEDDING_TEXT_LENGTH);
    }

    return result;
  },

  /**
   * V2 版本：格式化岗位用于 Embedding
   * 必须技能优先，使用结构化格式，限制长度
   */
  formatJobForEmbeddingV2(job: Job, enhancedInfo: EnhancedJobInfo): string {
    const parts: string[] = [];

    // 1. 岗位标题
    parts.push(`职位: ${job.title}`);

    // 2. 标准化必须技能放前面（最重要）
    if (enhancedInfo.normalizedRequiredSkills.length > 0) {
      const requiredSkillsStr = enhancedInfo.normalizedRequiredSkills
        .map(s => s.normalized)
        .slice(0, 15)
        .join(', ');
      parts.push(`必须技能: ${requiredSkillsStr}`);
    }

    // 3. 标准化加分技能
    if (enhancedInfo.normalizedPreferredSkills.length > 0) {
      const preferredSkillsStr = enhancedInfo.normalizedPreferredSkills
        .map(s => s.normalized)
        .slice(0, 10)
        .join(', ');
      parts.push(`加分技能: ${preferredSkillsStr}`);
    }

    // 4. 技能分类
    if (enhancedInfo.skillCategories.length > 0) {
      parts.push(`技能分类: ${enhancedInfo.skillCategories.join(', ')}`);
    }

    // 5. 岗位类型
    parts.push(`岗位类型: ${enhancedInfo.jobType}`);

    // 6. 经验和学历要求
    parts.push(`经验要求: ${enhancedInfo.experienceYears || 0}年`);
    parts.push(`学历要求: ${enhancedInfo.educationLevel || '不限'}`);

    // 7. 行业和级别
    if (enhancedInfo.industry) {
      parts.push(`行业: ${enhancedInfo.industry}`);
    }
    if (enhancedInfo.jobLevel) {
      parts.push(`级别: ${enhancedInfo.jobLevel}`);
    }

    // 8. 地点
    if (job.location) {
      parts.push(`地点: ${job.location}`);
    }

    // 9. 公司
    if (job.companyName) {
      parts.push(`公司: ${job.companyName}`);
    }

    // 10. 职责摘要（智能截取，填充剩余空间）
    const currentLength = parts.join('\n').length;
    const remainingLength = MAX_EMBEDDING_TEXT_LENGTH - currentLength - 50;

    if (remainingLength > 200) {
      const jobContent = [job.responsibilities, job.requirements, job.description]
        .filter(Boolean)
        .join('\n');
      if (jobContent) {
        const contentSummary = ragService.extractKeyContent(jobContent, remainingLength);
        if (contentSummary) {
          parts.push(`职责要求: ${contentSummary}`);
        }
      }
    }

    const result = parts.join('\n');

    // 确保不超过最大长度
    if (result.length > MAX_EMBEDDING_TEXT_LENGTH) {
      return result.substring(0, MAX_EMBEDDING_TEXT_LENGTH);
    }

    return result;
  },

  /**
   * V2 版本：处理岗位
   * 使用增强的标签提取和向量化流程
   */
  async processJobV2(job: Job): Promise<{
    vectorId: string;
    vectorizeSuccess: boolean;
    metadata: UnifiedMetadata;
    error?: string;
  }> {
    try {
      console.log(`🔍 V2 处理岗位: ${job.id}`);

      // 1. 使用增强版 AI 服务提取信息
      const enhancedInfo = await aiServiceEnhanced.extractJobInfoEnhanced(job);

      // 2. 使用 V2 格式化方法生成 Embedding 文本
      const embeddingText = this.formatJobForEmbeddingV2(job, enhancedInfo);
      console.log(`📝 V2 Embedding 文本长度: ${embeddingText.length}`);

      // 3. 生成向量
      const vector = await embeddingService.generateEmbedding(embeddingText);

      // 4. 构建统一 Metadata
      const metadata: UnifiedMetadata = {
        id: job.id,
        type: 'job',
        normalized_skills: enhancedInfo.unifiedTags.normalizedSkills,
        skill_categories: enhancedInfo.unifiedTags.skillCategories,
        experience_years: enhancedInfo.unifiedTags.experienceYears,
        education_level: enhancedInfo.unifiedTags.educationLevel,
        job_type: enhancedInfo.unifiedTags.jobType,
        location: job.location || '',
        industry: enhancedInfo.unifiedTags.industry,
        update_time: new Date().toISOString(),
        // 岗位特有字段
        company: job.companyName,
        title: job.title,
        required_skills: enhancedInfo.parsedRequiredSkills,
        preferred_skills: enhancedInfo.parsedPreferredSkills,
        job_level: enhancedInfo.jobLevel,
      };

      // 5. 存储向量
      const vectorId = `job_${job.id}`;
      const upsertResult = await PineconeClient.upsert(
        {
          id: vectorId,
          vector,
          metadata: metadata as unknown as Record<string, string | number | boolean | string[]>,
        },
        PineconeIndexType.JOB
      );

      // 6. 缓存向量
      ragService.cacheVector(
        vectorId,
        vector,
        metadata as unknown as Record<
          string,
          string | number | boolean | string[] | null | undefined
        >
      );

      console.log(`✅ V2 岗位处理完成: ${job.id}, 向量化${upsertResult.success ? '成功' : '失败'}`);

      return {
        vectorId,
        vectorizeSuccess: upsertResult.success,
        metadata,
      };
    } catch (error) {
      console.error(`❌ V2 处理岗位失败: ${job.id}`, error);
      return {
        vectorId: `job_${job.id}`,
        vectorizeSuccess: false,
        metadata: {} as UnifiedMetadata,
        error: error instanceof Error ? error.message : '未知错误',
      };
    }
  },

  /**
   * V2 版本：处理简历并查找匹配岗位
   * 使用新的匹配流程：硬性过滤 + 向量召回 + 标签精排
   */
  async processResumeAndFindMatchesV2(resumeId: string): Promise<{
    resumeData: Resume;
    matches: MatchingResult[];
    rawJobsData: Record<string, unknown>[];
  }> {
    try {
      console.log(`🔍 V2 处理简历并查找匹配: ${resumeId}`);

      // 1. 获取简历数据
      const resume = await resumePrisma.resume.findUnique({
        where: { id: resumeId },
      });

      if (!resume) {
        throw new Error(`简历 ${resumeId} 不存在`);
      }

      const resumeForProcessing: Resume = {
        id: resume.id,
        userId: resume.userId,
        content: resume.content,
        name: resume.title || undefined,
        parsedData: resume.parsedData as Resume['parsedData'],
      };

      // 2. 使用增强版 AI 服务提取信息
      console.log(`🔍 V2 提取简历结构化信息...`);
      const enhancedInfo = await aiServiceEnhanced.extractResumeInfoEnhanced(resumeForProcessing);

      // 3. 使用 V2 格式化方法生成 Embedding 文本
      const embeddingText = this.formatResumeForEmbeddingV2(resumeForProcessing, enhancedInfo);
      console.log(`📝 V2 Embedding 文本长度: ${embeddingText.length}`);

      // 4. 生成向量
      const vector = await embeddingService.generateEmbedding(embeddingText);

      // 5. 构建统一 Metadata
      const metadata: UnifiedMetadata = {
        id: resume.id,
        type: 'resume',
        normalized_skills: enhancedInfo.unifiedTags.normalizedSkills,
        skill_categories: enhancedInfo.unifiedTags.skillCategories,
        experience_years: enhancedInfo.unifiedTags.experienceYears,
        education_level: enhancedInfo.unifiedTags.educationLevel,
        job_type: enhancedInfo.unifiedTags.jobType,
        location: enhancedInfo.location || '',
        industry: enhancedInfo.unifiedTags.industry,
        update_time: new Date().toISOString(),
        // 简历特有字段
        owner: resume.userId,
      };

      // 6. 存储向量
      const vectorId = `resume_${resume.id}`;
      await PineconeClient.upsert(
        {
          id: vectorId,
          vector,
          metadata: metadata as unknown as Record<string, string | number | boolean | string[]>,
        },
        PineconeIndexType.RESUME
      );

      // 7. 缓存向量
      ragService.cacheVector(
        vectorId,
        vector,
        metadata as unknown as Record<
          string,
          string | number | boolean | string[] | null | undefined
        >
      );

      // 8. 更新简历解析数据
      await resumePrisma.resume.update({
        where: { id: resumeId },
        data: {
          parsedData: {
            ...enhancedInfo,
            normalizedSkills: enhancedInfo.normalizedSkills.map(s => s.normalized),
          } as unknown as InputJsonValue,
          vectorId,
          status: 'vectorized',
        },
      });

      // 9. 使用 MatchingService 查找匹配岗位
      console.log(`🔍 V2 使用 MatchingService 查找匹配岗位...`);
      const matches = await matchingService.findMatchingJobsForResume(
        enhancedInfo.unifiedTags,
        vector,
        {
          vectorRecallTopK: 50,
          finalTopK: 10,
        }
      );

      // 10. 获取原始岗位数据
      const jobIds = matches.map(m => m.id.replace('job_', ''));
      const rawJobsData = await jobsPrisma.job_posting.findMany({
        where: { topic_id: { in: jobIds } },
      });

      // 按匹配分数排序
      const sortedRawJobs = jobIds
        .map(id => rawJobsData.find(job => job.topic_id.toString() === id))
        .filter((job): job is NonNullable<typeof job> => job !== undefined);

      // 11. 更新简历状态
      await resumePrisma.resume.update({
        where: { id: resumeId },
        data: { status: 'matched' },
      });

      console.log(`✅ V2 简历处理完成: ${resumeId}, 找到 ${matches.length} 个匹配岗位`);

      return {
        resumeData: resumeForProcessing,
        matches,
        rawJobsData: sortedRawJobs,
      };
    } catch (error) {
      console.error(`❌ V2 处理简历失败: ${resumeId}`, error);
      throw error;
    }
  },

  /**
   * V2 版本：为岗位查找匹配的简历
   */
  async findMatchingResumesForJobV2(
    jobId: string,
    topK: number = 10
  ): Promise<{
    jobData: Job;
    matches: MatchingResult[];
  }> {
    try {
      console.log(`🔍 V2 为岗位查找匹配简历: ${jobId}`);

      // 1. 获取岗位数据
      const jobRecord = await jobsPrisma.job_posting.findUnique({
        where: { topic_id: jobId },
      });

      if (!jobRecord) {
        throw new Error(`岗位 ${jobId} 不存在`);
      }

      const job: Job = {
        id: jobRecord.topic_id.toString(),
        title: jobRecord.position_name,
        description: jobRecord.content || '',
        companyName: jobRecord.company || undefined,
        responsibilities: jobRecord.content || '',
        requirements: jobRecord.content2 || '',
        location: jobRecord.location || undefined,
        skills: [],
        level: jobRecord.lever_name || undefined,
      };

      // 2. 使用增强版 AI 服务提取信息
      const enhancedInfo = await aiServiceEnhanced.extractJobInfoEnhanced(job);

      // 3. 生成向量
      const embeddingText = this.formatJobForEmbeddingV2(job, enhancedInfo);
      const vector = await embeddingService.generateEmbedding(embeddingText);

      // 4. 使用 MatchingService 查找匹配简历
      const matches = await matchingService.findMatchingResumesForJob(
        {
          ...enhancedInfo.unifiedTags,
          requiredSkills: enhancedInfo.parsedRequiredSkills,
        },
        vector,
        {
          vectorRecallTopK: 50,
          finalTopK: topK,
        }
      );

      console.log(`✅ V2 岗位匹配完成: ${jobId}, 找到 ${matches.length} 个匹配简历`);

      return {
        jobData: job,
        matches,
      };
    } catch (error) {
      console.error(`❌ V2 为岗位查找匹配简历失败: ${jobId}`, error);
      throw error;
    }
  },
};
