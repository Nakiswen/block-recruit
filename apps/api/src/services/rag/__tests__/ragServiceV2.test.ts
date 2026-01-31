/**
 * RAG Service V2 集成测试
 * 测试增强的向量存储和检索功能
 */

import { describe, test, expect } from '@jest/globals';
import { skillNormalizer, SkillCategory } from '../skillNormalizer.js';
import { matchingService } from '../matchingService.js';
import type { UnifiedTags, UnifiedMetadata, MatchingConfig } from '../types.js';
import { JobType } from '../types.js';

describe('Skill Normalizer', () => {
  describe('normalize', () => {
    test('应该正确标准化技能名称', () => {
      const result = skillNormalizer.normalize('ReactJS');

      // 标准化后应该是 React（标准名称）
      expect(result.normalized).toBe('React');
      expect(result.category).toBe(SkillCategory.FRONTEND);
    });

    test('应该处理中文技能名称', () => {
      const result = skillNormalizer.normalize('产品经理');

      // 产品经理是 Product Management 的同义词
      expect(result.normalized).toBe('Product Management');
      expect(result.category).toBe(SkillCategory.PRODUCT);
    });

    test('应该处理未知技能', () => {
      const result = skillNormalizer.normalize('UnknownSkill123');

      // 未知技能保留原始名称（清理后）
      expect(result.normalized).toBe('UnknownSkill123');
      expect(result.category).toBe(SkillCategory.OTHER);
    });

    test('应该正确处理 TypeScript', () => {
      const result = skillNormalizer.normalize('TypeScript');

      expect(result.normalized).toBe('TypeScript');
      expect(result.category).toBe(SkillCategory.PROGRAMMING_LANGUAGE);
    });

    test('应该正确处理 Solidity', () => {
      const result = skillNormalizer.normalize('Solidity');

      expect(result.normalized).toBe('Solidity');
      // Solidity 在 SKILL_CATEGORIES 中被归类为编程语言
      expect(result.category).toBe(SkillCategory.PROGRAMMING_LANGUAGE);
    });

    test('应该正确处理 TS 同义词', () => {
      const result = skillNormalizer.normalize('TS');

      expect(result.normalized).toBe('TypeScript');
      expect(result.category).toBe(SkillCategory.PROGRAMMING_LANGUAGE);
    });
  });

  describe('areEquivalent', () => {
    test('应该识别同义词', () => {
      expect(skillNormalizer.areEquivalent('ReactJS', 'React.js')).toBe(true);
      expect(skillNormalizer.areEquivalent('JS', 'JavaScript')).toBe(true);
      expect(skillNormalizer.areEquivalent('TS', 'TypeScript')).toBe(true);
    });

    test('应该识别不同技能', () => {
      expect(skillNormalizer.areEquivalent('React', 'Vue')).toBe(false);
      expect(skillNormalizer.areEquivalent('Python', 'Java')).toBe(false);
    });
  });

  describe('normalizeMany', () => {
    test('应该批量标准化技能', () => {
      const skills = ['React', 'ReactJS', 'React.js', 'Vue', 'Vue.js'];
      const result = skillNormalizer.normalizeMany(skills);

      // 应该返回5个结果（每个输入一个）
      expect(result.length).toBe(5);

      // React 相关的都应该标准化为 React
      expect(result[0].normalized).toBe('React');
      expect(result[1].normalized).toBe('React');
      expect(result[2].normalized).toBe('React');

      // Vue 相关的都应该标准化为 Vue
      expect(result[3].normalized).toBe('Vue');
      expect(result[4].normalized).toBe('Vue');
    });

    test('应该正确处理空数组', () => {
      const result = skillNormalizer.normalizeMany([]);
      expect(result).toEqual([]);
    });
  });

  describe('getCategory', () => {
    test('应该返回正确的技能分类', () => {
      expect(skillNormalizer.getCategory('React')).toBe(SkillCategory.FRONTEND);
      expect(skillNormalizer.getCategory('Python')).toBe(SkillCategory.PROGRAMMING_LANGUAGE);
      expect(skillNormalizer.getCategory('Ethereum')).toBe(SkillCategory.BLOCKCHAIN);
      expect(skillNormalizer.getCategory('PostgreSQL')).toBe(SkillCategory.DATABASE);
    });
  });

  describe('getAliases', () => {
    test('应该返回技能的同义词列表', () => {
      const aliases = skillNormalizer.getAliases('React');

      // 同义词列表应该包含 ReactJS, React.js 等
      expect(aliases).toContain('ReactJS');
      expect(aliases).toContain('React.js');
    });
  });

  describe('inferJobType', () => {
    test('应该根据技能推断岗位类型', () => {
      expect(skillNormalizer.inferJobType(['React', 'TypeScript', 'Node.js'])).toBe('technical');
      expect(skillNormalizer.inferJobType(['Product Management', 'PRD', 'Agile'])).toBe('product');
      expect(skillNormalizer.inferJobType(['Community Operation', 'Discord Management'])).toBe(
        'operation'
      );
    });
  });
});

