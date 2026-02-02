/**
 * 匹配服务
 * 实现结构化过滤 → 向量召回 → 技能精确匹配精排 → 向量语义补充的完整匹配流程
 */

import {
  UnifiedTags,
  UnifiedMetadata,
  MatchingConfig,
  MatchingResult,
  EnhancedMatchingConfig,
  EnhancedMatchingResult,
  DEFAULT_ENHANCED_MATCHING_CONFIG,
  PineconeIndexType,
} from './types.js';
import { PineconeClient } from './pineconeClient.js';
import {
  structuredFilterBuilder,
  FilterStrictness,
  PineconeFilter,
  RELATED_JOB_TYPES,
} from './structuredFilterBuilder.js';
import { skillMatcher } from './skillMatcher.js';

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
   * 为简历查找匹配的岗位（增强版）
   * 流程：结构化过滤 → 向量召回 → 技能精确匹配精排 → 语义补充
   */
  async findMatchingJobsForResume(
    resumeData: UnifiedTags,
    resumeVector: number[],
    config?: Partial<EnhancedMatchingConfig>
  ): Promise<EnhancedMatchingResult[]> {
    const mergedConfig = { ...DEFAULT_ENHANCED_MATCHING_CONFIG, ...config };

    // 阶段1: 构建结构化过滤条件
    let filters: PineconeFilter = {};
    let relaxLevel = 0;
    let filterRelaxed = false;

    if (mergedConfig.structuredFilterEnabled) {
      filters = structuredFilterBuilder.buildFilters(resumeData, 'job', FilterStrictness.STRICT);
      console.log('📋 [结构化过滤] 初始过滤条件:', JSON.stringify(filters));
    }

    // 阶段2: 向量召回（带渐进放宽）
    const searchResult = await this.searchWithProgressiveRelax(
      resumeVector,
      PineconeIndexType.JOB,
      filters,
      resumeData,
      mergedConfig
    );

    relaxLevel = searchResult.relaxLevel;
    filterRelaxed = relaxLevel > 0;

    if (!searchResult.success || searchResult.matches.length === 0) {
      console.log('⚠️ [匹配] 未找到匹配结果');
      return [];
    }

    console.log(
      `✅ [向量召回] 找到 ${searchResult.matches.length} 个候选，放宽级别: ${relaxLevel}`
    );

    // 过滤低分结果
    const filteredMatches = searchResult.matches.filter(
      m => m.score >= mergedConfig.minVectorScore
    );

    // 阶段3: 技能精确匹配精排 + 语义补充
    const candidates = filteredMatches.map(m => ({
      id: m.id,
      score: m.score,
      metadata: m.metadata as unknown as UnifiedMetadata,
    }));

    const results = this.rerankWithSemanticSupplement(
      candidates,
      resumeData,
      mergedConfig,
      filterRelaxed,
      relaxLevel
    );

    // 返回 topK 结果
    return results.slice(0, mergedConfig.finalTopK);
  }

  /**
   * 为岗位查找匹配的简历（增强版）
   */
  async findMatchingResumesForJob(
    jobData: UnifiedTags & { requiredSkills: string[] },
    jobVector: number[],
    config?: Partial<EnhancedMatchingConfig>
  ): Promise<EnhancedMatchingResult[]> {
    const mergedConfig = { ...DEFAULT_ENHANCED_MATCHING_CONFIG, ...config };

    // 阶段1: 构建结构化过滤条件
    let filters: PineconeFilter = {};
    let relaxLevel = 0;
    let filterRelaxed = false;

    if (mergedConfig.structuredFilterEnabled) {
      filters = structuredFilterBuilder.buildFilters(jobData, 'resume', FilterStrictness.STRICT);
      console.log('📋 [结构化过滤] 初始过滤条件:', JSON.stringify(filters));
    }

    // 阶段2: 向量召回（带渐进放宽）
    const searchResult = await this.searchWithProgressiveRelax(
      jobVector,
      PineconeIndexType.RESUME,
      filters,
      jobData,
      mergedConfig
    );

    relaxLevel = searchResult.relaxLevel;
    filterRelaxed = relaxLevel > 0;

    if (!searchResult.success || searchResult.matches.length === 0) {
      console.log('⚠️ [匹配] 未找到匹配结果');
      return [];
    }

    console.log(
      `✅ [向量召回] 找到 ${searchResult.matches.length} 个候选，放宽级别: ${relaxLevel}`
    );

    // 过滤低分结果
    const filteredMatches = searchResult.matches.filter(
      m => m.score >= mergedConfig.minVectorScore
    );

    // 阶段3: 技能精确匹配精排 + 语义补充
    const candidates = filteredMatches.map(m => ({
      id: m.id,
      score: m.score,
      metadata: m.metadata as unknown as UnifiedMetadata,
    }));

    const results = this.rerankWithSemanticSupplement(
      candidates,
      jobData,
      mergedConfig,
      filterRelaxed,
      relaxLevel
    );

    // 返回 topK 结果
    return results.slice(0, mergedConfig.finalTopK);
  }

  /**
   * 带渐进放宽的向量搜索
   */
  private async searchWithProgressiveRelax(
    vector: number[],
    indexType: PineconeIndexType,
    initialFilters: PineconeFilter,
    sourceData: UnifiedTags,
    config: EnhancedMatchingConfig
  ): Promise<{
    success: boolean;
    matches: Array<{ id: string; score: number; metadata: Record<string, unknown> }>;
    relaxLevel: number;
  }> {
    let currentFilters = initialFilters;
    let relaxLevel = 0;

    while (relaxLevel <= config.maxRelaxLevel) {
      const searchResult = await PineconeClient.search({
        vector,
        topK: config.vectorRecallTopK,
        indexType,
        filter: Object.keys(currentFilters).length > 0 ? currentFilters : undefined,
        includeMetadata: true,
      });

      if (searchResult.success && searchResult.matches.length > 0) {
        return {
          success: true,
          matches: searchResult.matches,
          relaxLevel,
        };
      }

      // 尝试放宽过滤条件
      if (relaxLevel < config.maxRelaxLevel && config.relaxFilterOnEmpty) {
        relaxLevel++;
        currentFilters = structuredFilterBuilder.relaxFilters(
          initialFilters,
          sourceData,
          relaxLevel
        );
        console.log(`🔄 [过滤放宽] 级别 ${relaxLevel}:`, JSON.stringify(currentFilters));
      } else {
        break;
      }
    }

    return {
      success: false,
      matches: [],
      relaxLevel,
    };
  }

  /**
   * 带语义补充的精排
   */
  private rerankWithSemanticSupplement(
    candidates: Array<{ id: string; score: number; metadata: UnifiedMetadata }>,
    sourceData: UnifiedTags,
    config: EnhancedMatchingConfig,
    filterRelaxed: boolean,
    relaxLevel: number
  ): EnhancedMatchingResult[] {
    const results: EnhancedMatchingResult[] = [];

    for (const candidate of candidates) {
      const metadata = candidate.metadata;

      // 获取岗位技能：优先使用 normalized_skills，如果没有则尝试从其他字段提取
      let jobNormalizedSkills = metadata.normalized_skills || [];

      // 兼容旧版岗位数据：如果没有 normalized_skills，尝试从其他字段提取
      if (jobNormalizedSkills.length === 0) {
        // 优先使用解析后的技能（更准确）
        const metadataAny = metadata as unknown as Record<string, unknown>;
        const parsedRequiredSkills = (metadataAny.parsed_required_skills as string[]) || [];
        const parsedPreferredSkills = (metadataAny.parsed_preferred_skills as string[]) || [];
        const requiredSkills = metadata.required_skills || [];
        const preferredSkills = metadata.preferred_skills || [];

        // 合并所有技能来源，优先使用解析后的技能
        const allSkills = [
          ...parsedRequiredSkills,
          ...parsedPreferredSkills,
          ...requiredSkills,
          ...preferredSkills,
        ];

        jobNormalizedSkills = [...new Set(allSkills)]; // 去重
      }

      // 调试日志
      console.log(`🔍 [精排] 岗位: ${metadata.title || metadata.id}`);
      console.log(`   岗位类型: ${metadata.job_type}, 简历目标: ${sourceData.jobType}`);
      console.log(
        `   岗位技能: ${JSON.stringify(jobNormalizedSkills.slice(0, 8))}${jobNormalizedSkills.length > 8 ? '...' : ''}`
      );
      console.log(
        `   简历技能: ${JSON.stringify(sourceData.normalizedSkills.slice(0, 8))}${sourceData.normalizedSkills.length > 8 ? '...' : ''}`
      );

      // 阶段3: 技能精确匹配
      const exactMatchResult = skillMatcher.exactMatch(
        sourceData.normalizedSkills,
        jobNormalizedSkills
      );

      // 阶段4: 语义补充
      let semanticResult = {
        semanticBonus: 0,
        semanticMatches: [] as Array<{ resumeSkill: string; jobSkill: string; similarity: number }>,
      };
      if (config.semanticSupplementEnabled) {
        semanticResult = skillMatcher.semanticSupplement(
          sourceData.normalizedSkills,
          jobNormalizedSkills,
          candidate.score
        );
      }

      // 计算岗位类型匹配度
      const jobTypeMatchScore = this.calculateJobTypeMatch(
        sourceData.jobType,
        metadata.job_type,
        metadata.title
      );

      // 获取推断的岗位类型用于日志
      const inferredJobType = metadata.job_type || this.inferJobTypeFromTitle(metadata.title || '');
      console.log(
        `   技能匹配分: ${exactMatchResult.matchScore.toFixed(3)}, 岗位类型匹配分: ${jobTypeMatchScore.toFixed(3)} (推断: ${inferredJobType})`
      );
      console.log(
        `   匹配技能: ${exactMatchResult.matchedSkills.length}个 [${exactMatchResult.matchedSkills.slice(0, 5).join(', ')}]`
      );
      if (semanticResult.semanticMatches.length > 0) {
        console.log(
          `   语义匹配: ${semanticResult.semanticMatches.length}个, 加分: ${semanticResult.semanticBonus.toFixed(3)}`
        );
      }

      // 计算经验匹配度
      const experienceMatchScore = this.calculateExperienceMatch(
        sourceData.experienceYears,
        metadata.experience_years || 0,
        metadata.type
      );

      // 计算薪资匹配度
      const salaryMatchScore = this.calculateSalaryMatch(sourceData, metadata);

      // 阶段5: 计算综合得分
      const baseScore =
        exactMatchResult.matchScore * config.weights.skillMatch +
        jobTypeMatchScore * config.weights.jobTypeMatch +
        candidate.score * config.weights.vectorSimilarity +
        experienceMatchScore * config.weights.experienceMatch +
        salaryMatchScore * config.weights.salaryMatch;

      // 加入语义补充加分（最多 0.05）
      const finalScore = Math.min(baseScore + semanticResult.semanticBonus, 1.0);

      console.log(
        `   向量分: ${candidate.score.toFixed(3)}, 经验分: ${experienceMatchScore.toFixed(3)}, 薪资分: ${salaryMatchScore.toFixed(3)}`
      );
      console.log(
        `   综合分: ${finalScore.toFixed(3)} = 技能(${(exactMatchResult.matchScore * config.weights.skillMatch).toFixed(3)}) + 岗位类型(${(jobTypeMatchScore * config.weights.jobTypeMatch).toFixed(3)}) + 向量(${(candidate.score * config.weights.vectorSimilarity).toFixed(3)}) + 经验(${(experienceMatchScore * config.weights.experienceMatch).toFixed(3)}) + 薪资(${(salaryMatchScore * config.weights.salaryMatch).toFixed(3)}) + 语义(${semanticResult.semanticBonus.toFixed(3)})`
      );

      results.push({
        id: candidate.id,
        score: finalScore,
        vectorScore: candidate.score,
        skillMatchScore: exactMatchResult.matchScore,
        experienceMatchScore,
        salaryMatchScore,
        jobTypeMatchScore,
        matchedSkills: exactMatchResult.matchedSkills,
        missingSkills: exactMatchResult.missingSkills,
        metadata,
        filterRelaxed,
        relaxLevel,
        semanticBonus: semanticResult.semanticBonus,
        semanticMatches: semanticResult.semanticMatches,
      });
    }

    // 按综合得分降序排序
    results.sort((a, b) => b.score - a.score);

    return results;
  }

  /**
   * 构建硬性过滤条件（兼容旧接口）
   */
  buildHardFilters(sourceData: UnifiedTags, targetType: 'resume' | 'job'): Record<string, unknown> {
    return structuredFilterBuilder.buildFilters(sourceData, targetType, FilterStrictness.STRICT);
  }

  /**
   * 执行标签精排（兼容旧接口）
   */
  rerankByTags(
    candidates: Array<{ id: string; score: number; metadata: UnifiedMetadata }>,
    sourceData: UnifiedTags,
    _requiredSkills: string[],
    config: MatchingConfig
  ): MatchingResult[] {
    const results: MatchingResult[] = [];

    for (const candidate of candidates) {
      const metadata = candidate.metadata;
      const jobNormalizedSkills = metadata.normalized_skills || [];

      // 技能精确匹配
      const exactMatchResult = skillMatcher.exactMatch(
        sourceData.normalizedSkills,
        jobNormalizedSkills
      );

      // 岗位类型匹配
      const jobTypeMatchScore = this.calculateJobTypeMatch(
        sourceData.jobType,
        metadata.job_type,
        metadata.title
      );

      // 经验匹配
      const experienceMatchScore = this.calculateExperienceMatch(
        sourceData.experienceYears,
        metadata.experience_years || 0,
        metadata.type
      );

      // 薪资匹配
      const salaryMatchScore = this.calculateSalaryMatch(sourceData, metadata);

      // 综合得分
      const finalScore =
        exactMatchResult.matchScore * config.weights.skillMatch +
        jobTypeMatchScore * config.weights.jobTypeMatch +
        candidate.score * config.weights.vectorSimilarity +
        experienceMatchScore * config.weights.experienceMatch +
        salaryMatchScore * config.weights.salaryMatch;

      results.push({
        id: candidate.id,
        score: finalScore,
        vectorScore: candidate.score,
        skillMatchScore: exactMatchResult.matchScore,
        experienceMatchScore,
        salaryMatchScore,
        jobTypeMatchScore,
        matchedSkills: exactMatchResult.matchedSkills,
        missingSkills: exactMatchResult.missingSkills,
        metadata,
      });
    }

    results.sort((a, b) => b.score - a.score);
    return results;
  }

  /**
   * 计算岗位类型匹配度
   */
  private calculateJobTypeMatch(
    resumeJobType: string,
    jobJobType: string | undefined,
    jobTitle?: string
  ): number {
    const inferredJobType = jobJobType || this.inferJobTypeFromTitle(jobTitle || '');

    if (resumeJobType === inferredJobType) {
      return 1.0;
    }

    const related = RELATED_JOB_TYPES[resumeJobType] || [];
    if (related.includes(inferredJobType)) {
      return 0.5;
    }

    return 0.1;
  }

  /**
   * 根据岗位标题推断岗位类型
   */
  private inferJobTypeFromTitle(title: string): string {
    const lowerTitle = title.toLowerCase();

    const technicalKeywords = [
      'engineer',
      'developer',
      'dev',
      'architect',
      'programmer',
      'backend',
      'frontend',
      'fullstack',
      'full-stack',
      'software',
      'devops',
      'sre',
      'infrastructure',
      'blockchain',
      'smart contract',
      'solidity',
      'rust',
      'golang',
      'python',
      'technical lead',
      'tech lead',
      'engineering',
      '工程师',
      '开发',
      '架构师',
      '程序员',
      '后端',
      '前端',
      '全栈',
      '技术负责人',
    ];

    const productKeywords = [
      'product',
      'pm',
      'product manager',
      'product lead',
      'product owner',
      '产品',
      '产品经理',
      '产品负责人',
    ];

    const operationKeywords = [
      'operation',
      'community',
      'growth',
      'user',
      'content',
      '运营',
      '社区',
      '增长',
      '用户',
    ];

    const marketingKeywords = [
      'marketing',
      'brand',
      'pr',
      'public relation',
      'media',
      '市场',
      '品牌',
      '公关',
      '媒体',
    ];

    const designKeywords = [
      'design',
      'designer',
      'ui',
      'ux',
      'graphic',
      'visual',
      '设计',
      '设计师',
      '视觉',
    ];

    const researchKeywords = [
      'research',
      'researcher',
      'analyst',
      'data scientist',
      'ml',
      'ai',
      '研究',
      '研究员',
      '分析师',
      '数据科学',
    ];

    const businessKeywords = [
      'business',
      'bd',
      'sales',
      'account',
      'partnership',
      'listing',
      '商务',
      '销售',
      '客户',
      '合作',
    ];

    if (technicalKeywords.some(k => lowerTitle.includes(k))) return 'technical';
    if (productKeywords.some(k => lowerTitle.includes(k))) return 'product';
    if (designKeywords.some(k => lowerTitle.includes(k))) return 'design';
    if (researchKeywords.some(k => lowerTitle.includes(k))) return 'research';
    if (operationKeywords.some(k => lowerTitle.includes(k))) return 'operation';
    if (marketingKeywords.some(k => lowerTitle.includes(k))) return 'marketing';
    if (businessKeywords.some(k => lowerTitle.includes(k))) return 'business';

    return 'other';
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
  private calculateSalaryMatch(_sourceData: UnifiedTags, metadata: UnifiedMetadata): number {
    if (metadata.type === 'job') {
      // 如果没有薪资信息，返回中等分数
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
