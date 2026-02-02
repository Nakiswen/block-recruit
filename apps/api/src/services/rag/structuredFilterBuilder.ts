/**
 * 结构化过滤器构建器
 * 负责构建 Pinecone metadata 过滤条件，支持渐进放宽
 */

import { UnifiedTags, JobType } from './types.js';

/**
 * 过滤严格程度枚举
 */
export enum FilterStrictness {
  STRICT = 'strict', // 所有条件都必须匹配
  MODERATE = 'moderate', // 核心条件必须匹配
  RELAXED = 'relaxed', // 仅基本条件
}

/**
 * Pinecone 过滤条件类型
 */
export interface PineconeFilter {
  job_type?: string | { $in: string[] };
  experience_years?: { $lte?: number; $gte?: number };
  location?: string | { $in: string[] };
  [key: string]: unknown;
}

/**
 * 相关岗位类型映射
 * 用于过滤条件放宽时扩展岗位类型
 */
export const RELATED_JOB_TYPES: Record<string, string[]> = {
  technical: ['technical', 'research'],
  product: ['product', 'design', 'business'],
  design: ['design', 'product'],
  operation: ['operation', 'marketing', 'business'],
  marketing: ['marketing', 'operation', 'business'],
  research: ['research', 'technical'],
  business: ['business', 'marketing', 'operation', 'product'],
  other: ['other'],
};

/**
 * 过滤条件放宽策略
 */
export const RELAX_STRATEGY = {
  level1: {
    // 放宽地点：移除地点过滤
    description: '移除地点过滤',
    removeFields: ['location'],
    adjustments: {},
  },
  level2: {
    // 放宽经验：±1年
    description: '放宽经验年限 ±1年',
    removeFields: ['location'],
    adjustments: {
      experience_years: (current: number) => ({
        $gte: Math.max(0, current - 1),
        $lte: current + 1,
      }),
    },
  },
  level3: {
    // 放宽岗位类型：扩展到相关类型
    description: '扩展岗位类型到相关类型',
    removeFields: ['location'],
    adjustments: {
      experience_years: (current: number) => ({
        $gte: Math.max(0, current - 2),
        $lte: current + 2,
      }),
      job_type: (current: string) => ({
        $in: RELATED_JOB_TYPES[current] || [current],
      }),
    },
  },
  level4: {
    // 移除所有结构化过滤
    description: '移除所有结构化过滤，仅向量召回',
    removeFields: ['location', 'experience_years', 'job_type'],
    adjustments: {},
  },
};

/**
 * 结构化过滤器构建器接口
 */
export interface IStructuredFilterBuilder {
  buildFilters(
    sourceData: UnifiedTags,
    targetType: 'resume' | 'job',
    strictness?: FilterStrictness
  ): PineconeFilter;

  relaxFilters(
    currentFilters: PineconeFilter,
    sourceData: UnifiedTags,
    relaxLevel: number
  ): PineconeFilter;

  getRelatedJobTypes(jobType: string): string[];
}

/**
 * 结构化过滤器构建器实现
 */
export class StructuredFilterBuilder implements IStructuredFilterBuilder {
  /**
   * 构建结构化过滤条件
   * @param sourceData 源数据（简历或岗位的统一标签）
   * @param targetType 目标类型（'resume' | 'job'）
   * @param strictness 过滤严格程度
   */
  buildFilters(
    sourceData: UnifiedTags,
    targetType: 'resume' | 'job',
    strictness: FilterStrictness = FilterStrictness.STRICT
  ): PineconeFilter {
    const filters: PineconeFilter = {};

    if (targetType === 'job') {
      // 简历找岗位
      this.buildFiltersForJobSearch(filters, sourceData, strictness);
    } else {
      // 岗位找简历
      this.buildFiltersForResumeSearch(filters, sourceData, strictness);
    }

    return filters;
  }

