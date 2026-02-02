/**
 * 结构化过滤器构建器单元测试
 */

import {
  StructuredFilterBuilder,
  FilterStrictness,
  RELATED_JOB_TYPES,
} from '../structuredFilterBuilder.js';
import { UnifiedTags, JobType } from '../types.js';
import { SkillCategory } from '../skillNormalizer.js';

describe('StructuredFilterBuilder', () => {
  let builder: StructuredFilterBuilder;

  beforeEach(() => {
    builder = new StructuredFilterBuilder();
  });

  describe('buildFilters', () => {
    const mockResumeData: UnifiedTags = {
      normalizedSkills: ['React', 'TypeScript', 'Node.js'],
      skillCategories: [SkillCategory.FRONTEND, SkillCategory.BACKEND],
      experienceYears: 5,
      educationLevel: 'bachelor',
      jobType: JobType.TECHNICAL,
      location: 'Beijing',
      industry: ['tech'],
    };

    describe('简历找岗位 (targetType: job)', () => {
      it('STRICT 模式应包含所有过滤条件', () => {
        const filters = builder.buildFilters(mockResumeData, 'job', FilterStrictness.STRICT);

        expect(filters.job_type).toBe('technical');
        expect(filters.experience_years).toEqual({ $lte: 5 });
        expect(filters.location).toBe('Beijing');
      });

      it('MODERATE 模式应放宽岗位类型和经验', () => {
        const filters = builder.buildFilters(mockResumeData, 'job', FilterStrictness.MODERATE);

        expect(filters.job_type).toEqual({ $in: ['technical', 'research'] });
        expect(filters.experience_years).toEqual({ $lte: 6 }); // +1年
        expect(filters.location).toBeUndefined();
      });

      it('RELAXED 模式不应包含岗位类型和经验过滤', () => {
        const filters = builder.buildFilters(mockResumeData, 'job', FilterStrictness.RELAXED);

        expect(filters.job_type).toBeUndefined();
        expect(filters.experience_years).toBeUndefined();
        expect(filters.location).toBeUndefined();
      });

      it('岗位类型为 OTHER 时不应添加岗位类型过滤', () => {
        const dataWithOther = { ...mockResumeData, jobType: JobType.OTHER };
        const filters = builder.buildFilters(dataWithOther, 'job', FilterStrictness.STRICT);

        expect(filters.job_type).toBeUndefined();
      });

      it('经验年限为 0 时不应添加经验过滤', () => {
        const dataWithZeroExp = { ...mockResumeData, experienceYears: 0 };
        const filters = builder.buildFilters(dataWithZeroExp, 'job', FilterStrictness.STRICT);

        expect(filters.experience_years).toBeUndefined();
      });
    });

    describe('岗位找简历 (targetType: resume)', () => {
      it('STRICT 模式应使用 $gte 过滤经验', () => {
        const filters = builder.buildFilters(mockResumeData, 'resume', FilterStrictness.STRICT);

        expect(filters.job_type).toBe('technical');
        expect(filters.experience_years).toEqual({ $gte: 5 });
        expect(filters.location).toBe('Beijing');
      });

      it('MODERATE 模式应放宽经验要求', () => {
        const filters = builder.buildFilters(mockResumeData, 'resume', FilterStrictness.MODERATE);

        expect(filters.experience_years).toEqual({ $gte: 4 }); // -1年
      });
    });
  });

  describe('relaxFilters', () => {
    const mockSourceData: UnifiedTags = {
      normalizedSkills: ['React'],
      skillCategories: [SkillCategory.FRONTEND],
      experienceYears: 5,
      educationLevel: 'bachelor',
      jobType: JobType.TECHNICAL,
      location: 'Beijing',
      industry: ['tech'],
    };

    const initialFilters = {
      job_type: 'technical',
      experience_years: { $lte: 5 },
      location: 'Beijing',
    };

    it('Level 1 应移除地点过滤', () => {
      const relaxed = builder.relaxFilters(initialFilters, mockSourceData, 1);

      expect(relaxed.location).toBeUndefined();
      expect(relaxed.job_type).toBe('technical');
      expect(relaxed.experience_years).toEqual({ $lte: 5 });
    });

    it('Level 2 应放宽经验年限 ±1年', () => {
      const relaxed = builder.relaxFilters(initialFilters, mockSourceData, 2);

      expect(relaxed.location).toBeUndefined();
      expect(relaxed.experience_years).toEqual({ $gte: 4, $lte: 6 });
    });

    it('Level 3 应扩展岗位类型到相关类型', () => {
      const relaxed = builder.relaxFilters(initialFilters, mockSourceData, 3);

      expect(relaxed.location).toBeUndefined();
      expect(relaxed.experience_years).toEqual({ $gte: 3, $lte: 7 });
      expect(relaxed.job_type).toEqual({ $in: ['technical', 'research'] });
    });

    it('Level 4 应移除所有结构化过滤', () => {
      const relaxed = builder.relaxFilters(initialFilters, mockSourceData, 4);

      expect(relaxed.location).toBeUndefined();
      expect(relaxed.experience_years).toBeUndefined();
      expect(relaxed.job_type).toBeUndefined();
    });

    it('放宽级别超出范围应限制在有效范围内', () => {
      const relaxed = builder.relaxFilters(initialFilters, mockSourceData, 10);

      // 应该等同于 level 4
      expect(relaxed.location).toBeUndefined();
      expect(relaxed.experience_years).toBeUndefined();
      expect(relaxed.job_type).toBeUndefined();
    });
  });

  describe('getRelatedJobTypes', () => {
    it('应返回技术类的相关岗位类型', () => {
      const related = builder.getRelatedJobTypes('technical');
      expect(related).toEqual(['technical', 'research']);
    });

    it('应返回产品类的相关岗位类型', () => {
      const related = builder.getRelatedJobTypes('product');
      expect(related).toEqual(['product', 'design', 'business']);
    });

    it('未知岗位类型应返回自身', () => {
      const related = builder.getRelatedJobTypes('unknown');
      expect(related).toEqual(['unknown']);
    });
  });
});
