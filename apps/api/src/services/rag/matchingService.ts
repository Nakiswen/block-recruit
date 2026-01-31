/**
 * 匹配服务
 * 实现硬性过滤 + 向量召回 + 标签精排的完整匹配流程
 */

import {
  UnifiedTags,
  UnifiedMetadata,
  MatchingConfig,
  MatchingResult,
  DEFAULT_MATCHING_CONFIG,
  PineconeIndexType,
} from './types.js';
import { PineconeClient } from './pineconeClient.js';
import { skillNormalizer } from './skillNormalizer.js';

/**
 * 匹配服务接口
 */
export interface IMatchingService {
  findMatchingJobsForResume(
    resumeData: UnifiedTags,
    resumeVector: number[],
    config?: Partial<MatchingConfig>
  ): Promise<MatchingResult[]>;

  findMatchingResumesForJob(
    jobData: UnifiedTags & { requiredSkills: string[] },
    jobVector: number[],
    config?: Partial<MatchingConfig>
  ): Promise<MatchingResult[]>;

  buildHardFilters(sourceData: UnifiedTags, targetType: 'resume' | 'job'): Record<string, unknown>;

  rerankByTags(
    candidates: Array<{ id: string; score: number; metadata: UnifiedMetadata }>,
    sourceData: UnifiedTags,
    requiredSkills: string[],
    config: MatchingConfig
  ): MatchingResult[];
}

/**
 * 匹配服务实现
 */
export class MatchingService implements IMatchingService {
  /**
   * 为简历查找匹配的岗位
   */
  async findMatchingJobsForResume(
    resumeData: UnifiedTags,
    resumeVector: number[],
    config?: Partial<MatchingConfig>
  ): Promise<MatchingResult[]> {
    const mergedConfig = { ...DEFAULT_MATCHING_CONFIG, ...config };

    // 阶段1: 构建硬性过滤条件
    let filters: Record<string, unknown> = {};
    if (mergedConfig.hardFilterEnabled) {
      filters = this.buildHardFilters(resumeData, 'job');
    }

    // 阶段2: 向量召回
    let searchResult = await PineconeClient.search({
      vector: resumeVector,
      topK: mergedConfig.vectorRecallTopK,
      indexType: PineconeIndexType.JOB,
      filter: Object.keys(filters).length > 0 ? filters : undefined,
      includeMetadata: true,
    });

    // 如果硬性过滤结果为空，尝试放宽条件
    if (
      mergedConfig.relaxFilterOnEmpty &&
      searchResult.matches.length === 0 &&
      Object.keys(filters).length > 0
    ) {
      console.log('硬性过滤结果为空，尝试放宽条件...');
      const relaxedFilters = this.relaxFilters(filters, resumeData);

      searchResult = await PineconeClient.search({
        vector: resumeVector,
        topK: mergedConfig.vectorRecallTopK,
        indexType: PineconeIndexType.JOB,
        filter: Object.keys(relaxedFilters).length > 0 ? relaxedFilters : undefined,
        includeMetadata: true,
      });
    }

    if (!searchResult.success || searchResult.matches.length === 0) {
      return [];
    }

    // 过滤低分结果
    const filteredMatches = searchResult.matches.filter(
      m => m.score >= mergedConfig.minVectorScore
    );

    // 阶段3: 标签精排
    const candidates = filteredMatches.map(m => ({
      id: m.id,
      score: m.score,
      metadata: m.metadata as UnifiedMetadata,
    }));

    // 从岗位 metadata 中提取必须技能
    const results = this.rerankByTags(candidates, resumeData, [], mergedConfig);

    // 返回 topK 结果
    return results.slice(0, mergedConfig.finalTopK);
  }

