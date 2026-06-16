/**
 * AI 服务增强版
 * 提供增强的简历和岗位信息提取方法，支持技能标准化
 */

import { ChatOpenAI } from '@langchain/openai';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';
import { Job, Resume, JobType, UnifiedTags } from '@/services/rag/types.js';
import { skillNormalizer, NormalizedSkill, SkillCategory } from '@/services/rag/skillNormalizer.js';
import { ResumeStructuredInfo, JobStructuredInfo } from './aiService.js';

/**
 * 增强的简历结构化信息
 */
export interface EnhancedResumeInfo extends ResumeStructuredInfo {
  normalizedSkills: NormalizedSkill[];
  skillCategories: SkillCategory[];
  targetJobType: JobType;
  unifiedTags: UnifiedTags;
}

/**
 * 增强的岗位结构化信息
 */
export interface EnhancedJobInfo extends JobStructuredInfo {
  normalizedRequiredSkills: NormalizedSkill[];
  normalizedPreferredSkills: NormalizedSkill[];
  skillCategories: SkillCategory[];
  jobType: JobType;
  unifiedTags: UnifiedTags;
}

/**
 * AI 服务配置
 */
interface AIServiceConfig {
  apiKey: string;
  model: string;
  baseUrl?: string;
}

/**
 * 增强版 AI 服务
 */
export class AIServiceEnhanced {
  private model: ChatOpenAI;

  constructor(config: AIServiceConfig) {
    if (!config.apiKey) {
      throw new Error('AI Service API key is not configured.');
    }

    this.model = new ChatOpenAI({
      modelName: config.model,
      temperature: 0.1,
      openAIApiKey: config.apiKey,
      maxTokens: 4000,
      configuration: {
        baseURL: config.baseUrl || 'https://openrouter.ai/api/v1',
        defaultHeaders: {
          'HTTP-Referer': 'https://blockrecruitmentapp.com',
          'X-Title': 'BlockRecruit',
        },
      },
    });
  }

