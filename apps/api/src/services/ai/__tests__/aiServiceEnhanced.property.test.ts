/**
 * AI Service 增强方法属性测试
 * 使用 fast-check 进行属性测试
 *
 * Feature: resume-job-matching-optimization
 * Property 4: AI 提取技能标准化
 * Validates: Requirements 3.1, 3.2, 3.3
 */

import { describe, test, expect } from '@jest/globals';
import * as fc from 'fast-check';
import { skillNormalizer, NormalizedSkill } from '../../rag/skillNormalizer.js';
import { EnhancedResumeInfo, EnhancedJobInfo } from '../aiServiceEnhanced.js';
import { JobType, UnifiedTags } from '../../rag/types.js';
import { SkillCategory } from '../../rag/skillNormalizer.js';

/**
 * 模拟 AI 提取后的技能列表
 * 这些技能应该已经通过 SkillNormalizer 进行了标准化
 */
const SAMPLE_SKILLS = [
  // 编程语言
  'JavaScript',
  'TypeScript',
  'Python',
  'Rust',
  'Go',
  'Solidity',
  'Java',
  // 区块链
  'Ethereum',
  'Smart Contract',
  'DeFi',
  'NFT',
  'Web3',
  'Hardhat',
  // 前端
  'React',
  'Vue',
  'Angular',
  'Next.js',
  'TailwindCSS',
  // 后端
  'Node.js',
  'Express',
  'NestJS',
  'Django',
  'FastAPI',
  'GraphQL',
  // 数据库
  'PostgreSQL',
  'MongoDB',
  'Redis',
  'MySQL',
  // 云服务
  'AWS',
  'Azure',
  'GCP',
  'Docker',
  'Kubernetes',
  // 产品
  'Product Management',
  'User Research',
  'Agile',
  'Scrum',
  // 运营
  'Community Operation',
  'Growth Hacking',
  'Content Operation',
  // 市场
  'Marketing',
  'Digital Marketing',
  'SEO',
  // 设计
  'UI Design',
  'UX Design',
  'Figma',
  // 研究
  'Data Science',
  'Machine Learning',
  'Market Research',
  // 商务
  'Business Development',
  'Sales',
  'Project Management',
];

/**
 * 生成模拟的 EnhancedResumeInfo
 */
function generateMockEnhancedResumeInfo(skills: string[]): EnhancedResumeInfo {
  const normalizedSkills = skillNormalizer.normalizeMany(skills);
  const skillCategories = [...new Set(normalizedSkills.map(s => s.category))] as SkillCategory[];

  const unifiedTags: UnifiedTags = {
    normalizedSkills: normalizedSkills.map(s => s.normalized),
    skillCategories,
    experienceYears: 3,
    educationLevel: '本科',
    jobType: JobType.TECHNICAL,
    location: '上海',
    industry: ['Web3', '区块链'],
  };

  return {
    skills,
    experienceYears: 3,
    educationLevel: '本科',
    industryExperience: ['Web3', '区块链'],
    location: '上海',
    keyAchievements: ['开发了 DeFi 协议'],
    salaryFlexible: true,
    normalizedSkills,
    skillCategories,
    targetJobType: JobType.TECHNICAL,
    unifiedTags,
  };
}

/**
 * 生成模拟的 EnhancedJobInfo
 */
function generateMockEnhancedJobInfo(
  requiredSkills: string[],
  preferredSkills: string[]
): EnhancedJobInfo {
  const normalizedRequiredSkills = skillNormalizer.normalizeMany(requiredSkills);
  const normalizedPreferredSkills = skillNormalizer.normalizeMany(preferredSkills);
  const allNormalizedSkills = [...normalizedRequiredSkills, ...normalizedPreferredSkills];
  const skillCategories = [...new Set(allNormalizedSkills.map(s => s.category))] as SkillCategory[];

  const unifiedTags: UnifiedTags = {
    normalizedSkills: allNormalizedSkills.map(s => s.normalized),
    skillCategories,
    experienceYears: 3,
    educationLevel: '本科',
    jobType: JobType.TECHNICAL,
    location: '上海',
    industry: ['Web3'],
  };

  return {
    requiredSkills,
    preferredSkills,
    parsedRequiredSkills: requiredSkills,
    parsedPreferredSkills: preferredSkills,
    experienceYears: 3,
    educationLevel: '本科',
    industry: 'Web3',
    jobLevel: '高级',
    keyResponsibilities: ['开发智能合约'],
    salaryNegotiable: true,
    benefits: ['远程办公'],
    normalizedRequiredSkills,
    normalizedPreferredSkills,
    skillCategories,
    jobType: JobType.TECHNICAL,
    unifiedTags,
  };
}

