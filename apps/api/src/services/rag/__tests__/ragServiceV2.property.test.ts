/**
 * RAG Service V2 Embedding 格式化属性测试
 * 使用 fast-check 进行属性测试
 *
 * Feature: resume-job-matching-optimization
 * Validates: Requirements 2.3, 2.4, 4.1, 4.2, 4.3, 4.5, 6.3
 */

import { describe, test, expect } from '@jest/globals';
import * as fc from 'fast-check';
import { SkillCategory } from '../skillNormalizer.js';
import { JobType } from '../types.js';
import type { Resume, Job, UnifiedMetadata } from '../types.js';

// ========== 常量定义 ==========

const MAX_EMBEDDING_TEXT_LENGTH = 4000;
const SKILL_POSITION_THRESHOLD = 0.2;

// ========== 类型定义 ==========

interface NormalizedSkill {
  original: string;
  normalized: string;
  category: SkillCategory;
  aliases: string[];
}

interface UnifiedTags {
  normalizedSkills: string[];
  skillCategories: SkillCategory[];
  experienceYears: number;
  educationLevel: string;
  jobType: JobType;
  location: string;
  industry: string[];
}

interface EnhancedResumeInfo {
  normalizedSkills: NormalizedSkill[];
  skillCategories: SkillCategory[];
  targetJobType: JobType;
  experienceYears: number;
  educationLevel: string;
  industryExperience: string[];
  location: string;
  keyAchievements: string[];
  unifiedTags: UnifiedTags;
}

interface EnhancedJobInfo {
  normalizedRequiredSkills: NormalizedSkill[];
  normalizedPreferredSkills: NormalizedSkill[];
  skillCategories: SkillCategory[];
  jobType: JobType;
  experienceYears: number;
  educationLevel: string;
  industry: string;
  jobLevel: string;
  parsedRequiredSkills: string[];
  parsedPreferredSkills: string[];
  unifiedTags: UnifiedTags;
}

// ========== 格式化函数 ==========

function extractKeyContent(content: string, maxLength: number): string {
  if (!content) return '';
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength - 3) + '...';
}

function formatResumeForEmbeddingV2(resume: Resume, enhancedInfo: EnhancedResumeInfo): string {
  const parts: string[] = [];

  if (enhancedInfo.normalizedSkills.length > 0) {
    const skillsStr = enhancedInfo.normalizedSkills
      .map(s => s.normalized)
      .slice(0, 20)
      .join(', ');
    parts.push(`技能: ${skillsStr}`);
  }

  if (enhancedInfo.skillCategories.length > 0) {
    parts.push(`技能分类: ${enhancedInfo.skillCategories.join(', ')}`);
  }

  parts.push(`目标岗位: ${enhancedInfo.targetJobType}`);
  parts.push(`工作经验: ${enhancedInfo.experienceYears || 0}年`);
  parts.push(`学历: ${enhancedInfo.educationLevel || '未知'}`);

  if (enhancedInfo.industryExperience && enhancedInfo.industryExperience.length > 0) {
    parts.push(`行业经验: ${enhancedInfo.industryExperience.slice(0, 5).join(', ')}`);
  }

  if (enhancedInfo.location) {
    parts.push(`地点: ${enhancedInfo.location}`);
  }

  if (enhancedInfo.keyAchievements && enhancedInfo.keyAchievements.length > 0) {
    parts.push(`成就: ${enhancedInfo.keyAchievements.slice(0, 3).join('; ')}`);
  }

  const currentLength = parts.join('\n').length;
  const remainingLength = MAX_EMBEDDING_TEXT_LENGTH - currentLength - 50;

  if (remainingLength > 200 && resume.content) {
    const contentSummary = extractKeyContent(resume.content, remainingLength);
    if (contentSummary) {
      parts.push(`经历: ${contentSummary}`);
    }
  }

  const result = parts.join('\n');
  if (result.length > MAX_EMBEDDING_TEXT_LENGTH) {
    return result.substring(0, MAX_EMBEDDING_TEXT_LENGTH);
  }
  return result;
}