  /**
   * 增强版简历信息提取
   */
  async extractResumeInfoEnhanced(resume: Resume): Promise<EnhancedResumeInfo> {
    console.log('🔍 开始增强版简历信息提取:', resume.id);

    try {
      const parser = StructuredOutputParser.fromZodSchema(
        z.object({
          skills: z.array(z.string()),
          experienceYears: z.number().nullable().default(0),
          educationLevel: z.string().nullable().default(''),
          industryExperience: z.array(z.string()),
          location: z.string(),
          keyAchievements: z.array(z.string()),
          targetJobType: z.string(),
          salaryFlexible: z.boolean(),
        })
      );

      const promptTemplate = `
请从以下简历信息中提取关键信息，特别注意技能的全面提取。

原始简历内容:
${resume.content}

姓名: {name}
个人简介: {summary}
工作经历: {workExperience}
项目经历: {projects}
教育背景: {education}
已标记技能: {existingSkills}

请提取以下信息:

1. 技能列表 (skills) - 请全面提取，包括：
   - 编程语言：JavaScript, TypeScript, Python, Rust, Go, Solidity, Java, C++, Move, Cairo 等
   - 区块链技术：Ethereum, Smart Contract, DeFi, NFT, DAO, Web3, Solana, Polygon, Hardhat, Foundry 等
   - 前端技术：React, Vue, Angular, Next.js, TailwindCSS, Ethers.js, Web3.js, Wagmi 等
   - 后端技术：Node.js, Express, Koa, NestJS, Django, FastAPI, GraphQL, REST API 等
   - 数据库：PostgreSQL, MongoDB, Redis, MySQL, Elasticsearch 等
   - 云服务：AWS, Azure, GCP, Vercel, Cloudflare 等
   - DevOps：Docker, Kubernetes, CI/CD, GitHub Actions, Terraform 等
   - 产品技能：Product Management, User Research, PRD, Agile, Scrum, JIRA, A/B Testing 等
   - 运营技能：Community Operation, Growth Hacking, Content Operation, Discord Management, Twitter Operation 等
   - 市场技能：Marketing, Brand Marketing, Digital Marketing, SEO, SEM, Social Media Marketing 等
   - 设计技能：UI Design, UX Design, Figma, Sketch, Adobe XD, Motion Design 等
   - 研究技能：Market Research, Data Science, Machine Learning, Blockchain Research, Security Audit 等
   - 商务技能：Business Development, Sales, Account Management, Investor Relations, Fundraising 等

2. 工作年限 (experienceYears) - 从工作经历计算总年限

3. 最高学历 (educationLevel) - 高中/大专/本科/硕士/博士

4. 行业经验 (industryExperience) - 如 Web3, 金融科技, 互联网, 游戏 等

5. 所在地区 (location)

6. 主要成就 (keyAchievements) - 量化的成就，如"用户增长100%"

7. 目标岗位类型 (targetJobType) - 从以下选择：
   - technical: 技术开发类
   - product: 产品类
   - operation: 运营类
   - marketing: 市场类
   - design: 设计类
   - research: 研究类
   - business: 商务类
   - other: 其他

8. 薪资要求灵活性 (salaryFlexible)

{format_instructions}
`;

      const prompt = PromptTemplate.fromTemplate(promptTemplate);
      const formattedPrompt = await prompt.format({
        name: resume.name || '未知',
        summary: resume.summary || '无个人简介',
        workExperience: resume.workExperience || '无工作经历',
        projects: resume.projects || '无项目经历',
        education: resume.education || '无教育背景',
        existingSkills: resume.skills ? resume.skills.join(', ') : '无已标记技能',
        format_instructions: parser.getFormatInstructions(),
      });

      const response = await this.model.invoke(formattedPrompt);
      const content =
        typeof response.content === 'string' ? response.content : JSON.stringify(response.content);
      const cleanedContent = this.cleanMarkdownCodeBlock(content);
      const result = await parser.parse(cleanedContent);

      // 标准化技能
      const normalizedSkills = skillNormalizer.normalizeMany(result.skills);

      // 提取技能分类
      const skillCategories = [
        ...new Set(normalizedSkills.map(s => s.category)),
      ] as SkillCategory[];

      // 推断岗位类型
      const targetJobType = this.mapJobType(
        result.targetJobType || skillNormalizer.inferJobType(result.skills)
      );

      // 构建统一标签
      const unifiedTags: UnifiedTags = {
        normalizedSkills: normalizedSkills.map(s => s.normalized),
        skillCategories,
        experienceYears: result.experienceYears || 0,
        educationLevel: result.educationLevel || '',
        jobType: targetJobType,
        location: result.location || '',
        industry: result.industryExperience || [],
      };

      return {
        skills: result.skills,
        experienceYears: result.experienceYears,
        educationLevel: result.educationLevel,
        industryExperience: result.industryExperience,
        location: result.location,
        keyAchievements: result.keyAchievements,
        salaryFlexible: result.salaryFlexible,
        normalizedSkills,
        skillCategories,
        targetJobType,
        unifiedTags,
      };
    } catch (error) {
      console.error('❌ 增强版简历信息提取失败:', error);
      throw error;
    }
  }

