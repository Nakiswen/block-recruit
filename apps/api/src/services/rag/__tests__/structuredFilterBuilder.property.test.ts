/**
 * 结构化过滤器构建器属性测试
 * 使用 fast-check 进行属性测试
 *
 * Feature: structured-matching-optimization
 * Validates: Requirements 1, 6 (过滤条件放宽单调性)
 */

import { describe, test, expect } from '@jest/globals';
import * as fc from 'fast-check';
import {
  StructuredFilterBuilder,
  FilterStrictness,
  PineconeFilter,
  RELATED_JOB_TYPES,
} from '../structuredFilterBuilder.js';
import { UnifiedTags, JobType } from '../types.js';
import { SkillCategory } from '../skillNormalizer.js';

// 创建 StructuredFilterBuilder 实例用于测试
const filterBuilder = new StructuredFilterBuilder();

// ========== 测试数据生成器 ==========

/**
 * 生成有效的技能列表
 */
const skillsArb = fc.array(
  fc.constantFrom(
    'JavaScript',
    'TypeScript',
    'React',
    'Vue',
    'Node.js',
    'Python',
    'Solidity',
    'Rust',
    'Go',
    'PostgreSQL'
  ),
  { minLength: 1, maxLength: 10 }
);

/**
 * 生成有效的技能分类列表
 */
const skillCategoriesArb = fc.array(fc.constantFrom(...Object.values(SkillCategory)), {
  minLength: 1,
  maxLength: 5,
});

/**
 * 生成有效的岗位类型
 */
const jobTypeArb = fc.constantFrom(...Object.values(JobType));

/**
 * 生成有效的经验年限 (0-20年)
 */
const experienceYearsArb = fc.integer({ min: 0, max: 20 });

/**
 * 生成有效的 UnifiedTags
 */
const unifiedTagsArb = fc.record({
  normalizedSkills: skillsArb,
  skillCategories: skillCategoriesArb,
  experienceYears: experienceYearsArb,
  educationLevel: fc.constantFrom('Bachelor', 'Master', 'PhD', 'High School', ''),
  jobType: jobTypeArb,
  location: fc.constantFrom('Beijing', 'Shanghai', 'Shenzhen', 'Remote', ''),
  industry: fc.array(fc.constantFrom('Web3', 'Fintech', 'AI', 'Gaming'), {
    minLength: 0,
    maxLength: 3,
  }),
});

/**
 * 生成有效的放宽级别 (1-4)
 */
const relaxLevelArb = fc.integer({ min: 1, max: 4 });

// ========== 属性测试 ==========