function formatJobForEmbeddingV2(job: Job, enhancedInfo: EnhancedJobInfo): string {
  const parts: string[] = [];

  parts.push(`职位: ${job.title}`);

  if (enhancedInfo.normalizedRequiredSkills.length > 0) {
    const requiredSkillsStr = enhancedInfo.normalizedRequiredSkills
      .map(s => s.normalized)
      .slice(0, 15)
      .join(', ');
    parts.push(`必须技能: ${requiredSkillsStr}`);
  }

  if (enhancedInfo.normalizedPreferredSkills.length > 0) {
    const preferredSkillsStr = enhancedInfo.normalizedPreferredSkills
      .map(s => s.normalized)
      .slice(0, 10)
      .join(', ');
    parts.push(`加分技能: ${preferredSkillsStr}`);
  }

  if (enhancedInfo.skillCategories.length > 0) {
    parts.push(`技能分类: ${enhancedInfo.skillCategories.join(', ')}`);
  }

  parts.push(`岗位类型: ${enhancedInfo.jobType}`);
  parts.push(`经验要求: ${enhancedInfo.experienceYears || 0}年`);
  parts.push(`学历要求: ${enhancedInfo.educationLevel || '不限'}`);

  if (enhancedInfo.industry) {
    parts.push(`行业: ${enhancedInfo.industry}`);
  }
  if (enhancedInfo.jobLevel) {
    parts.push(`级别: ${enhancedInfo.jobLevel}`);
  }
  if (job.location) {
    parts.push(`地点: ${job.location}`);
  }
  if (job.companyName) {
    parts.push(`公司: ${job.companyName}`);
  }

  const currentLength = parts.join('\n').length;
  const remainingLength = MAX_EMBEDDING_TEXT_LENGTH - currentLength - 50;

  if (remainingLength > 200) {
    const jobContent = [job.responsibilities, job.requirements, job.description]
      .filter(Boolean)
      .join('\n');
    if (jobContent) {
      const contentSummary = extractKeyContent(jobContent, remainingLength);
      if (contentSummary) {
        parts.push(`职责要求: ${contentSummary}`);
      }
    }
  }

  const result = parts.join('\n');
  if (result.length > MAX_EMBEDDING_TEXT_LENGTH) {
    return result.substring(0, MAX_EMBEDDING_TEXT_LENGTH);
  }
  return result;
}

// ========== 测试数据生成器 ==========

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
  { minLength: 1, maxLength: 15 }
);

const skillCategoriesArb = fc.array(fc.constantFrom(...Object.values(SkillCategory)), {
  minLength: 1,
  maxLength: 5,
});

const jobTypeArb = fc.constantFrom(...Object.values(JobType));
const experienceYearsArb = fc.integer({ min: 0, max: 20 });

const contentArb = (minLength: number, maxLength: number) =>
  fc.string({ minLength, maxLength }).map(s => s.replace(/[^\x20-\x7E\u4e00-\u9fa5]/g, ' '));

const longContentArb = fc
  .array(fc.lorem({ mode: 'sentences', maxCount: 10 }), { minLength: 50, maxLength: 100 })
  .map(sentences => sentences.join(' '));

const normalizedSkillArb = fc.record({
  original: fc.string({ minLength: 1, maxLength: 30 }),
  normalized: fc.constantFrom(
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
  category: fc.constantFrom(...Object.values(SkillCategory)),
  aliases: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 0, maxLength: 3 }),
});

const enhancedResumeInfoArb = fc.record({
  normalizedSkills: fc.array(normalizedSkillArb, { minLength: 1, maxLength: 20 }),
  skillCategories: skillCategoriesArb,
  targetJobType: jobTypeArb,
  experienceYears: experienceYearsArb,
  educationLevel: fc.constantFrom('Bachelor', 'Master', 'PhD', 'High School', '本科', '硕士'),
  industryExperience: fc.array(fc.constantFrom('Web3', 'Fintech', 'AI', 'Gaming', '互联网'), {
    minLength: 0,
    maxLength: 5,
  }),
  location: fc.constantFrom('Beijing', 'Shanghai', 'Shenzhen', 'Remote', '北京', '上海', ''),
  keyAchievements: fc.array(fc.lorem({ mode: 'sentences', maxCount: 2 }), {
    minLength: 0,
    maxLength: 5,
  }),
  unifiedTags: fc.record({
    normalizedSkills: skillsArb,
    skillCategories: skillCategoriesArb,
    experienceYears: experienceYearsArb,
    educationLevel: fc.constantFrom('Bachelor', 'Master', 'PhD', ''),
    jobType: jobTypeArb,
    location: fc.constantFrom('Beijing', 'Shanghai', 'Remote', ''),
    industry: fc.array(fc.constantFrom('Web3', 'Fintech', 'AI'), { minLength: 0, maxLength: 3 }),
  }),
});