  /**
   * 增强版岗位信息提取
   */
  async extractJobInfoEnhanced(job: Job): Promise<EnhancedJobInfo> {
    console.log('🔍 开始增强版岗位信息提取:', job.id);

    try {
      const parser = StructuredOutputParser.fromZodSchema(
        z.object({
          requiredSkills: z.array(z.string()),
          preferredSkills: z.array(z.string()),
          parsedRequiredSkills: z.array(z.string()),
          parsedPreferredSkills: z.array(z.string()),
          experienceYears: z.number().nullable().default(0),
          educationLevel: z.string().nullable().default(''),
          industry: z.string(),
          jobLevel: z.string(),
          keyResponsibilities: z.array(z.string()),
          jobType: z.string(),
          salaryNegotiable: z.boolean(),
          benefits: z.array(z.string()),
        })
      );

      const promptTemplate = `
请从以下岗位描述中提取关键信息，特别注意技能的全面提取。

岗位标题: {title}
公司名称: {companyName}
岗位描述: {description}
岗位职责: {responsibilities}
岗位要求: {requirements}
薪资福利: {salaryBenefits}

请提取以下信息:

1. 必备技能原始描述 (requiredSkills) - 保留原始句子

2. 加分技能原始描述 (preferredSkills) - 保留原始句子

3. 解析后的必备技能 (parsedRequiredSkills) - 提取具体技能词，包括：
   - 编程语言：JavaScript, TypeScript, Python, Rust, Go, Solidity, Java, C++, Move, Cairo 等
   - 区块链技术：Ethereum, Smart Contract, DeFi, NFT, DAO, Web3, Solana, Polygon, Hardhat, Foundry 等
   - 前端技术：React, Vue, Angular, Next.js, TailwindCSS, Ethers.js, Web3.js, Wagmi 等
   - 后端技术：Node.js, Express, Koa, NestJS, Django, FastAPI, GraphQL, REST API 等
   - 数据库：PostgreSQL, MongoDB, Redis, MySQL, Elasticsearch 等
   - 云服务：AWS, Azure, GCP, Vercel, Cloudflare 等
   - DevOps：Docker, Kubernetes, CI/CD, GitHub Actions, Terraform 等
   - 产品技能：Product Management, User Research, PRD, Agile, Scrum, JIRA, A/B Testing 等
   - 运营技能：Community Operation, Growth Hacking, Content Operation, Discord Management, Twitter Operation 等
   - 市场技能：Marketing, Brand Marketing, Digital Marketing, SEO, SEM, Social Media Marketing 等
   - 设计技能：UI Design, UX Design, Figma, Sketch, Adobe XD, Motion Design 等
   - 研究技能：Market Research, Data Science, Machine Learning, Blockchain Research, Security Audit 等
   - 商务技能：Business Development, Sales, Account Management, Investor Relations, Fundraising 等

4. 解析后的加分技能 (parsedPreferredSkills) - 同上格式

5. 工作经验年限要求 (experienceYears)

6. 学历要求 (educationLevel)

7. 行业背景 (industry)

8. 岗位级别 (jobLevel) - 初级/中级/高级/专家/总监

9. 核心职责 (keyResponsibilities)

10. 岗位类型 (jobType) - 从以下选择：
    - technical: 技术开发类
    - product: 产品类
    - operation: 运营类
    - marketing: 市场类
    - design: 设计类
    - research: 研究类
    - business: 商务类
    - other: 其他

11. 薪资是否可协商 (salaryNegotiable)

12. 福利待遇 (benefits)

{format_instructions}
`;

      const prompt = PromptTemplate.fromTemplate(promptTemplate);
      const formattedPrompt = await prompt.format({
        title: job.title,
        companyName: job.companyName || '',
        description: job.description,
        responsibilities: job.responsibilities || '-',
        requirements: job.requirements || '-',
        salaryBenefits: job.salaryBenefits || job.salaryRange || '-',
        format_instructions: parser.getFormatInstructions(),
      });

      const response = await this.model.invoke(formattedPrompt);
      const content =
        typeof response.content === 'string' ? response.content : JSON.stringify(response.content);
      const cleanedContent = this.cleanMarkdownCodeBlock(content);
      const result = await parser.parse(cleanedContent);

      // 标准化技能
      const normalizedRequiredSkills = skillNormalizer.normalizeMany(
        result.parsedRequiredSkills || []
      );
      const normalizedPreferredSkills = skillNormalizer.normalizeMany(
        result.parsedPreferredSkills || []
      );

      // 合并所有技能的分类
      const allNormalizedSkills = [...normalizedRequiredSkills, ...normalizedPreferredSkills];
      const skillCategories = [
        ...new Set(allNormalizedSkills.map(s => s.category)),
      ] as SkillCategory[];

      // 推断岗位类型
      const allSkills = [
        ...(result.parsedRequiredSkills || []),
        ...(result.parsedPreferredSkills || []),
      ];
      const jobType = this.mapJobType(result.jobType || skillNormalizer.inferJobType(allSkills));

      // 构建统一标签
      const unifiedTags: UnifiedTags = {
        normalizedSkills: allNormalizedSkills.map(s => s.normalized),
        skillCategories,
        experienceYears: result.experienceYears || 0,
        educationLevel: result.educationLevel || '',
        jobType,
        location: job.location || '',
        industry: result.industry ? [result.industry] : [],
      };

      return {
        requiredSkills: result.requiredSkills || [],
        preferredSkills: result.preferredSkills || [],
        parsedRequiredSkills: result.parsedRequiredSkills || [],
        parsedPreferredSkills: result.parsedPreferredSkills || [],
        experienceYears: result.experienceYears,
        educationLevel: result.educationLevel,
        industry: result.industry,
        jobLevel: result.jobLevel,
        keyResponsibilities: result.keyResponsibilities || [],
        salaryNegotiable: result.salaryNegotiable,
        benefits: result.benefits || [],
        normalizedRequiredSkills,
        normalizedPreferredSkills,
        skillCategories,
        jobType,
        unifiedTags,
      };
    } catch (error) {
      console.error('❌ 增强版岗位信息提取失败:', error);
      throw error;
    }
  }

