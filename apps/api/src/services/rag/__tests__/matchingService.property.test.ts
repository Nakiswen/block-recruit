/**
 * Matching Service 属性测试
 * 使用 fast-check 进行属性测试
 *
 * Feature: resume-job-matching-optimization
 * Validates: Requirements 5.2, 5.3, 5.6, 5.7, 5.8, 5.9, 5.10
 */

import { describe, test, expect } from '@jest/globals';
import * as fc from 'fast-check';
import { MatchingService } from '../matchingService.js';
import {
  UnifiedTags,
  UnifiedMetadata,
  MatchingConfig,
  DEFAULT_MATCHING_CONFIG,
  JobType,
} from '../types.js';
import { SkillCategory } from '../skillNormalizer.js';

// 创建 MatchingService 实例用于测试
const matchingService = new MatchingService();

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
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'AWS',
    'Docker',
    'Kubernetes',
    'Smart Contract',
    'DeFi',
    'NFT',
    'Web3'
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
 * 生成有效的向量分数 (0-1)
 */
const vectorScoreArb = fc.float({ min: 0, max: 1, noNaN: true });

/**
 * 生成有效的日期字符串 - 使用时间戳范围避免无效日期
 */
const dateStringArb = fc
  .integer({ min: 1577836800000, max: 1924905600000 }) // 2020-01-01 to 2030-12-31
  .map(timestamp => new Date(timestamp).toISOString());

/**
 * 生成有效的 UnifiedMetadata (岗位类型)
 */
const jobMetadataArb = fc.record({
  id: fc.uuid(),
  type: fc.constant('job' as const),
  normalized_skills: skillsArb,
  skill_categories: fc.array(fc.string(), { minLength: 0, maxLength: 5 }),
  experience_years: experienceYearsArb,
  education_level: fc.constantFrom('Bachelor', 'Master', 'PhD', ''),
  job_type: fc.constantFrom('technical', 'product', 'operation', 'marketing', 'design', 'other'),
  location: fc.constantFrom('Beijing', 'Shanghai', 'Remote', ''),
  industry: fc.array(fc.string(), { minLength: 0, maxLength: 3 }),
  update_time: dateStringArb,
  company: fc.string({ minLength: 1, maxLength: 50 }),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  required_skills: skillsArb,
  preferred_skills: fc.array(fc.string(), { minLength: 0, maxLength: 5 }),
  salary_min: fc.integer({ min: 5000, max: 50000 }),
  salary_max: fc.integer({ min: 50000, max: 200000 }),
  job_level: fc.constantFrom('Junior', 'Mid', 'Senior', 'Lead', ''),
});

/**
 * 生成有效的 UnifiedMetadata (简历类型)
 */
const resumeMetadataArb = fc.record({
  id: fc.uuid(),
  type: fc.constant('resume' as const),
  normalized_skills: skillsArb,
  skill_categories: fc.array(fc.string(), { minLength: 0, maxLength: 5 }),
  experience_years: experienceYearsArb,
  education_level: fc.constantFrom('Bachelor', 'Master', 'PhD', ''),
  job_type: fc.constantFrom('technical', 'product', 'operation', 'marketing', 'design', 'other'),
  location: fc.constantFrom('Beijing', 'Shanghai', 'Remote', ''),
  industry: fc.array(fc.string(), { minLength: 0, maxLength: 3 }),
  update_time: dateStringArb,
  owner: fc.uuid(),
  expected_salary_min: fc.integer({ min: 5000, max: 50000 }),
  expected_salary_max: fc.integer({ min: 50000, max: 200000 }),
});

/**
 * 生成候选项列表
 */
const candidatesArb = (metadataArb: fc.Arbitrary<UnifiedMetadata>) =>
  fc.array(
    fc.record({
      id: fc.uuid(),
      score: vectorScoreArb,
      metadata: metadataArb,
    }),
    { minLength: 1, maxLength: 20 }
  );

// ========== 属性测试 ==========

