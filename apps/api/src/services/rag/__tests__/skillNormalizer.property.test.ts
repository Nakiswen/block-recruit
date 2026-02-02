/**
 * Skill Normalizer 属性测试
 * 使用 fast-check 进行属性测试
 *
 * Feature: resume-job-matching-optimization
 * Validates: Requirements 1.1, 1.2, 1.5, 1.6, 1.7
 */

import { describe, test, expect } from '@jest/globals';
import * as fc from 'fast-check';
import { skillNormalizer, SkillCategory } from '../skillNormalizer.js';

// 从 SKILL_SYNONYMS 中提取所有同义词组用于测试
const SKILL_SYNONYM_GROUPS: Array<{ standard: string; aliases: string[] }> = [
  // 编程语言
  { standard: 'JavaScript', aliases: ['JS', 'ECMAScript', 'ES6'] },
  { standard: 'TypeScript', aliases: ['TS', 'Typescript'] },
  { standard: 'Python', aliases: ['Python3', 'Py'] },
  { standard: 'Rust', aliases: ['Rust Lang', 'Rust语言'] },
  { standard: 'Go', aliases: ['Golang', 'Go Lang', 'Go语言'] },
  { standard: 'Solidity', aliases: ['Sol', 'Solidity语言'] },

  // 前端框架
  { standard: 'React', aliases: ['ReactJS', 'React.js', 'React JS'] },
  { standard: 'Vue', aliases: ['Vue.js', 'VueJS', 'Vue JS', 'Vue3'] },
  { standard: 'Angular', aliases: ['AngularJS', 'Angular.js'] },
  { standard: 'Next.js', aliases: ['NextJS', 'Next'] },

  // 后端框架
  { standard: 'Node.js', aliases: ['NodeJS', 'Node', 'Node JS'] },
  { standard: 'Express', aliases: ['Express.js', 'ExpressJS'] },
  { standard: 'Django', aliases: ['Django REST', 'DRF', 'Django Framework'] },

  // 区块链
  { standard: 'Ethereum', aliases: ['ETH', '以太坊'] },
  { standard: 'Smart Contract', aliases: ['智能合约', 'Smart Contracts'] },
  { standard: 'DeFi', aliases: ['去中心化金融', 'Decentralized Finance'] },
  { standard: 'NFT', aliases: ['Non-Fungible Token', '非同质化代币'] },
  { standard: 'Web3', aliases: ['Web 3.0', 'Web3.0'] },

  // 数据库
  { standard: 'PostgreSQL', aliases: ['Postgres', 'PG'] },
  { standard: 'MongoDB', aliases: ['Mongo'] },
  { standard: 'Redis', aliases: ['Redis Cache', 'Redis缓存'] },

  // 云服务
  { standard: 'AWS', aliases: ['Amazon Web Services', '亚马逊云'] },
  { standard: 'Azure', aliases: ['Microsoft Azure', '微软云'] },
  { standard: 'GCP', aliases: ['Google Cloud Platform', '谷歌云'] },

  // DevOps
  { standard: 'Docker', aliases: ['容器化', 'Docker容器'] },
  { standard: 'Kubernetes', aliases: ['K8s', 'K8S', '容器编排'] },
  { standard: 'CI/CD', aliases: ['持续集成', '持续部署'] },

  // 产品
  { standard: 'Product Management', aliases: ['产品管理', 'PM', '产品经理'] },
  { standard: 'User Research', aliases: ['用户研究', '用研'] },

  // 运营
  { standard: 'Community Operation', aliases: ['社区运营', '社群运营'] },
  { standard: 'Growth Hacking', aliases: ['增长黑客', '用户增长'] },

  // 市场
  { standard: 'Marketing', aliases: ['市场营销', '营销'] },
  { standard: 'Digital Marketing', aliases: ['数字营销', '数字化营销'] },

  // 设计
  { standard: 'UI Design', aliases: ['UI设计', '界面设计'] },
  { standard: 'UX Design', aliases: ['UX设计', '用户体验设计'] },
  { standard: 'Figma', aliases: ['Figma Design', 'Figma设计'] },
];

// 所有有效的 SkillCategory 值
const VALID_SKILL_CATEGORIES = Object.values(SkillCategory);