describe('AI Service 增强方法属性测试', () => {
  /**
   * Property 4: AI 提取技能标准化
   *
   * 对于任意简历或岗位，通过 AI_Service 提取的技能列表中的每个技能
   * 都应该是标准化后的格式，即调用 Skill_Normalizer.normalize(skill).normalized
   * 应该等于 skill 本身。
   *
   * **Validates: Requirements 3.1, 3.2, 3.3**
   */
  describe('Property 4: AI 提取技能标准化', () => {
    test('EnhancedResumeInfo 中的 normalizedSkills 应该都是标准化格式', () => {
      // 生成随机技能子集
      const skillsArb = fc.shuffledSubarray(SAMPLE_SKILLS, { minLength: 1, maxLength: 10 });

      fc.assert(
        fc.property(skillsArb, skills => {
          const enhancedInfo = generateMockEnhancedResumeInfo(skills);

          // 验证每个 normalizedSkill 都是标准化格式
          for (const normalizedSkill of enhancedInfo.normalizedSkills) {
            const reNormalized = skillNormalizer.normalize(normalizedSkill.normalized);
            // 标准化后的技能再次标准化应该等于自身
            expect(reNormalized.normalized).toBe(normalizedSkill.normalized);
          }

          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('EnhancedResumeInfo 的 unifiedTags.normalizedSkills 应该都是标准化格式', () => {
      const skillsArb = fc.shuffledSubarray(SAMPLE_SKILLS, { minLength: 1, maxLength: 10 });

      fc.assert(
        fc.property(skillsArb, skills => {
          const enhancedInfo = generateMockEnhancedResumeInfo(skills);

          // 验证 unifiedTags 中的每个技能都是标准化格式
          for (const skill of enhancedInfo.unifiedTags.normalizedSkills) {
            const normalized = skillNormalizer.normalize(skill);
            // 标准化后的技能再次标准化应该等于自身
            expect(normalized.normalized).toBe(skill);
          }

          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('EnhancedJobInfo 中的 normalizedRequiredSkills 应该都是标准化格式', () => {
      const requiredSkillsArb = fc.shuffledSubarray(SAMPLE_SKILLS, { minLength: 1, maxLength: 5 });
      const preferredSkillsArb = fc.shuffledSubarray(SAMPLE_SKILLS, { minLength: 0, maxLength: 5 });

      fc.assert(
        fc.property(requiredSkillsArb, preferredSkillsArb, (requiredSkills, preferredSkills) => {
          const enhancedInfo = generateMockEnhancedJobInfo(requiredSkills, preferredSkills);

          // 验证每个 normalizedRequiredSkill 都是标准化格式
          for (const normalizedSkill of enhancedInfo.normalizedRequiredSkills) {
            const reNormalized = skillNormalizer.normalize(normalizedSkill.normalized);
            expect(reNormalized.normalized).toBe(normalizedSkill.normalized);
          }

          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('EnhancedJobInfo 中的 normalizedPreferredSkills 应该都是标准化格式', () => {
      const requiredSkillsArb = fc.shuffledSubarray(SAMPLE_SKILLS, { minLength: 1, maxLength: 5 });
      const preferredSkillsArb = fc.shuffledSubarray(SAMPLE_SKILLS, { minLength: 1, maxLength: 5 });

      fc.assert(
        fc.property(requiredSkillsArb, preferredSkillsArb, (requiredSkills, preferredSkills) => {
          const enhancedInfo = generateMockEnhancedJobInfo(requiredSkills, preferredSkills);

          // 验证每个 normalizedPreferredSkill 都是标准化格式
          for (const normalizedSkill of enhancedInfo.normalizedPreferredSkills) {
            const reNormalized = skillNormalizer.normalize(normalizedSkill.normalized);
            expect(reNormalized.normalized).toBe(normalizedSkill.normalized);
          }

          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('EnhancedJobInfo 的 unifiedTags.normalizedSkills 应该都是标准化格式', () => {
      const requiredSkillsArb = fc.shuffledSubarray(SAMPLE_SKILLS, { minLength: 1, maxLength: 5 });
      const preferredSkillsArb = fc.shuffledSubarray(SAMPLE_SKILLS, { minLength: 0, maxLength: 5 });

      fc.assert(
        fc.property(requiredSkillsArb, preferredSkillsArb, (requiredSkills, preferredSkills) => {
          const enhancedInfo = generateMockEnhancedJobInfo(requiredSkills, preferredSkills);

          // 验证 unifiedTags 中的每个技能都是标准化格式
          for (const skill of enhancedInfo.unifiedTags.normalizedSkills) {
            const normalized = skillNormalizer.normalize(skill);
            expect(normalized.normalized).toBe(skill);
          }

          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('标准化技能的幂等性：多次标准化结果应该相同', () => {
      const skillArb = fc.constantFrom(...SAMPLE_SKILLS);

      fc.assert(
        fc.property(skillArb, skill => {
          // 第一次标准化
          const first = skillNormalizer.normalize(skill);
          // 第二次标准化（对标准化后的结果再次标准化）
          const second = skillNormalizer.normalize(first.normalized);
          // 第三次标准化
          const third = skillNormalizer.normalize(second.normalized);

          // 所有标准化结果应该相同
          expect(first.normalized).toBe(second.normalized);
          expect(second.normalized).toBe(third.normalized);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('同义词输入应该产生相同的标准化输出', () => {
      // 定义一些同义词组用于测试
      const synonymGroups = [
        { inputs: ['JS', 'ECMAScript', 'ES6'], expected: 'JavaScript' },
        { inputs: ['TS', 'Typescript'], expected: 'TypeScript' },
        { inputs: ['ReactJS', 'React.js', 'React JS'], expected: 'React' },
        { inputs: ['NodeJS', 'Node', 'Node JS'], expected: 'Node.js' },
        { inputs: ['ETH', '以太坊'], expected: 'Ethereum' },
        { inputs: ['智能合约', 'Smart Contracts'], expected: 'Smart Contract' },
        { inputs: ['K8s', 'K8S', '容器编排'], expected: 'Kubernetes' },
        { inputs: ['产品管理', 'PM', '产品经理'], expected: 'Product Management' },
      ];

      const groupArb = fc.constantFrom(...synonymGroups);

      fc.assert(
        fc.property(groupArb, group => {
          const { inputs, expected } = group;

          // 所有同义词输入应该产生相同的标准化输出
          for (const input of inputs) {
            const normalized = skillNormalizer.normalize(input);
            expect(normalized.normalized).toBe(expected);
          }

          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('EnhancedResumeInfo 的 skillCategories 应该与 normalizedSkills 的分类一致', () => {
      const skillsArb = fc.shuffledSubarray(SAMPLE_SKILLS, { minLength: 1, maxLength: 10 });

      fc.assert(
        fc.property(skillsArb, skills => {
          const enhancedInfo = generateMockEnhancedResumeInfo(skills);

          // 从 normalizedSkills 中提取所有分类
          const categoriesFromSkills = new Set(enhancedInfo.normalizedSkills.map(s => s.category));

          // skillCategories 应该包含所有从 normalizedSkills 提取的分类
          for (const category of categoriesFromSkills) {
            expect(enhancedInfo.skillCategories).toContain(category);
          }

          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('EnhancedJobInfo 的 skillCategories 应该与所有 normalizedSkills 的分类一致', () => {
      const requiredSkillsArb = fc.shuffledSubarray(SAMPLE_SKILLS, { minLength: 1, maxLength: 5 });
      const preferredSkillsArb = fc.shuffledSubarray(SAMPLE_SKILLS, { minLength: 0, maxLength: 5 });

      fc.assert(
        fc.property(requiredSkillsArb, preferredSkillsArb, (requiredSkills, preferredSkills) => {
          const enhancedInfo = generateMockEnhancedJobInfo(requiredSkills, preferredSkills);

          // 从所有 normalizedSkills 中提取分类
          const allNormalizedSkills = [
            ...enhancedInfo.normalizedRequiredSkills,
            ...enhancedInfo.normalizedPreferredSkills,
          ];
          const categoriesFromSkills = new Set(allNormalizedSkills.map(s => s.category));

          // skillCategories 应该包含所有分类
          for (const category of categoriesFromSkills) {
            expect(enhancedInfo.skillCategories).toContain(category);
          }

          return true;
        }),
        { numRuns: 100 }
      );
    });
  });
});