  /**
   * 映射岗位类型字符串到枚举
   */
  private mapJobType(typeStr: string): JobType {
    const typeMap: Record<string, JobType> = {
      technical: JobType.TECHNICAL,
      product: JobType.PRODUCT,
      operation: JobType.OPERATION,
      marketing: JobType.MARKETING,
      design: JobType.DESIGN,
      research: JobType.RESEARCH,
      business: JobType.BUSINESS,
      other: JobType.OTHER,
    };

    return typeMap[typeStr.toLowerCase()] || JobType.OTHER;
  }

  /**
   * 清理 markdown 代码块标记
   */
  private cleanMarkdownCodeBlock(content: string): string {
    let cleaned = content.trim();

    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.substring(7);
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.substring(3);
    }

    if (cleaned.endsWith('```')) {
      cleaned = cleaned.substring(0, cleaned.length - 3);
    }

    cleaned = cleaned.trim();

    // 尝试修复不完整的 JSON
    cleaned = this.tryFixIncompleteJson(cleaned);

    return cleaned;
  }

  /**
   * 尝试修复不完整的 JSON 字符串
   */
  private tryFixIncompleteJson(json: string): string {
    try {
      JSON.parse(json);
      return json;
    } catch {
      // 需要修复
    }

    let fixed = json;
    let openBraces = 0;
    let openBrackets = 0;
    let inString = false;
    let escapeNext = false;

    for (let i = 0; i < fixed.length; i++) {
      const char = fixed[i];
      if (escapeNext) {
        escapeNext = false;
        continue;
      }
      if (char === '\\') {
        escapeNext = true;
        continue;
      }
      if (char === '"') {
        inString = !inString;
        continue;
      }
      if (!inString) {
        if (char === '{') openBraces++;
        else if (char === '}') openBraces--;
        else if (char === '[') openBrackets++;
        else if (char === ']') openBrackets--;
      }
    }

    if (inString) fixed += '"';
    for (let i = 0; i < openBrackets; i++) fixed += ']';
    for (let i = 0; i < openBraces; i++) fixed += '}';

    try {
      JSON.parse(fixed);
      console.log('✅ JSON 修复成功');
      return fixed;
    } catch {
      console.error('❌ JSON 修复失败');
      return json;
    }
  }
}

// 从环境变量获取配置
const config: AIServiceConfig = {
  apiKey: process.env.OPENROUTER_API_KEY || '',
  model: process.env.AI_MODEL || 'anthropic/claude-sonnet-4.5',
  baseUrl: process.env.AI_API_BASE_URL || 'https://openrouter.ai/api/v1',
};

let aiServiceEnhancedInstance: AIServiceEnhanced | null = null;

function getAIServiceEnhanced(): AIServiceEnhanced {
  if (!aiServiceEnhancedInstance) {
    aiServiceEnhancedInstance = new AIServiceEnhanced(config);
  }
  return aiServiceEnhancedInstance;
}

// 导出懒加载代理，避免缺少 AI key 时影响非 AI 接口和健康检查。
export const aiServiceEnhanced: AIServiceEnhanced = new Proxy({} as AIServiceEnhanced, {
  get(_target, prop, receiver) {
    const service = getAIServiceEnhanced();
    const value = Reflect.get(service, prop, receiver);
    return typeof value === 'function' ? value.bind(service) : value;
  },
});
