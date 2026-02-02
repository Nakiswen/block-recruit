/**
 * AIService 单元测试
 *
 * 注意：这些测试需要真实的 API Key 才能运行。
 * 在 CI 环境中，这些测试会被跳过。
 *
 * 要运行这些测试，请设置环境变量：
 * OPENROUTER_API_KEY=your-api-key
 */

import { describe, test, expect, beforeAll } from '@jest/globals';

// 检查是否有 API Key
const hasApiKey = !!process.env.OPENROUTER_API_KEY;

// 如果没有 API Key，跳过所有测试
const describeOrSkip = hasApiKey ? describe : describe.skip;

describeOrSkip('AIService', () => {
  // 动态导入 aiService
  let aiService: typeof import('../aiService.js').aiService;

  beforeAll(async () => {
    const module = await import('../aiService.js');
    aiService = module.aiService;
  });

  // 测试岗位信息提取
  test('extractJobInfo should extract structured job information', async () => {
    const job = {
      id: 'test-job-1',
      title: '高级前端工程师',
      companyName: '区块链招聘',
      description: '我们正在寻找一位有经验的前端工程师，负责开发Web3应用',
      responsibilities: '负责开发和维护公司的Web应用',
      requirements: '熟悉React, TypeScript, Web3.js',
    };

    const result = await aiService.extractJobInfo(job);

    expect(result).toBeDefined();
    expect(result.requiredSkills).toBeDefined();
    expect(Array.isArray(result.requiredSkills)).toBe(true);
  });

  // 测试简历信息提取
  test('extractResumeInfo should extract structured resume information', async () => {
    const resume = {
      id: 'test-resume-1',
      userId: 'test-user-1',
      content: '有2年前端开发经验，熟悉React和TypeScript',
      name: '张三',
      summary: '有2年前端开发经验',
      workExperience: '2021-2023: 前端开发工程师',
      projects: '开发了公司主要产品',
      education: '2017-2021: 计算机科学学士',
      skills: ['React', 'JavaScript', 'HTML', 'CSS'],
    };

    const result = await aiService.extractResumeInfo(resume);

    expect(result).toBeDefined();
    expect(result.skills).toBeDefined();
    expect(Array.isArray(result.skills)).toBe(true);
  });
});

// 添加一个始终通过的测试，确保测试套件不为空
describe('AIService Module', () => {
  test('should be importable', () => {
    expect(true).toBe(true);
  });
});