  /**
   * 为岗位查找匹配的简历
   */
  async findMatchingResumesForJob(
    jobData: UnifiedTags & { requiredSkills: string[] },
    jobVector: number[],
    config?: Partial<MatchingConfig>
  ): Promise<MatchingResult[]> {
    const mergedConfig = { ...DEFAULT_MATCHING_CONFIG, ...config };

    // 阶段1: 构建硬性过滤条件
    let filters: Record<string, unknown> = {};
    if (mergedConfig.hardFilterEnabled) {
      filters = this.buildHardFilters(jobData, 'resume');
    }

    // 阶段2: 向量召回
    let searchResult = await PineconeClient.search({
      vector: jobVector,
      topK: mergedConfig.vectorRecallTopK,
      indexType: PineconeIndexType.RESUME,
      filter: Object.keys(filters).length > 0 ? filters : undefined,
      includeMetadata: true,
    });

    // 如果硬性过滤结果为空，尝试放宽条件
    if (
      mergedConfig.relaxFilterOnEmpty &&
      searchResult.matches.length === 0 &&
      Object.keys(filters).length > 0
    ) {
      console.log('硬性过滤结果为空，尝试放宽条件...');
      const relaxedFilters = this.relaxFilters(filters, jobData);

      searchResult = await PineconeClient.search({
        vector: jobVector,
        topK: mergedConfig.vectorRecallTopK,
        indexType: PineconeIndexType.RESUME,
        filter: Object.keys(relaxedFilters).length > 0 ? relaxedFilters : undefined,
        includeMetadata: true,
      });
    }

    if (!searchResult.success || searchResult.matches.length === 0) {
      return [];
    }

    // 过滤低分结果
    const filteredMatches = searchResult.matches.filter(
      m => m.score >= mergedConfig.minVectorScore
    );

    // 阶段3: 标签精排
    const candidates = filteredMatches.map(m => ({
      id: m.id,
      score: m.score,
      metadata: m.metadata as UnifiedMetadata,
    }));

    const results = this.rerankByTags(candidates, jobData, jobData.requiredSkills, mergedConfig);

    // 返回 topK 结果
    return results.slice(0, mergedConfig.finalTopK);
  }

  /**
   * 构建硬性过滤条件
   */
  buildHardFilters(sourceData: UnifiedTags, targetType: 'resume' | 'job'): Record<string, unknown> {
    const filters: Record<string, unknown> = {};

    if (targetType === 'job') {
      // 简历找岗位：岗位要求的经验年限 <= 简历的经验年限
      if (sourceData.experienceYears > 0) {
        filters['experience_years'] = { $lte: sourceData.experienceYears };
      }

      // 岗位类型匹配
      if (sourceData.jobType && sourceData.jobType !== 'other') {
        filters['job_type'] = sourceData.jobType;
      }
    } else {
      // 岗位找简历：简历的经验年限 >= 岗位要求
      if (sourceData.experienceYears > 0) {
        filters['experience_years'] = { $gte: sourceData.experienceYears };
      }

      // 岗位类型匹配
      if (sourceData.jobType && sourceData.jobType !== 'other') {
        filters['job_type'] = sourceData.jobType;
      }
    }

    return filters;
  }

  /**
   * 放宽过滤条件
   */
  private relaxFilters(
    originalFilters: Record<string, unknown>,
    sourceData: UnifiedTags
  ): Record<string, unknown> {
    const relaxedFilters: Record<string, unknown> = {};

    // 放宽经验年限要求（-1年）
    if (originalFilters['experience_years']) {
      const expFilter = originalFilters['experience_years'] as Record<string, number>;
      if (expFilter.$lte !== undefined) {
        // 简历找岗位：允许岗位要求比简历经验多1年
        relaxedFilters['experience_years'] = { $lte: sourceData.experienceYears + 1 };
      } else if (expFilter.$gte !== undefined) {
        // 岗位找简历：允许简历经验比岗位要求少1年
        const relaxedValue = Math.max(0, sourceData.experienceYears - 1);
        relaxedFilters['experience_years'] = { $gte: relaxedValue };
      }
    }

    // 移除岗位类型限制（完全放宽）
    // 不再添加 job_type 过滤

    return relaxedFilters;
  }

