/**
 * 技能匹配器单元测试
 */

import { SkillMatcher } from '../skillMatcher.js';

describe('SkillMatcher', () => {
  let matcher: SkillMatcher;

  beforeEach(() => {
    matcher = new SkillMatcher();
  });

  describe('exactMatch', () => {
    it('完全匹配时应返回满分', () => {
      const resumeSkills = ['React', 'TypeScript', 'Node.js'];
      const jobSkills = ['React', 'TypeScript', 'Node.js'];

      const result = matcher.exactMatch(resumeSkills, jobSkills);

      expect(result.matchScore).toBe(1);
      expect(result.matchedSkills).toEqual(['React', 'TypeScript', 'Node.js']);
      expect(result.missingSkills).toEqual([]);
      expect(result.matchRatio).toBe(1);
    });

    it('部分匹配时应返回正确的分数', () => {
      const resumeSkills = ['React', 'TypeScript'];
      const jobSkills = ['React', 'TypeScript', 'Node.js', 'PostgreSQL'];

      const result = matcher.exactMatch(resumeSkills, jobSkills);

      expect(result.matchScore).toBe(0.5); // 2/4
      expect(result.matchedSkills).toEqual(['React', 'TypeScript']);
      expect(result.missingSkills).toEqual(['Node.js', 'PostgreSQL']);
      expect(result.matchRatio).toBe(0.5);
    });

    it('无匹配时应返回 0 分', () => {
      const resumeSkills = ['Python', 'Django'];
      const jobSkills = ['React', 'TypeScript'];

      const result = matcher.exactMatch(resumeSkills, jobSkills);

      expect(result.matchScore).toBe(0);
      expect(result.matchedSkills).toEqual([]);
      expect(result.missingSkills).toEqual(['React', 'TypeScript']);
    });

    it('岗位无技能要求时应返回中等分数', () => {
      const resumeSkills = ['React', 'TypeScript'];
      const jobSkills: string[] = [];

      const result = matcher.exactMatch(resumeSkills, jobSkills);

      expect(result.matchScore).toBe(0.5);
      expect(result.matchedSkills).toEqual([]);
      expect(result.missingSkills).toEqual([]);
    });

    it('应正确处理技能标准化（大小写不敏感）', () => {
      const resumeSkills = ['react', 'TYPESCRIPT', 'Node.JS'];
      const jobSkills = ['React', 'TypeScript', 'Node.js'];

      const result = matcher.exactMatch(resumeSkills, jobSkills);

      expect(result.matchScore).toBe(1);
      expect(result.matchedSkills.length).toBe(3);
    });

    it('应正确处理技能同义词', () => {
      const resumeSkills = ['JS', 'TS']; // 同义词
      const jobSkills = ['JavaScript', 'TypeScript'];

      const result = matcher.exactMatch(resumeSkills, jobSkills);

      expect(result.matchScore).toBe(1);
    });
  });

  describe('semanticSupplement', () => {
    it('向量分数高且有语义匹配时应给予加分', () => {
      const resumeSkills = ['React', 'Vue']; // 前端技能
      const jobSkills = ['Angular', 'Next.js']; // 也是前端技能
      const vectorScore = 0.8;

      const result = matcher.semanticSupplement(resumeSkills, jobSkills, vectorScore);

      expect(result.semanticBonus).toBeGreaterThan(0);
      expect(result.semanticMatches.length).toBeGreaterThan(0);
    });

    it('向量分数低时不应给予加分', () => {
      const resumeSkills = ['React', 'Vue'];
      const jobSkills = ['Angular', 'Next.js'];
      const vectorScore = 0.5; // 低于阈值

      const result = matcher.semanticSupplement(resumeSkills, jobSkills, vectorScore);

      expect(result.semanticBonus).toBe(0);
    });

    it('无语义匹配时不应给予加分', () => {
      const resumeSkills = ['React', 'Vue']; // 前端
      const jobSkills = ['Product Management', 'User Research']; // 产品
      const vectorScore = 0.8;

      const result = matcher.semanticSupplement(resumeSkills, jobSkills, vectorScore);

      expect(result.semanticBonus).toBe(0);
      expect(result.semanticMatches.length).toBe(0);
    });

    it('语义加分应有上限', () => {
      const resumeSkills = [
        'React',
        'Vue',
        'Angular',
        'Next.js',
        'Nuxt.js',
        'Svelte',
        'TypeScript',
        'JavaScript',
      ];
      const jobSkills = [
        'Webpack',
        'Vite',
        'Redux',
        'Zustand',
        'TailwindCSS',
        'CSS',
        'HTML',
        'SCSS',
      ];
      const vectorScore = 0.9;

      const result = matcher.semanticSupplement(resumeSkills, jobSkills, vectorScore);

      // 最多 5 个匹配，每个 0.02，最多 0.1
      expect(result.semanticBonus).toBeLessThanOrEqual(0.1);
    });
  });

  describe('findSemanticMatches', () => {
    it('应找到同一语义组内的技能匹配', () => {
      const resumeSkills = ['React', 'Vue'];
      const jobSkills = ['Angular', 'Next.js'];

      const matches = matcher.findSemanticMatches(resumeSkills, jobSkills);

      expect(matches.length).toBeGreaterThan(0);
      // 检查匹配的技能对
      const hasReactAngular = matches.some(
        m =>
          (m.resumeSkill === 'React' && m.jobSkill === 'Angular') ||
          (m.resumeSkill === 'React' && m.jobSkill === 'Next.js')
      );
      expect(hasReactAngular).toBe(true);
    });

    it('不应返回已精确匹配的技能', () => {
      const resumeSkills = ['React', 'TypeScript'];
      const jobSkills = ['React', 'Angular']; // React 已精确匹配

      const matches = matcher.findSemanticMatches(resumeSkills, jobSkills);

      // 不应包含 React 的语义匹配
      const hasReactMatch = matches.some(m => m.jobSkill === 'React');
      expect(hasReactMatch).toBe(false);
    });

    it('不同领域的技能不应匹配', () => {
      const resumeSkills = ['React', 'Vue']; // 前端
      const jobSkills = ['Product Management', 'User Research']; // 产品

      const matches = matcher.findSemanticMatches(resumeSkills, jobSkills);

      expect(matches.length).toBe(0);
    });

    it('匹配结果应按相似度降序排列', () => {
      const resumeSkills = ['React', 'Vue', 'TypeScript'];
      const jobSkills = ['Angular', 'Next.js', 'Svelte'];

      const matches = matcher.findSemanticMatches(resumeSkills, jobSkills);

      if (matches.length > 1) {
        for (let i = 1; i < matches.length; i++) {
          expect(matches[i - 1].similarity).toBeGreaterThanOrEqual(matches[i].similarity);
        }
      }
    });
  });

  describe('getSemanticGroups', () => {
    it('应返回技能所属的语义组', () => {
      const groups = matcher.getSemanticGroups('React');

      expect(groups.length).toBeGreaterThan(0);
      expect(groups).toContain('前端开发');
    });

    it('未知技能应返回空数组', () => {
      const groups = matcher.getSemanticGroups('UnknownSkill123');

      expect(groups).toEqual([]);
    });
  });

  describe('areSemanticallySimilar', () => {
    it('同一语义组的技能应返回 true', () => {
      expect(matcher.areSemanticallySimilar('React', 'Vue')).toBe(true);
      expect(matcher.areSemanticallySimilar('Node.js', 'Express')).toBe(true);
    });

    it('不同语义组的技能应返回 false', () => {
      expect(matcher.areSemanticallySimilar('React', 'Product Management')).toBe(false);
    });

    it('未知技能应返回 false', () => {
      expect(matcher.areSemanticallySimilar('UnknownSkill1', 'UnknownSkill2')).toBe(false);
    });
  });
});