describe('Matching Service', () => {
  describe('buildHardFilters', () => {
    test('简历找岗位时应该构建正确的过滤条件', () => {
      const resumeTags: UnifiedTags = {
        normalizedSkills: ['react', 'typescript'],
        skillCategories: [SkillCategory.FRONTEND],
        experienceYears: 5,
        educationLevel: '本科',
        jobType: JobType.TECHNICAL,
        industry: ['互联网'],
        location: '上海',
      };

      const filters = matchingService.buildHardFilters(resumeTags, 'job');

      // 岗位要求的经验年限应该 <= 简历的经验年限
      expect(filters['experience_years']).toEqual({ $lte: 5 });
    });

    test('岗位找简历时应该构建正确的过滤条件', () => {
      const jobTags: UnifiedTags = {
        normalizedSkills: ['react', 'typescript'],
        skillCategories: [SkillCategory.FRONTEND],
        experienceYears: 3,
        educationLevel: '本科',
        jobType: JobType.TECHNICAL,
        industry: ['区块链'],
        location: '上海',
      };

      const filters = matchingService.buildHardFilters(jobTags, 'resume');

      // 简历的经验年限应该 >= 岗位要求
      expect(filters['experience_years']).toEqual({ $gte: 3 });
    });

    test('经验年限为0时不应该添加过滤条件', () => {
      const tags: UnifiedTags = {
        normalizedSkills: ['react'],
        skillCategories: [SkillCategory.FRONTEND],
        experienceYears: 0,
        educationLevel: '本科',
        jobType: JobType.TECHNICAL,
        industry: [],
        location: '',
      };

      const filters = matchingService.buildHardFilters(tags, 'job');

      expect(filters['experience_years']).toBeUndefined();
    });
  });

  describe('rerankByTags', () => {
    const config: MatchingConfig = {
      hardFilterEnabled: true,
      vectorRecallTopK: 50,
      finalTopK: 10,
      minVectorScore: 0.6,
      relaxFilterOnEmpty: true,
      weights: {
        skillMatch: 0.4,
        vectorSimilarity: 0.25,
        experienceMatch: 0.2,
        salaryMatch: 0.15,
      },
    };

    test('应该根据标签重新排序候选项', () => {
      const candidates = [
        {
          id: 'job_1',
          score: 0.9,
          metadata: {
            id: 'job_1',
            type: 'job' as const,
            normalized_skills: ['vue', 'javascript'],
            skill_categories: ['frontend'],
            experience_years: 3,
            education_level: '本科',
            job_type: 'technical',
            location: '上海',
            industry: ['互联网'],
            update_time: new Date().toISOString(),
          } as UnifiedMetadata,
        },
        {
          id: 'job_2',
          score: 0.8,
          metadata: {
            id: 'job_2',
            type: 'job' as const,
            normalized_skills: ['react', 'typescript'],
            skill_categories: ['frontend'],
            experience_years: 3,
            education_level: '本科',
            job_type: 'technical',
            location: '上海',
            industry: ['互联网'],
            update_time: new Date().toISOString(),
          } as UnifiedMetadata,
        },
      ];

      const resumeTags: UnifiedTags = {
        normalizedSkills: ['react', 'typescript'],
        skillCategories: [SkillCategory.FRONTEND],
        experienceYears: 3,
        educationLevel: '本科',
        jobType: JobType.TECHNICAL,
        industry: ['互联网'],
        location: '上海',
      };

      const result = matchingService.rerankByTags(candidates, resumeTags, [], config);

      // job_2 技能匹配度更高，应该排在前面
      expect(result[0].id).toBe('job_2');
    });

    test('应该计算正确的匹配分数', () => {
      const candidates = [
        {
          id: 'job_1',
          score: 0.85,
          metadata: {
            id: 'job_1',
            type: 'job' as const,
            normalized_skills: ['react', 'typescript', 'nodejs'],
            skill_categories: ['frontend', 'backend'],
            experience_years: 3,
            education_level: '本科',
            job_type: 'technical',
            location: '上海',
            industry: ['互联网'],
            update_time: new Date().toISOString(),
            required_skills: ['react', 'typescript'],
          } as UnifiedMetadata,
        },
      ];

      const resumeTags: UnifiedTags = {
        normalizedSkills: ['react', 'typescript', 'vue'],
        skillCategories: [SkillCategory.FRONTEND],
        experienceYears: 5,
        educationLevel: '本科',
        jobType: JobType.TECHNICAL,
        industry: ['互联网'],
        location: '上海',
      };

      const result = matchingService.rerankByTags(
        candidates,
        resumeTags,
        ['react', 'typescript'],
        config
      );

      expect(result.length).toBe(1);
      expect(result[0].skillMatchScore).toBe(1); // 2/2 必须技能都匹配
      expect(result[0].matchedSkills).toContain('react');
      expect(result[0].matchedSkills).toContain('typescript');
    });

    test('应该正确处理空候选列表', () => {
      const resumeTags: UnifiedTags = {
        normalizedSkills: ['react'],
        skillCategories: [SkillCategory.FRONTEND],
        experienceYears: 3,
        educationLevel: '本科',
        jobType: JobType.TECHNICAL,
        industry: [],
        location: '',
      };

      const result = matchingService.rerankByTags([], resumeTags, [], config);

      expect(result).toEqual([]);
    });
  });
});
