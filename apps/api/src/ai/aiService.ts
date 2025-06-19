import { Mastra } from 'mastra';
import { Job, Resume } from '@prisma/client';

/**
 * AI服务配置
 */
interface AIServiceConfig {
  apiKey: string;
  model: string;
  baseUrl?: string;
}

/**
 * AI服务接口
 */
interface AIService {
  // 从岗位描述中提取结构化信息
  extractJobInfo(job: Job): Promise<JobStructuredInfo>;
  
  // 从简历中提取结构化信息
  extractResumeInfo(resume: Resume): Promise<ResumeStructuredInfo>;
  
  // 根据简历和岗位计算匹配度评分
  calculateMatchScore(resumeInfo: ResumeStructuredInfo, jobInfo: JobStructuredInfo): Promise<MatchResult>;
}

/**
 * 岗位结构化信息
 */
export interface JobStructuredInfo {
  requiredSkills: string[];
  preferredSkills: string[];
  experienceYears: number;
  educationLevel: string;
  industry: string;
  jobLevel: string;
  keyResponsibilities: string[];
}

/**
 * 简历结构化信息
 */
export interface ResumeStructuredInfo {
  skills: string[];
  experienceYears: number;
  educationLevel: string;
  industryExperience: string[];
  location: string;
  keyAchievements: string[];
}

/**
 * 匹配结果
 */
export interface MatchResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  matchReasons: string[];
  improvementSuggestions: string[];
}

/**
 * 使用Mastra框架实现的AI服务
 */