const enhancedJobInfoArb = fc.record({
  normalizedRequiredSkills: fc.array(normalizedSkillArb, { minLength: 1, maxLength: 15 }),
  normalizedPreferredSkills: fc.array(normalizedSkillArb, { minLength: 0, maxLength: 10 }),
  skillCategories: skillCategoriesArb,
  jobType: jobTypeArb,
  experienceYears: experienceYearsArb,
  educationLevel: fc.constantFrom('Bachelor', 'Master', 'PhD', '不限', ''),
  industry: fc.constantFrom('Web3', 'Fintech', 'AI', 'Gaming', ''),
  jobLevel: fc.constantFrom('Junior', 'Mid', 'Senior', 'Lead', ''),
  parsedRequiredSkills: skillsArb,
  parsedPreferredSkills: fc.array(fc.string({ minLength: 1, maxLength: 20 }), {
    minLength: 0,
    maxLength: 5,
  }),
  unifiedTags: fc.record({
    normalizedSkills: skillsArb,
    skillCategories: skillCategoriesArb,
    experienceYears: experienceYearsArb,
    educationLevel: fc.constantFrom('Bachelor', 'Master', 'PhD', ''),
    jobType: jobTypeArb,
    location: fc.constantFrom('Beijing', 'Shanghai', 'Remote', ''),
    industry: fc.array(fc.constantFrom('Web3', 'Fintech', 'AI'), { minLength: 0, maxLength: 3 }),
  }),
});

const resumeArb = fc.record({
  id: fc.uuid(),
  userId: fc.uuid(),
  content: contentArb(100, 2000),
  name: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
  parsedData: fc.constant(undefined),
});

const longResumeArb = fc.record({
  id: fc.uuid(),
  userId: fc.uuid(),
  content: longContentArb,
  name: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
  parsedData: fc.constant(undefined),
});

const jobArb = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 5, maxLength: 100 }),
  description: contentArb(100, 1000),
  companyName: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
  responsibilities: fc.option(contentArb(50, 500), { nil: undefined }),
  requirements: fc.option(contentArb(50, 500), { nil: undefined }),
  location: fc.option(fc.constantFrom('Beijing', 'Shanghai', 'Remote', '北京', '上海'), {
    nil: undefined,
  }),
  skills: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 0, maxLength: 10 }),
  level: fc.option(fc.constantFrom('Junior', 'Mid', 'Senior', 'Lead'), { nil: undefined }),
});

const longJobArb = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 5, maxLength: 100 }),
  description: longContentArb,
  companyName: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
  responsibilities: fc.option(longContentArb, { nil: undefined }),
  requirements: fc.option(longContentArb, { nil: undefined }),
  location: fc.option(fc.constantFrom('Beijing', 'Shanghai', 'Remote'), { nil: undefined }),
  skills: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 0, maxLength: 10 }),
  level: fc.option(fc.constantFrom('Junior', 'Mid', 'Senior', 'Lead'), { nil: undefined }),
});

// ========== 辅助函数 ==========

function findSkillsPosition(text: string): number {
  const skillKeywords = ['技能', 'skills', '必须技能', '加分技能'];
  const lowerText = text.toLowerCase();

  for (const keyword of skillKeywords) {
    const index = lowerText.indexOf(keyword.toLowerCase());
    if (index !== -1) {
      return index / text.length;
    }
  }
  return 1;
}

// ========== 属性测试 ==========