  /**
   * 执行标签精排
   */
  rerankByTags(
    candidates: Array<{ id: string; score: number; metadata: UnifiedMetadata }>,
    sourceData: UnifiedTags,
    requiredSkills: string[],
    config: MatchingConfig
  ): MatchingResult[] {
    const results: MatchingResult[] = [];

    for (const candidate of candidates) {
      const metadata = candidate.metadata;

      // 使用 normalized_skills 进行技能匹配（这是标准化后的具体技能词）
      const jobNormalizedSkills = metadata.normalized_skills || [];

      // 调试日志：查看技能匹配情况
      console.log(`🔍 [精排] 岗位: ${metadata.title || metadata.id}`);
      console.log(`   岗位类型: ${metadata.job_type}, 简历目标: ${sourceData.jobType}`);
      console.log(`   岗位技能: ${JSON.stringify(jobNormalizedSkills.slice(0, 8))}...`);
      console.log(`   简历技能: ${JSON.stringify(sourceData.normalizedSkills.slice(0, 8))}...`);

      // 计算技能匹配度 - 使用 normalized_skills 进行匹配
      const { skillMatchScore, matchedSkills, missingSkills } =
        this.calculateSkillMatchByNormalizedSkills(
          sourceData.normalizedSkills,
          jobNormalizedSkills
        );

      // 计算岗位类型匹配度
      const jobTypeMatchScore = this.calculateJobTypeMatch(sourceData.jobType, metadata.job_type);

      console.log(
        `   技能匹配分: ${skillMatchScore.toFixed(3)}, 岗位类型匹配分: ${jobTypeMatchScore.toFixed(3)}`
      );
      console.log(
        `   匹配技能: ${matchedSkills.length}个 [${matchedSkills.slice(0, 5).join(', ')}]`
      );

      // 计算经验匹配度
      const experienceMatchScore = this.calculateExperienceMatch(
        sourceData.experienceYears,
        metadata.experience_years || 0,
        metadata.type
      );

      // 计算薪资匹配度
      const salaryMatchScore = this.calculateSalaryMatch(sourceData, metadata);

      // 计算综合得分（加入岗位类型匹配）
      const finalScore =
        skillMatchScore * config.weights.skillMatch +
        jobTypeMatchScore * config.weights.jobTypeMatch +
        candidate.score * config.weights.vectorSimilarity +
        experienceMatchScore * config.weights.experienceMatch +
        salaryMatchScore * config.weights.salaryMatch;

      console.log(
        `   向量分: ${candidate.score.toFixed(3)}, 经验分: ${experienceMatchScore.toFixed(3)}, 薪资分: ${salaryMatchScore.toFixed(3)}`
      );
      console.log(
        `   综合分: ${finalScore.toFixed(3)} = 技能(${(skillMatchScore * config.weights.skillMatch).toFixed(3)}) + 岗位类型(${(jobTypeMatchScore * config.weights.jobTypeMatch).toFixed(3)}) + 向量(${(candidate.score * config.weights.vectorSimilarity).toFixed(3)}) + 经验(${(experienceMatchScore * config.weights.experienceMatch).toFixed(3)}) + 薪资(${(salaryMatchScore * config.weights.salaryMatch).toFixed(3)})`
      );

      results.push({
        id: candidate.id,
        score: finalScore,
        vectorScore: candidate.score,
        skillMatchScore,
        experienceMatchScore,
        salaryMatchScore,
        jobTypeMatchScore,
        matchedSkills,
        missingSkills,
        metadata,
      });
    }

    // 按综合得分降序排序
    results.sort((a, b) => b.score - a.score);

    return results;
  }

  /**
   * 计算岗位类型匹配度
   * 相同类型得满分，相近类型得部分分，完全不同得低分
   */
  private calculateJobTypeMatch(resumeJobType: string, jobJobType: string): number {
    // 如果完全匹配，得满分
    if (resumeJobType === jobJobType) {
      return 1.0;
    }

    // 定义岗位类型的相近关系
    const relatedTypes: Record<string, string[]> = {
      technical: ['research'], // 技术和研究相近
      research: ['technical'], // 研究和技术相近
      product: ['design', 'business'], // 产品和设计、商务有一定关联
      design: ['product'], // 设计和产品相近
      operation: ['marketing', 'business'], // 运营和市场、商务相近
      marketing: ['operation', 'business'], // 市场和运营、商务相近
      business: ['marketing', 'operation', 'product'], // 商务和多个类型相近
    };

    // 如果是相近类型，得部分分
    const related = relatedTypes[resumeJobType] || [];
    if (related.includes(jobJobType)) {
      return 0.5;
    }

    // 完全不同的类型，得很低的分
    // 比如开发去匹配产品岗，应该得很低的分
    return 0.1;
  }