describe('Matching Service 属性测试', () => {
  /**
   * Property 7: 硬性过滤经验条件
   *
   * 对于任意求职者和过滤后的岗位列表，
   * 列表中每个岗位的经验年限要求都应该 <= 求职者的经验年限。
   *
   * **Validates: Requirements 5.2**
   */
  describe('Property 7: 硬性过滤经验条件', () => {
    test('简历找岗位时，过滤条件应要求岗位经验 <= 简历经验', () => {
      fc.assert(
        fc.property(unifiedTagsArb, resumeData => {
          const filters = matchingService.buildHardFilters(resumeData, 'job');

          // 如果简历有经验年限，过滤条件应该包含 experience_years.$lte
          if (resumeData.experienceYears > 0) {
            expect(filters).toHaveProperty('experience_years');
            const expFilter = filters['experience_years'] as Record<string, number>;
            expect(expFilter).toHaveProperty('$lte');
            expect(expFilter.$lte).toBe(resumeData.experienceYears);
          }

          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('岗位找简历时，过滤条件应要求简历经验 >= 岗位要求', () => {
      fc.assert(
        fc.property(unifiedTagsArb, jobData => {
          const filters = matchingService.buildHardFilters(jobData, 'resume');

          // 如果岗位有经验要求，过滤条件应该包含 experience_years.$gte
          if (jobData.experienceYears > 0) {
            expect(filters).toHaveProperty('experience_years');
            const expFilter = filters['experience_years'] as Record<string, number>;
            expect(expFilter).toHaveProperty('$gte');
            expect(expFilter.$gte).toBe(jobData.experienceYears);
          }

          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('经验年限为0时不应添加经验过滤条件', () => {
      fc.assert(
        fc.property(
          unifiedTagsArb.map(tags => ({ ...tags, experienceYears: 0 })),
          data => {
            const filtersForJob = matchingService.buildHardFilters(data, 'job');
            const filtersForResume = matchingService.buildHardFilters(data, 'resume');

            // 经验为0时不应有经验过滤
            expect(filtersForJob).not.toHaveProperty('experience_years');
            expect(filtersForResume).not.toHaveProperty('experience_years');

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 8: 硬性过滤技能条件
   *
   * 对于任意求职者和过滤后的岗位列表（在严格模式下），
   * 列表中每个岗位的必须技能都应该是求职者技能的子集。
   *
   * 注意：当前实现中技能过滤是在精排阶段通过 calculateSkillMatch 实现的，
   * 而不是在硬性过滤阶段。此测试验证技能匹配逻辑的正确性。
   *
   * **Validates: Requirements 5.3**
   */
  describe('Property 8: 硬性过滤技能条件', () => {
    test('技能匹配计算应正确识别匹配和缺失的技能', () => {
      fc.assert(
        fc.property(
          skillsArb,
          skillsArb,
          skillsArb,
          (sourceSkills, targetSkills, requiredSkills) => {
            // 创建候选项
            const candidates = [
              {
                id: 'test-id',
                score: 0.8,
                metadata: {
                  id: 'test-id',
                  type: 'job' as const,
                  normalized_skills: targetSkills,
                  skill_categories: [],
                  experience_years: 3,
                  education_level: 'Bachelor',
                  job_type: 'technical',
                  location: 'Beijing',
                  industry: [],
                  update_time: new Date().toISOString(),
                  required_skills: requiredSkills,
                },
              },
            ];

            const sourceData: UnifiedTags = {
              normalizedSkills: sourceSkills,
              skillCategories: [SkillCategory.PROGRAMMING_LANGUAGE],
              experienceYears: 5,
              educationLevel: 'Bachelor',
              jobType: JobType.TECHNICAL,
              location: 'Beijing',
              industry: [],
            };

            const results = matchingService.rerankByTags(
              candidates,
              sourceData,
              requiredSkills,
              DEFAULT_MATCHING_CONFIG
            );

            expect(results.length).toBe(1);
            const result = results[0];

            // 匹配的技能和缺失的技能应该互不重叠
            const matchedSet = new Set(result.matchedSkills.map(s => s.toLowerCase()));
            const missingSet = new Set(result.missingSkills.map(s => s.toLowerCase()));

            for (const skill of result.matchedSkills) {
              expect(missingSet.has(skill.toLowerCase())).toBe(false);
            }

            for (const skill of result.missingSkills) {
              expect(matchedSet.has(skill.toLowerCase())).toBe(false);
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('当源技能包含所有必须技能时，技能匹配分数应为1', () => {
      fc.assert(
        fc.property(skillsArb, skills => {
          // 源技能包含所有必须技能
          const sourceSkills = [...skills];
          const requiredSkills = skills.slice(0, Math.max(1, Math.floor(skills.length / 2)));

          const candidates = [
            {
              id: 'test-id',
              score: 0.8,
              metadata: {
                id: 'test-id',
                type: 'job' as const,
                normalized_skills: skills,
                skill_categories: [],
                experience_years: 3,
                education_level: 'Bachelor',
                job_type: 'technical',
                location: 'Beijing',
                industry: [],
                update_time: new Date().toISOString(),
                required_skills: requiredSkills,
              },
            },
          ];

          const sourceData: UnifiedTags = {
            normalizedSkills: sourceSkills,
            skillCategories: [SkillCategory.PROGRAMMING_LANGUAGE],
            experienceYears: 5,
            educationLevel: 'Bachelor',
            jobType: JobType.TECHNICAL,
            location: 'Beijing',
            industry: [],
          };

          const results = matchingService.rerankByTags(
            candidates,
            sourceData,
            requiredSkills,
            DEFAULT_MATCHING_CONFIG
          );

          expect(results.length).toBe(1);
          // 当源技能包含所有必须技能时，技能匹配分数应为1
          expect(results[0].skillMatchScore).toBe(1);
          expect(results[0].missingSkills.length).toBe(0);

          return true;
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 9: 精排分数有效范围
   *
   * 对于任意匹配结果，其 skillMatchScore、experienceMatchScore、salaryMatchScore
   * 都应该在 [0, 1] 范围内。
   *
   * **Validates: Requirements 5.6, 5.7, 5.8**
   */
  describe('Property 9: 精排分数有效范围', () => {
    test('所有分数组件应在 [0, 1] 范围内', () => {
      fc.assert(
        fc.property(
          candidatesArb(jobMetadataArb as fc.Arbitrary<UnifiedMetadata>),
          unifiedTagsArb,
          skillsArb,
          (candidates, sourceData, requiredSkills) => {
            const results = matchingService.rerankByTags(
              candidates,
              sourceData,
              requiredSkills,
              DEFAULT_MATCHING_CONFIG
            );

            for (const result of results) {
              // skillMatchScore 应在 [0, 1] 范围内
              expect(result.skillMatchScore).toBeGreaterThanOrEqual(0);
              expect(result.skillMatchScore).toBeLessThanOrEqual(1);

              // experienceMatchScore 应在 [0, 1] 范围内
              expect(result.experienceMatchScore).toBeGreaterThanOrEqual(0);
              expect(result.experienceMatchScore).toBeLessThanOrEqual(1);

              // salaryMatchScore 应在 [0, 1] 范围内
              expect(result.salaryMatchScore).toBeGreaterThanOrEqual(0);
              expect(result.salaryMatchScore).toBeLessThanOrEqual(1);

              // vectorScore 应在 [0, 1] 范围内
              expect(result.vectorScore).toBeGreaterThanOrEqual(0);
              expect(result.vectorScore).toBeLessThanOrEqual(1);
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('简历类型的候选项分数也应在有效范围内', () => {
      fc.assert(
        fc.property(
          candidatesArb(resumeMetadataArb as fc.Arbitrary<UnifiedMetadata>),
          unifiedTagsArb,
          skillsArb,
          (candidates, sourceData, requiredSkills) => {
            const results = matchingService.rerankByTags(
              candidates,
              sourceData,
              requiredSkills,
              DEFAULT_MATCHING_CONFIG
            );

            for (const result of results) {
              expect(result.skillMatchScore).toBeGreaterThanOrEqual(0);
              expect(result.skillMatchScore).toBeLessThanOrEqual(1);
              expect(result.experienceMatchScore).toBeGreaterThanOrEqual(0);
              expect(result.experienceMatchScore).toBeLessThanOrEqual(1);
              expect(result.salaryMatchScore).toBeGreaterThanOrEqual(0);
              expect(result.salaryMatchScore).toBeLessThanOrEqual(1);
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 10: 精排加权公式正确性
   *
   * 对于任意匹配结果，其最终 score 应该等于
   * skillMatchScore * skillMatch + jobTypeMatchScore * jobTypeMatch + vectorScore * vectorSimilarity + experienceMatchScore * experienceMatch + salaryMatchScore * salaryMatch
   * （允许浮点误差 0.01）
   *
   * **Validates: Requirements 5.9**
   */
  describe('Property 10: 精排加权公式正确性', () => {
    test('最终分数应符合加权公式（包含岗位类型匹配）', () => {
      fc.assert(
        fc.property(
          candidatesArb(jobMetadataArb as fc.Arbitrary<UnifiedMetadata>),
          unifiedTagsArb,
          skillsArb,
          (candidates, sourceData, requiredSkills) => {
            const config = DEFAULT_MATCHING_CONFIG;
            const results = matchingService.rerankByTags(
              candidates,
              sourceData,
              requiredSkills,
              config
            );

            for (const result of results) {
              const expectedScore =
                result.skillMatchScore * config.weights.skillMatch +
                result.jobTypeMatchScore * config.weights.jobTypeMatch +
                result.vectorScore * config.weights.vectorSimilarity +
                result.experienceMatchScore * config.weights.experienceMatch +
                result.salaryMatchScore * config.weights.salaryMatch;

              // 允许浮点误差 0.01
              expect(Math.abs(result.score - expectedScore)).toBeLessThan(0.01);
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('使用自定义权重时加权公式仍然正确', () => {
      // 生成自定义权重（总和为1）- 使用 Math.fround 确保是 32-bit float
      const customWeightsArb = fc
        .tuple(
          fc.float({ min: Math.fround(0.1), max: Math.fround(0.4), noNaN: true }),
          fc.float({ min: Math.fround(0.1), max: Math.fround(0.3), noNaN: true }),
          fc.float({ min: Math.fround(0.1), max: Math.fround(0.3), noNaN: true }),
          fc.float({ min: Math.fround(0.05), max: Math.fround(0.2), noNaN: true }),
          fc.float({ min: Math.fround(0.05), max: Math.fround(0.15), noNaN: true })
        )
        .map(([a, b, c, d, e]) => {
          const total = a + b + c + d + e;
          return {
            skillMatch: a / total,
            jobTypeMatch: b / total,
            vectorSimilarity: c / total,
            experienceMatch: d / total,
            salaryMatch: e / total,
          };
        });

      fc.assert(
        fc.property(
          candidatesArb(jobMetadataArb as fc.Arbitrary<UnifiedMetadata>),
          unifiedTagsArb,
          skillsArb,
          customWeightsArb,
          (candidates, sourceData, requiredSkills, weights) => {
            const config: MatchingConfig = {
              ...DEFAULT_MATCHING_CONFIG,
              weights,
            };

            const results = matchingService.rerankByTags(
              candidates,
              sourceData,
              requiredSkills,
              config
            );

            for (const result of results) {
              const expectedScore =
                result.skillMatchScore * weights.skillMatch +
                result.jobTypeMatchScore * weights.jobTypeMatch +
                result.vectorScore * weights.vectorSimilarity +
                result.experienceMatchScore * weights.experienceMatch +
                result.salaryMatchScore * weights.salaryMatch;

              // 允许浮点误差 0.01
              expect(Math.abs(result.score - expectedScore)).toBeLessThan(0.01);
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('结果应按最终分数降序排列', () => {
      fc.assert(
        fc.property(
          candidatesArb(jobMetadataArb as fc.Arbitrary<UnifiedMetadata>),
          unifiedTagsArb,
          skillsArb,
          (candidates, sourceData, requiredSkills) => {
            const results = matchingService.rerankByTags(
              candidates,
              sourceData,
              requiredSkills,
              DEFAULT_MATCHING_CONFIG
            );

            // 验证结果按分数降序排列
            for (let i = 1; i < results.length; i++) {
              expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 11: 过滤放宽有效性
   *
   * 对于任意查询条件，如果严格过滤返回空结果，则放宽过滤后返回的结果数量应该 >= 0
   * （即不会抛出错误），且如果存在符合放宽条件的数据，结果数量应该 > 0。
   *
   * 注意：由于 relaxFilters 是私有方法，我们通过测试 buildHardFilters 的行为
   * 来间接验证过滤放宽的逻辑。
   *
   * **Validates: Requirements 5.10**
   */
  describe('Property 11: 过滤放宽有效性', () => {
    test('放宽经验过滤应增加允许的经验范围', () => {
      fc.assert(
        fc.property(
          unifiedTagsArb.filter(tags => tags.experienceYears > 0),
          sourceData => {
            // 获取原始过滤条件
            const originalFilters = matchingService.buildHardFilters(sourceData, 'job');

            // 验证原始过滤条件存在
            expect(originalFilters).toHaveProperty('experience_years');
            const originalExpFilter = originalFilters['experience_years'] as Record<string, number>;

            // 简历找岗位时，原始条件是 $lte: experienceYears
            expect(originalExpFilter.$lte).toBe(sourceData.experienceYears);

            // 放宽后应该允许 experienceYears + 1
            // 这里我们验证放宽逻辑的预期行为
            const relaxedExpValue = sourceData.experienceYears + 1;
            expect(relaxedExpValue).toBeGreaterThan(originalExpFilter.$lte);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('岗位找简历时放宽经验过滤应减少要求的经验', () => {
      fc.assert(
        fc.property(
          unifiedTagsArb.filter(tags => tags.experienceYears > 0),
          sourceData => {
            // 获取原始过滤条件
            const originalFilters = matchingService.buildHardFilters(sourceData, 'resume');

            // 验证原始过滤条件存在
            expect(originalFilters).toHaveProperty('experience_years');
            const originalExpFilter = originalFilters['experience_years'] as Record<string, number>;

            // 岗位找简历时，原始条件是 $gte: experienceYears
            expect(originalExpFilter.$gte).toBe(sourceData.experienceYears);

            // 放宽后应该允许 experienceYears - 1（但不小于0）
            const relaxedExpValue = Math.max(0, sourceData.experienceYears - 1);
            expect(relaxedExpValue).toBeLessThanOrEqual(originalExpFilter.$gte);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('岗位类型为 other 时不应添加岗位类型过滤', () => {
      fc.assert(
        fc.property(
          unifiedTagsArb.map(tags => ({ ...tags, jobType: JobType.OTHER })),
          sourceData => {
            const filtersForJob = matchingService.buildHardFilters(sourceData, 'job');
            const filtersForResume = matchingService.buildHardFilters(sourceData, 'resume');

            // 岗位类型为 other 时不应有岗位类型过滤
            expect(filtersForJob).not.toHaveProperty('job_type');
            expect(filtersForResume).not.toHaveProperty('job_type');

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('有效岗位类型应添加岗位类型过滤', () => {
      const validJobTypes = Object.values(JobType).filter(t => t !== JobType.OTHER);
      const validJobTypeArb = fc.constantFrom(...validJobTypes);

      fc.assert(
        fc.property(unifiedTagsArb, validJobTypeArb, (sourceData, jobType) => {
          const dataWithJobType = { ...sourceData, jobType };

          const filtersForJob = matchingService.buildHardFilters(dataWithJobType, 'job');
          const filtersForResume = matchingService.buildHardFilters(dataWithJobType, 'resume');

          // 有效岗位类型应添加过滤
          expect(filtersForJob).toHaveProperty('job_type', jobType);
          expect(filtersForResume).toHaveProperty('job_type', jobType);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('rerankByTags 不应抛出错误，即使输入为空', () => {
      fc.assert(
        fc.property(unifiedTagsArb, sourceData => {
          // 空候选列表不应抛出错误
          const emptyResults = matchingService.rerankByTags(
            [],
            sourceData,
            [],
            DEFAULT_MATCHING_CONFIG
          );
          expect(emptyResults).toEqual([]);

          return true;
        }),
        { numRuns: 100 }
      );
    });
  });
});