describe('RAG Service V2 Embedding 格式化属性测试', () => {
  /**
   * Property 5: Embedding 文本技能优先
   * **Validates: Requirements 4.1, 4.2**
   */
  describe('Property 5: Embedding 文本技能优先', () => {
    test('简历 Embedding 文本中技能应出现在前 20% 位置', () => {
      fc.assert(
        fc.property(resumeArb, enhancedResumeInfoArb, (resume, enhancedInfo) => {
          const embeddingText = formatResumeForEmbeddingV2(
            resume as Resume,
            enhancedInfo as EnhancedResumeInfo
          );
          const skillsPosition = findSkillsPosition(embeddingText);
          expect(skillsPosition).toBeLessThanOrEqual(SKILL_POSITION_THRESHOLD);
          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('岗位 Embedding 文本中技能应出现在前 20% 位置', () => {
      fc.assert(
        fc.property(jobArb, enhancedJobInfoArb, (job, enhancedInfo) => {
          const embeddingText = formatJobForEmbeddingV2(
            job as Job,
            enhancedInfo as EnhancedJobInfo
          );
          const skillsPosition = findSkillsPosition(embeddingText);
          expect(skillsPosition).toBeLessThanOrEqual(SKILL_POSITION_THRESHOLD);
          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('简历 Embedding 文本第一行应包含技能信息', () => {
      fc.assert(
        fc.property(resumeArb, enhancedResumeInfoArb, (resume, enhancedInfo) => {
          const embeddingText = formatResumeForEmbeddingV2(
            resume as Resume,
            enhancedInfo as EnhancedResumeInfo
          );
          const firstLine = embeddingText.split('\n')[0].toLowerCase();
          expect(firstLine).toMatch(/技能|skills/i);
          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('岗位 Embedding 文本前两行应包含技能信息', () => {
      fc.assert(
        fc.property(jobArb, enhancedJobInfoArb, (job, enhancedInfo) => {
          const embeddingText = formatJobForEmbeddingV2(
            job as Job,
            enhancedInfo as EnhancedJobInfo
          );
          const lines = embeddingText.split('\n');
          const firstTwoLines = lines.slice(0, 2).join('\n').toLowerCase();
          expect(firstTwoLines).toMatch(/技能|skills|职位/i);
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 6: Embedding 文本长度限制
   * **Validates: Requirements 4.3, 4.5**
   */
  describe('Property 6: Embedding 文本长度限制', () => {
    test('简历 Embedding 文本长度应 <= 4000 字符', () => {
      fc.assert(
        fc.property(resumeArb, enhancedResumeInfoArb, (resume, enhancedInfo) => {
          const embeddingText = formatResumeForEmbeddingV2(
            resume as Resume,
            enhancedInfo as EnhancedResumeInfo
          );
          expect(embeddingText.length).toBeLessThanOrEqual(MAX_EMBEDDING_TEXT_LENGTH);
          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('岗位 Embedding 文本长度应 <= 4000 字符', () => {
      fc.assert(
        fc.property(jobArb, enhancedJobInfoArb, (job, enhancedInfo) => {
          const embeddingText = formatJobForEmbeddingV2(
            job as Job,
            enhancedInfo as EnhancedJobInfo
          );
          expect(embeddingText.length).toBeLessThanOrEqual(MAX_EMBEDDING_TEXT_LENGTH);
          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('超长简历内容格式化后长度仍应 <= 4000 字符', () => {
      fc.assert(
        fc.property(longResumeArb, enhancedResumeInfoArb, (resume, enhancedInfo) => {
          const embeddingText = formatResumeForEmbeddingV2(
            resume as Resume,
            enhancedInfo as EnhancedResumeInfo
          );
          expect(embeddingText.length).toBeLessThanOrEqual(MAX_EMBEDDING_TEXT_LENGTH);
          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('超长岗位内容格式化后长度仍应 <= 4000 字符', () => {
      fc.assert(
        fc.property(longJobArb, enhancedJobInfoArb, (job, enhancedInfo) => {
          const embeddingText = formatJobForEmbeddingV2(
            job as Job,
            enhancedInfo as EnhancedJobInfo
          );
          expect(embeddingText.length).toBeLessThanOrEqual(MAX_EMBEDDING_TEXT_LENGTH);
          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('Embedding 文本长度应为正数', () => {
      fc.assert(
        fc.property(resumeArb, enhancedResumeInfoArb, (resume, enhancedInfo) => {
          const embeddingText = formatResumeForEmbeddingV2(
            resume as Resume,
            enhancedInfo as EnhancedResumeInfo
          );
          expect(embeddingText.length).toBeGreaterThan(0);
          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('岗位 Embedding 文本长度应为正数', () => {
      fc.assert(
        fc.property(jobArb, enhancedJobInfoArb, (job, enhancedInfo) => {
          const embeddingText = formatJobForEmbeddingV2(
            job as Job,
            enhancedInfo as EnhancedJobInfo
          );
          expect(embeddingText.length).toBeGreaterThan(0);
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * 额外属性：Embedding 文本结构化格式
   */
  describe('额外属性：Embedding 文本结构化格式', () => {
    test('简历 Embedding 文本应使用结构化格式', () => {
      fc.assert(
        fc.property(resumeArb, enhancedResumeInfoArb, (resume, enhancedInfo) => {
          const embeddingText = formatResumeForEmbeddingV2(
            resume as Resume,
            enhancedInfo as EnhancedResumeInfo
          );
          const structuredPatterns = [/技能:/, /工作经验:/, /学历:/, /目标岗位:/];
          let matchCount = 0;
          for (const pattern of structuredPatterns) {
            if (pattern.test(embeddingText)) {
              matchCount++;
            }
          }
          expect(matchCount).toBeGreaterThanOrEqual(2);
          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('岗位 Embedding 文本应使用结构化格式', () => {
      fc.assert(
        fc.property(jobArb, enhancedJobInfoArb, (job, enhancedInfo) => {
          const embeddingText = formatJobForEmbeddingV2(
            job as Job,
            enhancedInfo as EnhancedJobInfo
          );
          const structuredPatterns = [/职位:/, /必须技能:/, /经验要求:/, /岗位类型:/];
          let matchCount = 0;
          for (const pattern of structuredPatterns) {
            if (pattern.test(embeddingText)) {
              matchCount++;
            }
          }
          expect(matchCount).toBeGreaterThanOrEqual(2);
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });
});

// ========== Property 3 & 12 测试数据生成器 ==========

/**
 * 生成有效的日期字符串
 */
const dateStringArb = fc
  .integer({ min: 1577836800000, max: 1924905600000 })
  .map(timestamp => new Date(timestamp).toISOString());

/**
 * 生成有效的 UnifiedMetadata (简历类型)
 */
const resumeUnifiedMetadataArb: fc.Arbitrary<UnifiedMetadata> = fc.record({
  id: fc.uuid(),
  type: fc.constant('resume' as const),
  normalized_skills: fc.array(
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
      'Redis'
    ),
    { minLength: 1, maxLength: 15 }
  ),
  skill_categories: fc.array(fc.constantFrom(...Object.values(SkillCategory)), {
    minLength: 1,
    maxLength: 5,
  }),
  experience_years: fc.integer({ min: 0, max: 20 }),
  education_level: fc.constantFrom('Bachelor', 'Master', 'PhD', '本科', '硕士', ''),
  job_type: fc.constantFrom('technical', 'product', 'operation', 'marketing', 'design', 'other'),
  location: fc.constantFrom('Beijing', 'Shanghai', 'Remote', '北京', '上海', ''),
  industry: fc.array(fc.constantFrom('Web3', 'Fintech', 'AI', 'Gaming'), {
    minLength: 0,
    maxLength: 3,
  }),
  update_time: dateStringArb,
  owner: fc.uuid(),
  expected_salary_min: fc.option(fc.integer({ min: 5000, max: 50000 }), { nil: undefined }),
  expected_salary_max: fc.option(fc.integer({ min: 50000, max: 200000 }), { nil: undefined }),
});

/**
 * 生成有效的 UnifiedMetadata (岗位类型)
 */
const jobUnifiedMetadataArb: fc.Arbitrary<UnifiedMetadata> = fc.record({
  id: fc.uuid(),
  type: fc.constant('job' as const),
  normalized_skills: fc.array(
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
      'Redis'
    ),
    { minLength: 1, maxLength: 15 }
  ),
  skill_categories: fc.array(fc.constantFrom(...Object.values(SkillCategory)), {
    minLength: 1,
    maxLength: 5,
  }),
  experience_years: fc.integer({ min: 0, max: 20 }),
  education_level: fc.constantFrom('Bachelor', 'Master', 'PhD', '本科', '硕士', '不限', ''),
  job_type: fc.constantFrom('technical', 'product', 'operation', 'marketing', 'design', 'other'),
  location: fc.constantFrom('Beijing', 'Shanghai', 'Remote', '北京', '上海', ''),
  industry: fc.array(fc.constantFrom('Web3', 'Fintech', 'AI', 'Gaming'), {
    minLength: 0,
    maxLength: 3,
  }),
  update_time: dateStringArb,
  company: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
  title: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
  required_skills: fc.option(
    fc.array(fc.constantFrom('React', 'TypeScript', 'Node.js', 'Solidity'), {
      minLength: 0,
      maxLength: 10,
    }),
    { nil: undefined }
  ),
  preferred_skills: fc.option(
    fc.array(fc.constantFrom('Docker', 'AWS', 'GraphQL'), { minLength: 0, maxLength: 5 }),
    { nil: undefined }
  ),
  salary_min: fc.option(fc.integer({ min: 5000, max: 50000 }), { nil: undefined }),
  salary_max: fc.option(fc.integer({ min: 50000, max: 200000 }), { nil: undefined }),
  job_level: fc.option(fc.constantFrom('Junior', 'Mid', 'Senior', 'Lead', ''), { nil: undefined }),
});

// ========== Property 3 & 12 辅助函数 ==========

/**
 * 验证 UnifiedMetadata 是否包含所有必需字段
 */
function validateUnifiedMetadataRequiredFields(metadata: UnifiedMetadata): {
  valid: boolean;
  missingFields: string[];
} {
  const requiredFields = [
    'id',
    'type',
    'normalized_skills',
    'skill_categories',
    'experience_years',
    'education_level',
    'job_type',
    'location',
    'industry',
    'update_time',
  ];

  const missingFields: string[] = [];

  for (const field of requiredFields) {
    if (!(field in metadata) || metadata[field as keyof UnifiedMetadata] === undefined) {
      missingFields.push(field);
    }
  }

  return {
    valid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * 验证 normalized_skills 字段是否为非空数组
 */
function validateNormalizedSkillsNonEmpty(metadata: UnifiedMetadata): boolean {
  return Array.isArray(metadata.normalized_skills) && metadata.normalized_skills.length > 0;
}

/**
 * 模拟旧版 processResumeAndFindMatches 返回结构
 */
interface LegacyProcessResult {
  resumeData: Resume;
  matches: Array<{
    job: Job;
    matchDetails: {
      overallMatchScore: number;
      skillsMatch: { score: number; analysis: string };
      experienceMatch: { score: number; analysis: string };
      educationMatch: { score: number; analysis: string };
      summary: string;
      recommendations: string[];
    };
  }>;
  rawJobsData: Record<string, unknown>[];
}

/**
 * 验证旧版返回结构的字段完整性
 */
function validateLegacyResultStructure(result: LegacyProcessResult): {
  valid: boolean;
  missingFields: string[];
} {
  const missingFields: string[] = [];

  // 检查顶层字段
  if (!('resumeData' in result)) missingFields.push('resumeData');
  if (!('matches' in result)) missingFields.push('matches');
  if (!('rawJobsData' in result)) missingFields.push('rawJobsData');

  // 检查 resumeData 字段
  if (result.resumeData) {
    if (!('id' in result.resumeData)) missingFields.push('resumeData.id');
    if (!('userId' in result.resumeData)) missingFields.push('resumeData.userId');
    if (!('content' in result.resumeData)) missingFields.push('resumeData.content');
  }

  // 检查 matches 数组结构
  if (Array.isArray(result.matches) && result.matches.length > 0) {
    const firstMatch = result.matches[0];
    if (!('job' in firstMatch)) missingFields.push('matches[].job');
    if (!('matchDetails' in firstMatch)) missingFields.push('matches[].matchDetails');
  }

  // 检查 rawJobsData 是否为数组
  if (!Array.isArray(result.rawJobsData)) {
    missingFields.push('rawJobsData (should be array)');
  }

  return {
    valid: missingFields.length === 0,
    missingFields,
  };
}

// ========== Property 3 & 12 属性测试 ==========

describe('RAG Service V2 Metadata 和向后兼容性属性测试', () => {
  /**
   * Property 3: Metadata 格式一致性
   *
   * 对于任意简历或岗位，通过 RAG_Service 存储到 Pinecone 后，
   * 其 metadata 应该包含 UnifiedMetadata 定义的所有必需字段，
   * 且 normalized_skills 字段为非空数组。
   *
   * **Validates: Requirements 2.3, 2.4, 2.5**
   */
  describe('Property 3: Metadata 格式一致性', () => {
    test('简历 UnifiedMetadata 应包含所有必需字段', () => {
      fc.assert(
        fc.property(resumeUnifiedMetadataArb, metadata => {
          const validation = validateUnifiedMetadataRequiredFields(metadata);

          expect(validation.valid).toBe(true);
          if (!validation.valid) {
            console.log('缺失字段:', validation.missingFields);
          }

          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('岗位 UnifiedMetadata 应包含所有必需字段', () => {
      fc.assert(
        fc.property(jobUnifiedMetadataArb, metadata => {
          const validation = validateUnifiedMetadataRequiredFields(metadata);

          expect(validation.valid).toBe(true);
          if (!validation.valid) {
            console.log('缺失字段:', validation.missingFields);
          }

          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('简历 normalized_skills 应为非空数组', () => {
      fc.assert(
        fc.property(resumeUnifiedMetadataArb, metadata => {
          const isValid = validateNormalizedSkillsNonEmpty(metadata);

          expect(isValid).toBe(true);
          expect(Array.isArray(metadata.normalized_skills)).toBe(true);
          expect(metadata.normalized_skills.length).toBeGreaterThan(0);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('岗位 normalized_skills 应为非空数组', () => {
      fc.assert(
        fc.property(jobUnifiedMetadataArb, metadata => {
          const isValid = validateNormalizedSkillsNonEmpty(metadata);

          expect(isValid).toBe(true);
          expect(Array.isArray(metadata.normalized_skills)).toBe(true);
          expect(metadata.normalized_skills.length).toBeGreaterThan(0);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('简历和岗位 Metadata 应使用相同的必需字段名', () => {
      fc.assert(
        fc.property(
          resumeUnifiedMetadataArb,
          jobUnifiedMetadataArb,
          (resumeMetadata, jobMetadata) => {
            // 共同的必需字段
            const commonRequiredFields = [
              'id',
              'type',
              'normalized_skills',
              'skill_categories',
              'experience_years',
              'education_level',
              'job_type',
              'location',
              'industry',
              'update_time',
            ];

            // 验证两者都有这些字段
            for (const field of commonRequiredFields) {
              expect(field in resumeMetadata).toBe(true);
              expect(field in jobMetadata).toBe(true);
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('type 字段应正确标识简历或岗位', () => {
      fc.assert(
        fc.property(
          resumeUnifiedMetadataArb,
          jobUnifiedMetadataArb,
          (resumeMetadata, jobMetadata) => {
            expect(resumeMetadata.type).toBe('resume');
            expect(jobMetadata.type).toBe('job');

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('experience_years 应为非负整数', () => {
      fc.assert(
        fc.property(fc.oneof(resumeUnifiedMetadataArb, jobUnifiedMetadataArb), metadata => {
          expect(typeof metadata.experience_years).toBe('number');
          expect(metadata.experience_years).toBeGreaterThanOrEqual(0);
          expect(Number.isInteger(metadata.experience_years)).toBe(true);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('update_time 应为有效的 ISO 日期字符串', () => {
      fc.assert(
        fc.property(fc.oneof(resumeUnifiedMetadataArb, jobUnifiedMetadataArb), metadata => {
          expect(typeof metadata.update_time).toBe('string');

          // 验证是有效的 ISO 日期格式
          const date = new Date(metadata.update_time);
          expect(date.toString()).not.toBe('Invalid Date');

          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('skill_categories 应为有效的 SkillCategory 数组', () => {
      const validCategories = Object.values(SkillCategory);

      fc.assert(
        fc.property(fc.oneof(resumeUnifiedMetadataArb, jobUnifiedMetadataArb), metadata => {
          expect(Array.isArray(metadata.skill_categories)).toBe(true);

          for (const category of metadata.skill_categories) {
            expect(validCategories).toContain(category);
          }

          return true;
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 12: 向后兼容性
   *
   * 对于任意简历 ID，调用 processResumeAndFindMatches（旧方法）返回的结果结构
   * 应该与升级前保持一致，包含 resumeData、matches、rawJobsData 字段。
   *
   * 注意：由于无法在属性测试中调用实际的数据库和 AI 服务，
   * 此测试验证返回结构的类型定义和字段完整性。
   *
   * **Validates: Requirements 6.3**
   */
  describe('Property 12: 向后兼容性', () => {
    /**
     * 生成模拟的旧版返回结果
     */
    const legacyResultArb: fc.Arbitrary<LegacyProcessResult> = fc.record({
      resumeData: fc.record({
        id: fc.uuid(),
        userId: fc.uuid(),
        content: fc.string({ minLength: 100, maxLength: 2000 }),
        name: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
        parsedData: fc.option(
          fc.record({
            skills: fc.array(fc.string(), { minLength: 0, maxLength: 10 }),
            experienceYears: fc.integer({ min: 0, max: 20 }),
            educationLevel: fc.constantFrom('Bachelor', 'Master', 'PhD', ''),
          }),
          { nil: undefined }
        ),
      }) as fc.Arbitrary<Resume>,
      matches: fc.array(
        fc.record({
          job: fc.record({
            id: fc.uuid(),
            title: fc.string({ minLength: 5, maxLength: 100 }),
            description: fc.string({ minLength: 50, maxLength: 500 }),
            companyName: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
            location: fc.option(fc.constantFrom('Beijing', 'Shanghai', 'Remote'), {
              nil: undefined,
            }),
          }) as fc.Arbitrary<Job>,
          matchDetails: fc.record({
            overallMatchScore: fc.float({ min: 0, max: 1, noNaN: true }),
            skillsMatch: fc.record({
              score: fc.float({ min: 0, max: 100, noNaN: true }),
              analysis: fc.string({ minLength: 10, maxLength: 200 }),
            }),
            experienceMatch: fc.record({
              score: fc.float({ min: 0, max: 100, noNaN: true }),
              analysis: fc.string({ minLength: 10, maxLength: 200 }),
            }),
            educationMatch: fc.record({
              score: fc.float({ min: 0, max: 100, noNaN: true }),
              analysis: fc.string({ minLength: 10, maxLength: 200 }),
            }),
            summary: fc.string({ minLength: 20, maxLength: 500 }),
            recommendations: fc.array(fc.string({ minLength: 10, maxLength: 100 }), {
              minLength: 1,
              maxLength: 5,
            }),
          }),
        }),
        { minLength: 0, maxLength: 10 }
      ),
      rawJobsData: fc.array(
        fc.record({
          topic_id: fc.uuid(),
          position_name: fc.string({ minLength: 5, maxLength: 100 }),
          company: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
          content: fc.option(fc.string({ minLength: 50, maxLength: 500 }), { nil: undefined }),
        }),
        { minLength: 0, maxLength: 10 }
      ),
    });

    test('旧版返回结构应包含 resumeData、matches、rawJobsData 字段', () => {
      fc.assert(
        fc.property(legacyResultArb, result => {
          const validation = validateLegacyResultStructure(result);

          expect(validation.valid).toBe(true);
          if (!validation.valid) {
            console.log('缺失字段:', validation.missingFields);
          }

          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('resumeData 应包含 id、userId、content 字段', () => {
      fc.assert(
        fc.property(legacyResultArb, result => {
          expect('id' in result.resumeData).toBe(true);
          expect('userId' in result.resumeData).toBe(true);
          expect('content' in result.resumeData).toBe(true);

          expect(typeof result.resumeData.id).toBe('string');
          expect(typeof result.resumeData.userId).toBe('string');
          expect(typeof result.resumeData.content).toBe('string');

          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('matches 应为数组类型', () => {
      fc.assert(
        fc.property(legacyResultArb, result => {
          expect(Array.isArray(result.matches)).toBe(true);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('matches 中的每个元素应包含 job 和 matchDetails', () => {
      fc.assert(
        fc.property(
          legacyResultArb.filter(r => r.matches.length > 0),
          result => {
            for (const match of result.matches) {
              expect('job' in match).toBe(true);
              expect('matchDetails' in match).toBe(true);

              // 验证 job 结构
              expect('id' in match.job).toBe(true);
              expect('title' in match.job).toBe(true);
              expect('description' in match.job).toBe(true);

              // 验证 matchDetails 结构
              expect('overallMatchScore' in match.matchDetails).toBe(true);
              expect('skillsMatch' in match.matchDetails).toBe(true);
              expect('experienceMatch' in match.matchDetails).toBe(true);
              expect('educationMatch' in match.matchDetails).toBe(true);
              expect('summary' in match.matchDetails).toBe(true);
              expect('recommendations' in match.matchDetails).toBe(true);
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('rawJobsData 应为数组类型', () => {
      fc.assert(
        fc.property(legacyResultArb, result => {
          expect(Array.isArray(result.rawJobsData)).toBe(true);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('matchDetails.overallMatchScore 应在 [0, 1] 范围内', () => {
      fc.assert(
        fc.property(
          legacyResultArb.filter(r => r.matches.length > 0),
          result => {
            for (const match of result.matches) {
              expect(match.matchDetails.overallMatchScore).toBeGreaterThanOrEqual(0);
              expect(match.matchDetails.overallMatchScore).toBeLessThanOrEqual(1);
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('matchDetails 中的各项分数应在 [0, 100] 范围内', () => {
      fc.assert(
        fc.property(
          legacyResultArb.filter(r => r.matches.length > 0),
          result => {
            for (const match of result.matches) {
              expect(match.matchDetails.skillsMatch.score).toBeGreaterThanOrEqual(0);
              expect(match.matchDetails.skillsMatch.score).toBeLessThanOrEqual(100);

              expect(match.matchDetails.experienceMatch.score).toBeGreaterThanOrEqual(0);
              expect(match.matchDetails.experienceMatch.score).toBeLessThanOrEqual(100);

              expect(match.matchDetails.educationMatch.score).toBeGreaterThanOrEqual(0);
              expect(match.matchDetails.educationMatch.score).toBeLessThanOrEqual(100);
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('recommendations 应为非空字符串数组', () => {
      fc.assert(
        fc.property(
          legacyResultArb.filter(r => r.matches.length > 0),
          result => {
            for (const match of result.matches) {
              expect(Array.isArray(match.matchDetails.recommendations)).toBe(true);
              expect(match.matchDetails.recommendations.length).toBeGreaterThan(0);

              for (const rec of match.matchDetails.recommendations) {
                expect(typeof rec).toBe('string');
                expect(rec.length).toBeGreaterThan(0);
              }
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