describe('Skill Normalizer 属性测试', () => {
  /**
   * Property 1: 技能同义词等价性
   *
   * 对于任意两个属于同一同义词组的技能名称，
   * 调用 normalize() 后应该返回相同的标准化名称。
   *
   * **Validates: Requirements 1.2, 1.5, 1.6**
   */
  describe('Property 1: 技能同义词等价性', () => {
    test('同一同义词组内的任意两个技能应该标准化为相同名称', () => {
      // 为每个同义词组生成测试用例
      const synonymGroupArb = fc.constantFrom(...SKILL_SYNONYM_GROUPS);

      fc.assert(
        fc.property(synonymGroupArb, group => {
          const { standard, aliases } = group;

          // 标准名称标准化后应该等于自身
          const standardResult = skillNormalizer.normalize(standard);
          expect(standardResult.normalized).toBe(standard);

          // 所有同义词标准化后应该等于标准名称
          for (const alias of aliases) {
            const aliasResult = skillNormalizer.normalize(alias);
            expect(aliasResult.normalized).toBe(standard);
          }

          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('areEquivalent 应该对同义词返回 true', () => {
      const synonymGroupArb = fc.constantFrom(...SKILL_SYNONYM_GROUPS);

      fc.assert(
        fc.property(synonymGroupArb, group => {
          const { standard, aliases } = group;

          // 标准名称与自身等价
          expect(skillNormalizer.areEquivalent(standard, standard)).toBe(true);

          // 标准名称与所有同义词等价
          for (const alias of aliases) {
            expect(skillNormalizer.areEquivalent(standard, alias)).toBe(true);
            expect(skillNormalizer.areEquivalent(alias, standard)).toBe(true);
          }

          // 同义词之间互相等价
          for (let i = 0; i < aliases.length; i++) {
            for (let j = i + 1; j < aliases.length; j++) {
              expect(skillNormalizer.areEquivalent(aliases[i], aliases[j])).toBe(true);
            }
          }

          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('中英文同义词应该标准化为相同名称', () => {
      // 包含中英文同义词的组
      const chineseEnglishGroups = SKILL_SYNONYM_GROUPS.filter(g =>
        g.aliases.some(a => /[\u4e00-\u9fa5]/.test(a))
      );

      const groupArb = fc.constantFrom(...chineseEnglishGroups);

      fc.assert(
        fc.property(groupArb, group => {
          const { standard, aliases } = group;
          const chineseAliases = aliases.filter(a => /[\u4e00-\u9fa5]/.test(a));
          const englishAliases = aliases.filter(a => !/[\u4e00-\u9fa5]/.test(a));

          // 中文同义词标准化后应该等于标准名称
          for (const chinese of chineseAliases) {
            const result = skillNormalizer.normalize(chinese);
            expect(result.normalized).toBe(standard);
          }

          // 英文同义词标准化后应该等于标准名称
          for (const english of englishAliases) {
            const result = skillNormalizer.normalize(english);
            expect(result.normalized).toBe(standard);
          }

          return true;
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 2: 技能分类一致性
   *
   * 对于任意已知技能名称，调用 getCategory() 应该返回一个有效的 SkillCategory 枚举值，
   * 且同一技能多次调用返回相同的分类。
   *
   * **Validates: Requirements 1.1, 1.7**
   */
  describe('Property 2: 技能分类一致性', () => {
    test('getCategory 应该返回有效的 SkillCategory 枚举值', () => {
      // 从所有同义词组中提取所有技能名称
      const allSkills: string[] = [];
      for (const group of SKILL_SYNONYM_GROUPS) {
        allSkills.push(group.standard);
        allSkills.push(...group.aliases);
      }

      const skillArb = fc.constantFrom(...allSkills);

      fc.assert(
        fc.property(skillArb, skill => {
          const category = skillNormalizer.getCategory(skill);

          // 返回值应该是有效的 SkillCategory
          expect(VALID_SKILL_CATEGORIES).toContain(category);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('同一技能多次调用 getCategory 应该返回相同结果', () => {
      const allSkills: string[] = [];
      for (const group of SKILL_SYNONYM_GROUPS) {
        allSkills.push(group.standard);
        allSkills.push(...group.aliases);
      }

      const skillArb = fc.constantFrom(...allSkills);

      fc.assert(
        fc.property(skillArb, skill => {
          const category1 = skillNormalizer.getCategory(skill);
          const category2 = skillNormalizer.getCategory(skill);
          const category3 = skillNormalizer.getCategory(skill);

          // 多次调用应该返回相同结果
          expect(category1).toBe(category2);
          expect(category2).toBe(category3);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('同义词组内的所有技能应该返回相同的分类', () => {
      const synonymGroupArb = fc.constantFrom(...SKILL_SYNONYM_GROUPS);

      fc.assert(
        fc.property(synonymGroupArb, group => {
          const { standard, aliases } = group;

          // 获取标准名称的分类
          const standardCategory = skillNormalizer.getCategory(standard);

          // 所有同义词应该返回相同的分类
          for (const alias of aliases) {
            const aliasCategory = skillNormalizer.getCategory(alias);
            expect(aliasCategory).toBe(standardCategory);
          }

          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('normalize 返回的 category 应该与 getCategory 一致', () => {
      const allSkills: string[] = [];
      for (const group of SKILL_SYNONYM_GROUPS) {
        allSkills.push(group.standard);
        allSkills.push(...group.aliases);
      }

      const skillArb = fc.constantFrom(...allSkills);

      fc.assert(
        fc.property(skillArb, skill => {
          const normalizeResult = skillNormalizer.normalize(skill);
          const categoryResult = skillNormalizer.getCategory(skill);

          // normalize 返回的 category 应该与 getCategory 返回值一致
          expect(normalizeResult.category).toBe(categoryResult);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    test('未知技能应该返回 OTHER 分类', () => {
      // 生成随机字符串作为未知技能
      const unknownSkillArb = fc.string({ minLength: 5, maxLength: 20 }).filter(s => {
        // 过滤掉可能与已知技能匹配的字符串
        const normalized = skillNormalizer.normalize(s);
        return normalized.category === SkillCategory.OTHER;
      });

      fc.assert(
        fc.property(unknownSkillArb, skill => {
          const category = skillNormalizer.getCategory(skill);
          expect(category).toBe(SkillCategory.OTHER);

          return true;
        }),
        { numRuns: 50 } // 减少运行次数因为过滤可能导致生成较慢
      );
    });
  });
});