describe('StructuredFilterBuilder 属性测试', () => {
  /**
   * Property 1: 过滤放宽单调性
   *
   * 对于任意过滤条件 F 和放宽级别 L1 < L2:
   * candidates(F, L1) ⊆ candidates(F, L2)
   * 即放宽级别越高，过滤条件越宽松（字段越少或范围越大）
   *
   * **Validates: Requirements 6**
   */
  describe('Property 1: 过滤放宽单调性', () => {
    test('放宽级别越高，过滤条件字段数量应该越少或相等', () => {
      fc.assert(
        fc.property(unifiedTagsArb, sourceData => {
          const initialFilters = filterBuilder.buildFilters(
            sourceData,
            'job',
            FilterStrictness.STRICT
          );

          // 获取各级别放宽后的过滤条件
          const level1 = filterBuilder.relaxFilters(initialFilters, sourceData, 1);
          const level2 = filterBuilder.relaxFilters(initialFilters, sourceData, 2);
          const level3 = filterBuilder.relaxFilters(initialFilters, sourceData, 3);
          const level4 = filterBuilder.relaxFilters(initialFilters, sourceData, 4);

          // 计算每个级别的有效字段数量
          const countFields = (f: PineconeFilter) =>
            Object.keys(f).filter(k => f[k] !== undefined).length;

          const count0 = countFields(initialFilters);
          const count1 = countFields(level1);
          const count2 = countFields(level2);
          const count3 = countFields(level3);
          const count4 = countFields(level4);

          // 放宽级别越高，字段数量应该越少或相等
          // Level 1: 移除 location
          expect(count1).toBeLessThanOrEqual(count0);
          // Level 4: 移除所有字段
          expect(count4).toBe(0);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('Level 4 应该移除所有结构化过滤条件', () => {
      fc.assert(
        fc.property(unifiedTagsArb, sourceData => {
          const initialFilters = filterBuilder.buildFilters(
            sourceData,
            'job',
            FilterStrictness.STRICT
          );

          const level4 = filterBuilder.relaxFilters(initialFilters, sourceData, 4);

          // Level 4 应该没有任何过滤条件
          expect(level4.job_type).toBeUndefined();
          expect(level4.experience_years).toBeUndefined();
          expect(level4.location).toBeUndefined();

          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('放宽经验范围应该单调递增', () => {
      fc.assert(
        fc.property(
          unifiedTagsArb.filter(tags => tags.experienceYears > 2),
          sourceData => {
            const initialFilters = filterBuilder.buildFilters(
              sourceData,
              'job',
              FilterStrictness.STRICT
            );

            const level2 = filterBuilder.relaxFilters(initialFilters, sourceData, 2);
            const level3 = filterBuilder.relaxFilters(initialFilters, sourceData, 3);

            // Level 2 和 Level 3 都有经验范围
            if (level2.experience_years && level3.experience_years) {
              const range2 = level2.experience_years as { $gte?: number; $lte?: number };
              const range3 = level3.experience_years as { $gte?: number; $lte?: number };

              // Level 3 的范围应该 >= Level 2 的范围
              if (range2.$gte !== undefined && range3.$gte !== undefined) {
                expect(range3.$gte).toBeLessThanOrEqual(range2.$gte);
              }
              if (range2.$lte !== undefined && range3.$lte !== undefined) {
                expect(range3.$lte).toBeGreaterThanOrEqual(range2.$lte);
              }
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 2: 过滤条件有效性
   *
   * 对于任意输入数据，生成的过滤条件应该是有效的 Pinecone 过滤格式
   *
   * **Validates: Requirements 1**
   */
  describe('Property 2: 过滤条件有效性', () => {
    test('生成的过滤条件应该是有效的对象', () => {
      fc.assert(
        fc.property(
          unifiedTagsArb,
          fc.constantFrom('job', 'resume') as fc.Arbitrary<'job' | 'resume'>,
          (sourceData, targetType) => {
            const filters = filterBuilder.buildFilters(
              sourceData,
              targetType,
              FilterStrictness.STRICT
            );

            // 过滤条件应该是对象
            expect(typeof filters).toBe('object');
            expect(filters).not.toBeNull();

            // 如果有 job_type，应该是字符串或 $in 对象
            if (filters.job_type !== undefined) {
              const isString = typeof filters.job_type === 'string';
              const isInObject =
                typeof filters.job_type === 'object' &&
                filters.job_type !== null &&
                '$in' in filters.job_type;
              expect(isString || isInObject).toBe(true);
            }

            // 如果有 experience_years，应该是有效的范围对象
            if (filters.experience_years !== undefined) {
              expect(typeof filters.experience_years).toBe('object');
              const expFilter = filters.experience_years as { $gte?: number; $lte?: number };
              if (expFilter.$gte !== undefined) {
                expect(typeof expFilter.$gte).toBe('number');
                expect(expFilter.$gte).toBeGreaterThanOrEqual(0);
              }
              if (expFilter.$lte !== undefined) {
                expect(typeof expFilter.$lte).toBe('number');
                expect(expFilter.$lte).toBeGreaterThanOrEqual(0);
              }
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('RELAXED 模式不应添加任何过滤条件', () => {
      fc.assert(
        fc.property(unifiedTagsArb, sourceData => {
          const filters = filterBuilder.buildFilters(sourceData, 'job', FilterStrictness.RELAXED);

          // RELAXED 模式不应有任何过滤条件
          expect(filters.job_type).toBeUndefined();
          expect(filters.experience_years).toBeUndefined();
          expect(filters.location).toBeUndefined();

          return true;
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 3: 相关岗位类型映射完整性
   *
   * 对于任意岗位类型，getRelatedJobTypes 应该返回包含自身的数组
   *
   * **Validates: Requirements 6**
   */
  describe('Property 3: 相关岗位类型映射完整性', () => {
    test('相关岗位类型应该包含自身', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(
            'technical',
            'product',
            'design',
            'operation',
            'marketing',
            'research',
            'business'
          ),
          jobType => {
            const related = filterBuilder.getRelatedJobTypes(jobType);

            // 相关类型应该包含自身
            expect(related).toContain(jobType);
            // 应该是非空数组
            expect(related.length).toBeGreaterThan(0);

            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    test('未知岗位类型应该返回包含自身的数组', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 20 }), unknownType => {
          const related = filterBuilder.getRelatedJobTypes(unknownType);

          // 未知类型应该返回包含自身的数组
          expect(related).toContain(unknownType);

          return true;
        }),
        { numRuns: 50 }
      );
    });
  });

  /**
   * Property 4: 过滤条件对称性
   *
   * 简历找岗位和岗位找简历的过滤条件应该是对称的
   * （经验方向相反，其他条件相同）
   *
   * **Validates: Requirements 1**
   */
  describe('Property 4: 过滤条件对称性', () => {
    test('简历找岗位和岗位找简历的岗位类型过滤应该相同', () => {
      fc.assert(
        fc.property(unifiedTagsArb, sourceData => {
          const filtersForJob = filterBuilder.buildFilters(
            sourceData,
            'job',
            FilterStrictness.STRICT
          );
          const filtersForResume = filterBuilder.buildFilters(
            sourceData,
            'resume',
            FilterStrictness.STRICT
          );

          // 岗位类型过滤应该相同
          expect(filtersForJob.job_type).toEqual(filtersForResume.job_type);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('简历找岗位和岗位找简历的经验过滤方向应该相反', () => {
      fc.assert(
        fc.property(
          unifiedTagsArb.filter(tags => tags.experienceYears > 0),
          sourceData => {
            const filtersForJob = filterBuilder.buildFilters(
              sourceData,
              'job',
              FilterStrictness.STRICT
            );
            const filtersForResume = filterBuilder.buildFilters(
              sourceData,
              'resume',
              FilterStrictness.STRICT
            );

            // 简历找岗位：$lte（岗位要求 <= 简历经验）
            const jobExpFilter = filtersForJob.experience_years as { $lte?: number };
            expect(jobExpFilter).toHaveProperty('$lte');

            // 岗位找简历：$gte（简历经验 >= 岗位要求）
            const resumeExpFilter = filtersForResume.experience_years as { $gte?: number };
            expect(resumeExpFilter).toHaveProperty('$gte');

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