  /**
   * 构建简历找岗位的过滤条件
   */
  private buildFiltersForJobSearch(
    filters: PineconeFilter,
    sourceData: UnifiedTags,
    strictness: FilterStrictness
  ): void {
    // 岗位类型匹配
    if (sourceData.jobType && sourceData.jobType !== JobType.OTHER) {
      if (strictness === FilterStrictness.STRICT) {
        filters.job_type = sourceData.jobType;
      } else if (strictness === FilterStrictness.MODERATE) {
        // 中等严格度：包含相关岗位类型
        filters.job_type = { $in: this.getRelatedJobTypes(sourceData.jobType) };
      }
      // RELAXED 模式不添加岗位类型过滤
    }

    // 经验年限：岗位要求 <= 简历经验
    if (sourceData.experienceYears > 0) {
      if (strictness === FilterStrictness.STRICT) {
        filters.experience_years = { $lte: sourceData.experienceYears };
      } else if (strictness === FilterStrictness.MODERATE) {
        // 中等严格度：允许岗位要求比简历经验多1年
        filters.experience_years = { $lte: sourceData.experienceYears + 1 };
      }
      // RELAXED 模式不添加经验过滤
    }

    // 地点匹配（仅 STRICT 模式）
    if (strictness === FilterStrictness.STRICT && sourceData.location) {
      filters.location = sourceData.location;
    }
  }

  /**
   * 构建岗位找简历的过滤条件
   */
  private buildFiltersForResumeSearch(
    filters: PineconeFilter,
    sourceData: UnifiedTags,
    strictness: FilterStrictness
  ): void {
    // 岗位类型匹配
    if (sourceData.jobType && sourceData.jobType !== JobType.OTHER) {
      if (strictness === FilterStrictness.STRICT) {
        filters.job_type = sourceData.jobType;
      } else if (strictness === FilterStrictness.MODERATE) {
        filters.job_type = { $in: this.getRelatedJobTypes(sourceData.jobType) };
      }
    }

    // 经验年限：简历经验 >= 岗位要求
    if (sourceData.experienceYears > 0) {
      if (strictness === FilterStrictness.STRICT) {
        filters.experience_years = { $gte: sourceData.experienceYears };
      } else if (strictness === FilterStrictness.MODERATE) {
        // 中等严格度：允许简历经验比岗位要求少1年
        filters.experience_years = { $gte: Math.max(0, sourceData.experienceYears - 1) };
      }
    }

    // 地点匹配（仅 STRICT 模式）
    if (strictness === FilterStrictness.STRICT && sourceData.location) {
      filters.location = sourceData.location;
    }
  }

  /**
   * 放宽过滤条件
   * @param currentFilters 当前过滤条件
   * @param sourceData 源数据
   * @param relaxLevel 放宽级别 (1-4)
   */
  relaxFilters(
    currentFilters: PineconeFilter,
    sourceData: UnifiedTags,
    relaxLevel: number
  ): PineconeFilter {
    // 确保放宽级别在有效范围内
    const level = Math.min(Math.max(relaxLevel, 1), 4) as 1 | 2 | 3 | 4;
    const strategy = RELAX_STRATEGY[`level${level}` as keyof typeof RELAX_STRATEGY];

    if (!strategy) {
      return currentFilters;
    }

    // 创建新的过滤条件副本
    const relaxedFilters: PineconeFilter = { ...currentFilters };

    // 移除指定字段
    for (const field of strategy.removeFields) {
      delete relaxedFilters[field];
    }

    // 应用调整
    const adjustments = strategy.adjustments as Record<string, (value: number | string) => unknown>;

    for (const [field, adjustFn] of Object.entries(adjustments)) {
      if (field === 'experience_years' && sourceData.experienceYears > 0) {
        relaxedFilters.experience_years = adjustFn(sourceData.experienceYears) as {
          $lte?: number;
          $gte?: number;
        };
      } else if (field === 'job_type' && sourceData.jobType) {
        relaxedFilters.job_type = adjustFn(sourceData.jobType) as string | { $in: string[] };
      }
    }

    return relaxedFilters;
  }

  /**
   * 获取相关岗位类型
   * @param jobType 岗位类型
   */
  getRelatedJobTypes(jobType: string): string[] {
    // 使用 hasOwnProperty 检查，避免原型链上的属性（如 valueOf、toString）
    if (Object.prototype.hasOwnProperty.call(RELATED_JOB_TYPES, jobType)) {
      return RELATED_JOB_TYPES[jobType];
    }
    return [jobType];
  }
}

// 导出单例实例
export const structuredFilterBuilder = new StructuredFilterBuilder();