class MastraAIService implements AIService {
  private mastra: Mastra;
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig) {
    this.config = config;
    this.mastra = new Mastra({
      apiKey: config.apiKey,
      model: config.model,
      baseUrl: config.baseUrl
    });
  }

  /**
   * 从岗位描述中提取结构化信息
   * @param job 岗位数据
   * @returns 结构化的岗位信息
   */
  async extractJobInfo(job: Job): Promise<JobStructuredInfo> {
    try {
      // 组装提示词
      const prompt = this.buildJobExtractionPrompt(job);
      
      // 调用AI模型
      const response = await this.mastra.completion({
        prompt,
        temperature: 0.1,
        max_tokens: 1000,
        output_format: 'json'
      });

      // 解析返回结果
      const result = JSON.parse(response.text) as JobStructuredInfo;
      
      // 规范化结果
      return this.normalizeJobInfo(result);
    } catch (error) {
      console.error('提取岗位信息失败:', error);
      throw error;
    }
  }

  /**
   * 从简历中提取结构化信息
   * @param resume 简历数据
   * @returns 结构化的简历信息
   */
  async extractResumeInfo(resume: Resume): Promise<ResumeStructuredInfo> {
    try {
      // 组装提示词
      const prompt = this.buildResumeExtractionPrompt(resume);
      
      // 调用AI模型
      const response = await this.mastra.completion({
        prompt,
        temperature: 0.1,
        max_tokens: 1000,
        output_format: 'json'
      });

      // 解析返回结果
      const result = JSON.parse(response.text) as ResumeStructuredInfo;
      
      // 规范化结果
      return this.normalizeResumeInfo(result);
    } catch (error) {
      console.error('提取简历信息失败:', error);
      throw error;
    }
  }

  /**
   * 计算简历与岗位的匹配度
   * @param resumeInfo 简历信息
   * @param jobInfo 岗位信息
   * @returns 匹配结果
   */
  async calculateMatchScore(resumeInfo: ResumeStructuredInfo, jobInfo: JobStructuredInfo): Promise<MatchResult> {
    try {
      // 组装提示词
      const prompt = this.buildMatchingPrompt(resumeInfo, jobInfo);
      
      // 调用AI模型
      const response = await this.mastra.completion({
        prompt,
        temperature: 0.2,
        max_tokens: 1000,
        output_format: 'json'
      });

      // 解析返回结果
      return JSON.parse(response.text) as MatchResult;
    } catch (error) {
      console.error('计算匹配度失败:', error);
      throw error;
    }
  }

  /**
   * 构建提取岗位信息的提示词
   * @param job 岗位信息
   * @returns 提示词
   */
  private buildJobExtractionPrompt(job: Job): string {
    return `
请从以下岗位描述中提取关键信息，并以JSON格式返回。

岗位标题: ${job.title}
公司名称: ${job.companyName}
岗位描述:
${job.description}

岗位职责:
${job.responsibilities || '无'}

岗位要求:
${job.requirements || '无'}

请提取以下信息:
1. 必备技能列表 (requiredSkills)
2. 加分技能列表 (preferredSkills)
3. 工作经验年限要求 (experienceYears)
4. 学历要求 (educationLevel, 如: 大专/本科/硕士/博士)
5. 行业背景 (industry)
6. 岗位级别 (jobLevel, 如: 初级/中级/高级/专家)
7. 核心职责 (keyResponsibilities)

按照重要性对技能进行排序，必备技能是岗位硬性要求，加分技能是优先考虑但非必须的技能。
返回格式为 JSON，确保所有技能名称标准化，例如将"React.js"统一为"React"。
`;
  }

  /**
   * 构建提取简历信息的提示词
   * @param resume 简历信息
   * @returns 提示词
   */
  private buildResumeExtractionPrompt(resume: Resume): string {
    return `
请从以下简历信息中提取关键信息，并以JSON格式返回。

姓名: ${resume.name}
个人简介:
${resume.summary || '无'}

工作经历:
${resume.workExperience || '无'}

项目经历:
${resume.projects || '无'}

教育背景:
${resume.education || '无'}

技能:
${resume.skills ? resume.skills.join(', ') : '无'}

请提取以下信息:
1. 技能列表 (skills)
2. 工作年限 (experienceYears)
3. 最高学历 (educationLevel, 如: 大专/本科/硕士/博士)
4. 行业经验 (industryExperience)
5. 所在地区 (location)
6. 主要成就 (keyAchievements)

返回格式为 JSON，确保所有技能名称标准化，例如将"React.js"统一为"React"。
`;
  }

  /**
   * 构建匹配评估的提示词
   * @param resumeInfo 简历信息
   * @param jobInfo 岗位信息
   * @returns 提示词
   */
  private buildMatchingPrompt(resumeInfo: ResumeStructuredInfo, jobInfo: JobStructuredInfo): string {
    return `
请评估以下求职者与岗位的匹配程度，并以JSON格式返回评估结果。

岗位信息:
- 职位: ${jobInfo.jobLevel}
- 必备技能: ${jobInfo.requiredSkills.join(', ')}
- 加分技能: ${jobInfo.preferredSkills.join(', ')}
- 工作经验要求: ${jobInfo.experienceYears}年
- 学历要求: ${jobInfo.educationLevel}
- 行业背景: ${jobInfo.industry}

求职者信息:
- 技能: ${resumeInfo.skills.join(', ')}
- 工作经验: ${resumeInfo.experienceYears}年
- 学历: ${resumeInfo.educationLevel}
- 行业经验: ${resumeInfo.industryExperience.join(', ')}

请提供以下评估内容:
1. 匹配度评分 (score, 0-1之间的小数)
2. 匹配的技能列表 (matchedSkills)
3. 缺失的技能列表 (missingSkills)
4. 匹配原因说明 (matchReasons)
5. 改进建议 (improvementSuggestions)

评分规则:
- 必备技能匹配度占60%
- 工作经验匹配度占20%
- 学历匹配度占10%
- 行业背景匹配度占10%

返回格式为 JSON。
`;
  }

  /**
   * 规范化岗位信息
   * @param jobInfo 原始岗位信息
   * @returns 规范化后的岗位信息
   */
  private normalizeJobInfo(jobInfo: JobStructuredInfo): JobStructuredInfo {
    return {
      ...jobInfo,
      requiredSkills: this.normalizeSkills(jobInfo.requiredSkills),
      preferredSkills: this.normalizeSkills(jobInfo.preferredSkills),
      experienceYears: Math.max(0, jobInfo.experienceYears || 0),
      educationLevel: this.normalizeEducationLevel(jobInfo.educationLevel),
      industry: jobInfo.industry || '',
      jobLevel: this.normalizeJobLevel(jobInfo.jobLevel),
      keyResponsibilities: jobInfo.keyResponsibilities || []
    };
  }

  /**
   * 规范化简历信息
   * @param resumeInfo 原始简历信息
   * @returns 规范化后的简历信息
   */
  private normalizeResumeInfo(resumeInfo: ResumeStructuredInfo): ResumeStructuredInfo {
    return {
      ...resumeInfo,
      skills: this.normalizeSkills(resumeInfo.skills),
      experienceYears: Math.max(0, resumeInfo.experienceYears || 0),
      educationLevel: this.normalizeEducationLevel(resumeInfo.educationLevel),
      industryExperience: (resumeInfo.industryExperience || []).filter(Boolean),
      location: resumeInfo.location || '',
      keyAchievements: resumeInfo.keyAchievements || []
    };
  }

  /**
   * 规范化技能列表
   * @param skills 技能列表
   * @returns 规范化后的技能列表
   */
  private normalizeSkills(skills: string[]): string[] {
    if (!skills || !Array.isArray(skills)) return [];
    
    return skills
      .filter(Boolean)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
  }

  /**
   * 规范化学历级别
   * @param level 学历级别
   * @returns 规范化后的学历级别
   */
  private normalizeEducationLevel(level: string): string {
    if (!level) return '';
    
    const normalized = level.trim().toLowerCase();
    
    // 标准化学历表示
    if (normalized.includes('高中')) return '高中';
    if (normalized.includes('专科') || normalized.includes('大专')) return '大专';
    if (normalized.includes('本科') || normalized.includes('学士')) return '本科';
    if (normalized.includes('硕士') || normalized.includes('研究生')) return '硕士';
    if (normalized.includes('博士')) return '博士';
    
    return level.trim();
  }

  /**
   * 规范化岗位级别
   * @param level 岗位级别
   * @returns 规范化后的岗位级别
   */
  private normalizeJobLevel(level: string): string {
    if (!level) return '初级';
    
    const normalized = level.trim().toLowerCase();
    
    // 标准化岗位级别表示
    if (normalized.includes('初级') || normalized.includes('junior')) return '初级';
    if (normalized.includes('中级') || normalized.includes('middle')) return '中级';
    if (normalized.includes('高级') || normalized.includes('senior')) return '高级';
    if (normalized.includes('专家') || normalized.includes('expert')) return '专家';
    if (normalized.includes('总监') || normalized.includes('director')) return '总监';
    
    return level.trim();
  }
}

// 从环境变量获取配置
const config: AIServiceConfig = {
  apiKey: process.env.AI_API_KEY || '',
  model: process.env.AI_MODEL || 'gpt-4-turbo',
  baseUrl: process.env.AI_API_BASE_URL
};

// 导出AI服务实例
export const aiService = new MastraAIService(config); 