  /**
   * 计算技能匹配度（基于标准化技能列表）
   * 使用简历技能与岗位技能的交集比例计算匹配度
   */
  private calculateSkillMatchByNormalizedSkills(
    resumeSkills: string[],
    jobSkills: string[]
  ): {
    skillMatchScore: number;
    matchedSkills: string[];
    missingSkills: string[];
  } {
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    if (jobSkills.length === 0) {
      // 如果岗位没有技能要求，返回中等分数
      return { skillMatchScore: 0.5, matchedSkills: [], missingSkills: [] };
    }

    // 标准化简历技能用于比较
    const normalizedResumeSkills = new Set(
      resumeSkills.map(s => skillNormalizer.normalize(s).normalized.toLowerCase())
    );

    // 检查岗位技能在简历中的匹配情况
    for (const skill of jobSkills) {
      const normalizedSkill = skillNormalizer.normalize(skill).normalized.toLowerCase();
      if (normalizedResumeSkills.has(normalizedSkill)) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    }

    // 计算匹配度：匹配的技能数 / 岗位要求的技能数
    // 这样技术岗位（要求更多技术技能）会对技术简历有更高的匹配度
    const skillMatchScore = matchedSkills.length / jobSkills.length;

    return { skillMatchScore, matchedSkills, missingSkills };
  }

  /**
   * 计算技能匹配度
   */
  private calculateSkillMatch(
    sourceSkills: string[],
    targetSkills: string[],
    requiredSkills: string[]
  ): {
    skillMatchScore: number;
    matchedSkills: string[];
    missingSkills: string[];
  } {
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    // 标准化所有技能用于比较
    const normalizedSourceSkills = new Set(
      sourceSkills.map(s => skillNormalizer.normalize(s).normalized.toLowerCase())
    );

    const normalizedTargetSkills = new Set(
      targetSkills.map(s => skillNormalizer.normalize(s).normalized.toLowerCase())
    );

    // 如果有必须技能，计算必须技能的匹配度
    if (requiredSkills.length > 0) {
      for (const skill of requiredSkills) {
        const normalizedSkill = skillNormalizer.normalize(skill).normalized.toLowerCase();
        if (normalizedSourceSkills.has(normalizedSkill)) {
          matchedSkills.push(skill);
        } else {
          missingSkills.push(skill);
        }
      }

      const skillMatchScore =
        requiredSkills.length > 0 ? matchedSkills.length / requiredSkills.length : 0;

      return { skillMatchScore, matchedSkills, missingSkills };
    }

    // 如果没有必须技能，计算技能交集
    for (const skill of sourceSkills) {
      const normalizedSkill = skillNormalizer.normalize(skill).normalized.toLowerCase();
      if (normalizedTargetSkills.has(normalizedSkill)) {
        matchedSkills.push(skill);
      }
    }

    // 计算 Jaccard 相似度
    const union = new Set([...normalizedSourceSkills, ...normalizedTargetSkills]);
    const skillMatchScore = union.size > 0 ? matchedSkills.length / union.size : 0;

    return { skillMatchScore, matchedSkills, missingSkills };
  }

  /**
   * 计算经验匹配度
   */
  private calculateExperienceMatch(
    sourceYears: number,
    targetYears: number,
    targetType: 'resume' | 'job'
  ): number {
    if (targetType === 'job') {
      // 简历找岗位：简历经验 >= 岗位要求 得满分
      if (sourceYears >= targetYears) {
        return 1.0;
      }
      // 差距越大，分数越低
      const gap = targetYears - sourceYears;
      return Math.max(0, 1 - gap * 0.2);
    } else {
      // 岗位找简历：简历经验 >= 岗位要求 得满分
      if (targetYears >= sourceYears) {
        return 1.0;
      }
      // 差距越大，分数越低
      const gap = sourceYears - targetYears;
      return Math.max(0, 1 - gap * 0.2);
    }
  }

  /**
   * 计算薪资匹配度
   */
  private calculateSalaryMatch(sourceData: UnifiedTags, metadata: UnifiedMetadata): number {
    // 如果没有薪资信息，返回中等分数
    if (metadata.type === 'job') {
      const jobSalaryMin = metadata.salary_min;
      const jobSalaryMax = metadata.salary_max;

      if (!jobSalaryMin && !jobSalaryMax) {
        return 0.5;
      }

      // 这里可以根据简历的期望薪资进行匹配
      // 暂时返回中等分数
      return 0.5;
    } else {
      const resumeSalaryMin = metadata.expected_salary_min;
      const resumeSalaryMax = metadata.expected_salary_max;

      if (!resumeSalaryMin && !resumeSalaryMax) {
        return 0.5;
      }

      // 这里可以根据岗位的薪资范围进行匹配
      // 暂时返回中等分数
      return 0.5;
    }
  }
}

// 导出单例实例
export const matchingService = new MatchingService();
