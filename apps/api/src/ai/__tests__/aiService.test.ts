import { jest } from '@jest/globals';
import { aiService } from '../aiService';
import { Job, Resume } from '@/rag/types';

// 模拟ChatOpenAI类
jest.mock('@langchain/openai', () => {
  return {
    ChatOpenAI: jest.fn().mockImplementation(() => {
      return {
        invoke: jest.fn().mockImplementation((prompt) => {
          // 根据不同的提示词返回不同的模拟响应
          if (prompt.includes('岗位描述')) {
            return {
              content: JSON.stringify({
                requiredSkills: ['React', 'TypeScript', 'Web3.js'],
                preferredSkills: ['Next.js', 'Solidity'],
                experienceYears: 3,
                educationLevel: '本科',
                industry: '区块链',
                jobLevel: '高级',
                keyResponsibilities: ['前端开发', '区块链集成']
              })
            };
          } else if (prompt.includes('简历信息')) {
            return {
              content: JSON.stringify({
                skills: ['React', 'JavaScript', 'HTML', 'CSS'],
                experienceYears: 2,
                educationLevel: '本科',
                industryExperience: ['互联网'],
                location: '上海',
                keyAchievements: ['开发了公司主要产品']
              })
            };
          } else if (prompt.includes('匹配程度')) {
            return {
              content: JSON.stringify({
                score: 0.75,
                matchedSkills: ['React'],
                missingSkills: ['TypeScript', 'Web3.js'],
                matchReasons: ['有React经验'],
                improvementSuggestions: ['学习TypeScript和Web3.js']
              })
            };
          }
          return { content: '{}' };
        })
      };
    })
  };
});

describe('AIService', () => {
  // 测试岗位信息提取
  test('extractJobInfo should extract structured job information', async () => {
    // 准备测试数据
    const job: Job = {
      title: '高级前端工程师',
      companyName: '区块链招聘',
      description: '我们正在寻找一位有经验的前端工程师...',
      responsibilities: '负责开发和维护公司的Web应用...',
      requirements: '熟悉React, TypeScript, Web3.js...'
    };

    // 执行测试
    const result = await aiService.extractJobInfo(job);

    // 验证结果
    expect(result).toBeDefined();
    expect(result.requiredSkills).toContain('React');
    expect(result.requiredSkills).toContain('TypeScript');
    expect(result.requiredSkills).toContain('Web3.js');
    expect(result.preferredSkills).toContain('Next.js');
    expect(result.experienceYears).toBe(3);
    expect(result.educationLevel).toBe('本科');
    expect(result.industry).toBe('区块链');
    expect(result.jobLevel).toBe('高级');
  });

  // 测试简历信息提取
  test('extractResumeInfo should extract structured resume information', async () => {
    // 准备测试数据
    const resume: Resume = {
      name: '张三',
      summary: '有2年前端开发经验...',
      workExperience: '2021-2023: 前端开发工程师...',
      projects: '开发了公司主要产品...',
      education: '2017-2021: 计算机科学学士...',
      skills: ['React', 'JavaScript', 'HTML', 'CSS']
    };

    // 执行测试
    const result = await aiService.extractResumeInfo(resume);

    // 验证结果
    expect(result).toBeDefined();
    expect(result.skills).toContain('React');
    expect(result.skills).toContain('JavaScript');
    expect(result.experienceYears).toBe(2);
    expect(result.educationLevel).toBe('本科');
    expect(result.industryExperience).toContain('互联网');
    expect(result.location).toBe('上海');
  });

  // 测试匹配度计算
  test('calculateMatchScore should calculate match score correctly', async () => {
    // 准备测试数据
    const resumeInfo = {
      skills: ['React', 'JavaScript', 'HTML', 'CSS'],
      experienceYears: 2,
      educationLevel: '本科',
      industryExperience: ['互联网'],
      location: '上海',
      keyAchievements: ['开发了公司主要产品']
    };

    const jobInfo = {
      requiredSkills: ['React', 'TypeScript', 'Web3.js'],
      preferredSkills: ['Next.js', 'Solidity'],
      experienceYears: 3,
      educationLevel: '本科',
      industry: '区块链',
      jobLevel: '高级',
      keyResponsibilities: ['前端开发', '区块链集成']
    };

    // 执行测试
    const result = await aiService.calculateMatchScore(resumeInfo, jobInfo);

    // 验证结果
    expect(result).toBeDefined();
    expect(result.score).toBe(0.75);
    expect(result.matchedSkills).toContain('React');
    expect(result.missingSkills).toContain('TypeScript');
    expect(result.missingSkills).toContain('Web3.js');
    expect(result.matchReasons).toContain('有React经验');
    expect(result.improvementSuggestions).toContain('学习TypeScript和Web3.js');
  });
}); 