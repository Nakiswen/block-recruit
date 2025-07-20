import { ChatOpenAI } from '@langchain/openai';
import { Job, Resume } from '@/services/rag/types';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

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
  calculateMatchScore(
    resumeInfo: ResumeStructuredInfo,
    jobInfo: JobStructuredInfo
  ): Promise<MatchResult>;

  /**
   * 对简历和岗位进行增强匹配分析
   * @param resume 简历数据
   * @param job 岗位数据
   * @returns 完整的匹配分析结果
   */
  enhanceMatching(resume: Resume, job: Job): Promise<MatchResult>;

  /**
   * 对已经提取结构化数据的简历和岗位进行增强匹配分析
   * @param resumeInfo 已提取的简历结构化数据
   * @param jobInfo 已提取的岗位结构化数据
   * @returns 完整的匹配分析结果 
   */
  enhanceMatchingWithExtractedInfo(resumeInfo: ResumeStructuredInfo, jobInfo: JobStructuredInfo): Promise<MatchResult>;
}
/**
 * 薪资范围接口
 */
export interface SalaryRange {
  min: number;
  max: number;
  currency: string; // 'CNY', 'USD', 'EUR' 等
  period: 'monthly' | 'annually'; // 月薪或年薪
}

/**
 * 岗位结构化信息 - 增加薪资相关字段
 */
export interface JobStructuredInfo {
  requiredSkills: string[];
  preferredSkills: string[];
  parsedRequiredSkills: string[];
  parsedPreferredSkills: string[];
  experienceYears: number;
  educationLevel: string;
  industry: string;
  jobLevel: string;
  keyResponsibilities: string[];
  // 新增薪资相关字段
  salaryRange?: SalaryRange;
  salaryNegotiable: boolean; // 薪资是否可协商
  benefits: string[]; // 福利待遇
}

/**
 * 简历结构化信息 - 增加薪资期望
 */
export interface ResumeStructuredInfo {
  skills: string[];
  experienceYears: number;
  educationLevel: string;
  industryExperience: string[];
  location: string;
  keyAchievements: string[];
  // 新增薪资期望
  expectedSalaryRange?: SalaryRange;
  salaryFlexible: boolean; // 薪资要求是否灵活
  currentSalary?: SalaryRange; // 当前薪资（用于参考）
}

/**
 * 薪资匹配结果
 */
export interface SalaryMatchResult {
  isMatch: boolean; // 薪资是否匹配
  matchScore: number; // 薪资匹配评分 (0-1)
  gap: number; // 薪资差距（正数表示岗位薪资高于期望，负数相反）
  gapPercentage: number; // 薪资差距百分比
  recommendation: 'perfect_match' | 'acceptable' | 'negotiable' | 'significant_gap';
  details: string; // 详细说明
}

/**
 * 匹配结果 - 增加薪资匹配
 */
export interface MatchResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  matchReasons: string[];
  improvementSuggestions: string[];
  // 新增薪资匹配结果
  salaryMatch: SalaryMatchResult;
  // 调整整体评分权重说明
  scoreBreakdown: {
    skillsScore: number; // 技能匹配得分
    experienceScore: number; // 经验匹配得分
    educationScore: number; // 学历匹配得分
    salaryScore: number; // 薪资匹配得分
    industryScore: number; // 行业匹配得分
  };
}

/**
 * 使用LangChain和OpenRouter实现的AI服务
 */
class LangChainAIService implements AIService {
  private model: ChatOpenAI;
  private config: AIServiceConfig;

  /**
   * 构造函数
   * @param config AI服务配置
   */
  constructor(config: AIServiceConfig) {
    // 在初始化时检查API Key是否存在，如果不存在则抛出错误，防止服务在不可用状态下运行
    if (!config.apiKey) {
      throw new Error(
        'AI Service API key is not configured. Please set the corresponding environment variable (e.g., OPENROUTER_API_KEY).'
      );
    }
    this.config = config;
    this.model = new ChatOpenAI({
      modelName: config.model,
      temperature: 0.1,
      openAIApiKey: config.apiKey,
      maxTokens: 1000,
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
   * 从岗位描述中提取结构化信息 - 增强版
   */
  async extractJobInfo(job: Job): Promise<JobStructuredInfo> {
    try {
      const parser = StructuredOutputParser.fromZodSchema(
        z.object({
          requiredSkills: z.array(z.string()),
          preferredSkills: z.array(z.string()),
          parsedRequiredSkills: z.array(z.string()),
          parsedPreferredSkills: z.array(z.string()),
          experienceYears: z.number(),
          educationLevel: z.string(),
          industry: z.string(),
          jobLevel: z.string(),
          keyResponsibilities: z.array(z.string()),
          // 新增薪资相关字段
          salaryRange: z
            .object({
              min: z.number(),
              max: z.number(),
              currency: z.string(),
              period: z.enum(['monthly', 'annually']),
            })
            .optional(),
          salaryNegotiable: z.boolean(),
          benefits: z.array(z.string()),
        })
      );

      const promptTemplate = `
请从以下岗位描述中提取关键信息，并以JSON格式返回。

岗位标题: {title}
公司名称: {companyName}
岗位描述: {description}
岗位职责: {responsibilities}
岗位要求: {requirements}
薪资福利: {salaryBenefits}

请提取以下信息:
1. 必备技能列表 (requiredSkills) - 原始描述，如"2+ years of software development experience in backend..."
2. 加分技能列表 (preferredSkills) - 原始描述，如"Experience with web3 development..."  
3. 解析后的必备技能 (parsedRequiredSkills) - 单个技能词，如["Rust", "Go", "TypeScript", "JavaScript", "Node.js", "Docker"]
4. 解析后的加分技能 (parsedPreferredSkills) - 单个技能词，如["Solidity", "Ethereum", "Web3.js", "Smart Contracts"]
5. 工作经验年限要求 (experienceYears)
6. 学历要求 (educationLevel)
7. 行业背景 (industry)
8. 岗位级别 (jobLevel)
9. 核心职责 (keyResponsibilities)
10. 薪资范围 (salaryRange) - 包含最低值、最高值、货币类型、计薪周期
11. 薪资是否可协商 (salaryNegotiable)
12. 福利待遇 (benefits)

技能解析注意事项:
- requiredSkills 和 preferredSkills 保留原始描述句子
- parsedRequiredSkills 和 parsedPreferredSkills 应该是从原始描述中提取出的具体技术名词
- 确保解析后的技能是准确的技术名词，如编程语言、框架、工具等
- 不要在解析后的技能中包含经验年限、熟练度等描述性词语

薪资提取注意事项:
- 识别"15-25k"、"2-3万"、"年薪30-50万"等格式
- 自动推断货币类型（人民币CNY、美元USD等）
- 区分月薪和年薪
- 如果薪资信息不明确，salaryRange设为null
- 识别"薪资面议"、"待遇优厚"等表述，设置salaryNegotiable为true

{format_instructions}
`;

      const prompt = PromptTemplate.fromTemplate(promptTemplate);
      const formattedPrompt = await prompt.format({
        title: job.title,
        companyName: job.companyName,
        description: job.description,
        responsibilities: job.responsibilities || '-',
        requirements: job.requirements || '-',
        salaryBenefits: job.salaryBenefits || job.salaryRange || '-', // 使用 salaryRange 作为备选
        format_instructions: parser.getFormatInstructions(),
      });

      const response = await this.model.invoke(formattedPrompt);
      const content =
        typeof response.content === 'string' ? response.content : JSON.stringify(response.content);
      const result = await parser.parse(content);

      return this.normalizeJobInfo(result);
    } catch (error) {
      console.error('提取岗位信息失败:', error);
      throw error;
    }
  }

  /**
   * 从简历中提取结构化信息 - 调试增强版
   */
  async extractResumeInfo(resume: Resume): Promise<ResumeStructuredInfo> {

    console.log('🔍 开始提取简历信息:', {
      resumeId: resume.id,
      hasName: !!resume.name,
      hasSummary: !!resume.summary,
      hasWorkExperience: !!resume.workExperience,
      hasEducation: !!resume.education,
      hasSkills: !!resume.skills,
      resumeData: resume
    });

    try {
      // 验证 AI 服务配置
      if (!this.config.apiKey) {
        console.error('❌ AI API Key 未配置');
        throw new Error('AI API Key is not configured');
      }

      const parser = StructuredOutputParser.fromZodSchema(
        z.object({
          skills: z.array(z.string()),
          experienceYears: z.number(),
          educationLevel: z.string(),
          industryExperience: z.array(z.string()),
          location: z.string(),
          keyAchievements: z.array(z.string()),
          expectedSalaryRange: z
            .object({
              min: z.number(),
              max: z.number(),
              currency: z.string(),
              period: z.enum(['monthly', 'annually']),
            })
            .optional(),
          salaryFlexible: z.boolean(),
          currentSalary: z
            .object({
              min: z.number(),
              max: z.number(),
              currency: z.string(),
              period: z.enum(['monthly', 'annually']),
            })
            .optional(),
        })
      );

      const promptTemplate = `
请从以下简历信息中提取关键信息。

原始简历内容:
${resume.content}

姓名: {name}
个人简介: {summary}
工作经历: {workExperience}
项目经历: {projects}
教育背景: {education}
已标记技能: {existingSkills}
薪资期望: {salaryExpectation}

请提取以下信息:
1. 技能列表 (skills) - 从文本中全面提取
2. 工作年限 (experienceYears) - 从工作经历计算
3. 最高学历 (educationLevel)
4. 行业经验 (industryExperience)
5. 所在地区 (location)
6. 主要成就 (keyAchievements)
7. 期望薪资范围 (expectedSalaryRange)
8. 薪资要求灵活性 (salaryFlexible)
9. 当前薪资 (currentSalary) - 从工作经历推断

薪资提取重点:
- 从个人简介、工作经历中识别薪资相关信息
- 识别"期望月薪15-20k"、"年薪期望30万+"等表述
- 如果提到"薪资可议"、"面谈"等，设置salaryFlexible为true
- 从当前/最近工作经历推断当前薪资水平
- 考虑地区差异和行业标准

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
        salaryExpectation: (resume as any).salaryExpectation || '未明确薪资期望',
        format_instructions: parser.getFormatInstructions(),
      });

      const response = await this.model.invoke(formattedPrompt);
      
      const content =
        typeof response.content === 'string' ? response.content : JSON.stringify(response.content);
      
      const result = await parser.parse(content);

      const normalizedResult = this.normalizeResumeInfo(result);
      
      console.log('🔄 规范化后的结果:', normalizedResult);

      return normalizedResult;
    } catch (error) {
      console.error('❌ 提取简历信息失败:', {
        error: error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      // 返回默认值而不是抛出错误，这样可以查看是否是这里导致的空数据
      return {
        skills: [],
        experienceYears: 0,
        educationLevel: '未知',
        industryExperience: [],
        location: '未知',
        keyAchievements: [],
        salaryFlexible: false,
      };
    }
  }

  /**
   * 计算薪资匹配度
   */
  private calculateSalaryMatch(
    resumeInfo: ResumeStructuredInfo,
    jobInfo: JobStructuredInfo
  ): SalaryMatchResult {
    // 如果任一方没有薪资信息，返回中性结果
    if (!resumeInfo.expectedSalaryRange || !jobInfo.salaryRange) {
      return {
        isMatch: true, // 缺少信息时不影响匹配
        matchScore: 0.7, // 中性评分
        gap: 0,
        gapPercentage: 0,
        recommendation: 'negotiable',
        details: '薪资信息不完整，建议面谈确认',
      };
    }

    const expectedSalary = resumeInfo.expectedSalaryRange;
    const offeredSalary = jobInfo.salaryRange;

    // 统一到相同计薪周期进行比较（转换为年薪）
    const expectedAnnual = this.convertToAnnualSalary(expectedSalary);
    const offeredAnnual = this.convertToAnnualSalary(offeredSalary);

    // 计算薪资差距
    const expectedMid = (expectedAnnual.min + expectedAnnual.max) / 2;
    const offeredMid = (offeredAnnual.min + offeredAnnual.max) / 2;
    const gap = offeredMid - expectedMid;
    const gapPercentage = (gap / expectedMid) * 100;

    // 判断匹配情况
    let isMatch = false;
    let matchScore = 0;
    let recommendation: SalaryMatchResult['recommendation'];
    let details = '';

    // 检查薪资范围是否有重叠
    const hasOverlap =
      offeredAnnual.max >= expectedAnnual.min && expectedAnnual.max >= offeredAnnual.min;

    if (hasOverlap) {
      // 有重叠，计算重叠程度
      const overlapMin = Math.max(offeredAnnual.min, expectedAnnual.min);
      const overlapMax = Math.min(offeredAnnual.max, expectedAnnual.max);
      const overlapSize = overlapMax - overlapMin;
      const expectedRange = expectedAnnual.max - expectedAnnual.min;
      const overlapRatio = overlapSize / expectedRange;

      isMatch = true;
      matchScore = Math.min(1, 0.6 + overlapRatio * 0.4); // 基础分0.6，重叠度影响0.4

      if (overlapRatio > 0.8) {
        recommendation = 'perfect_match';
        details = '薪资范围高度匹配';
      } else if (overlapRatio > 0.5) {
        recommendation = 'acceptable';
        details = '薪资范围基本匹配';
      } else {
        recommendation = 'negotiable';
        details = '薪资范围部分重叠，需要协商';
      }
    } else {
      // 无重叠，根据差距大小判断
      const absGapPercentage = Math.abs(gapPercentage);

      if (absGapPercentage <= 10) {
        isMatch = true;
        matchScore = 0.6;
        recommendation = 'negotiable';
        details = '薪资差距较小，可协商';
      } else if (absGapPercentage <= 20) {
        isMatch = resumeInfo.salaryFlexible || jobInfo.salaryNegotiable;
        matchScore = 0.4;
        recommendation = 'negotiable';
        details = gapPercentage > 0 ? '岗位薪资高于期望，可考虑' : '期望薪资偏高，需协商';
      } else {
        isMatch = false;
        matchScore = 0.2;
        recommendation = 'significant_gap';
        details =
          gapPercentage > 0 ? '岗位薪资远高于期望，建议考虑' : '期望薪资明显高于预算，匹配度较低';
      }
    }

    return {
      isMatch,
      matchScore,
      gap,
      gapPercentage,
      recommendation,
      details,
    };
  }

  /**
   * 将薪资转换为年薪便于比较
   */
  private convertToAnnualSalary(salary: SalaryRange): SalaryRange {
    if (salary.period === 'annually') {
      return salary;
    }

    // 月薪转年薪 (考虑13薪或14薪的情况，这里简化为12个月)
    return {
      min: salary.min * 12,
      max: salary.max * 12,
      currency: salary.currency,
      period: 'annually',
    };
  }

  /**
   * 计算匹配度 - 增强版（包含薪资匹配）
   */
  async calculateMatchScore(
    resumeInfo: ResumeStructuredInfo,
    jobInfo: JobStructuredInfo
  ): Promise<MatchResult> {
    try {
      // 计算薪资匹配
      const salaryMatch = this.calculateSalaryMatch(resumeInfo, jobInfo);

      const parser = StructuredOutputParser.fromZodSchema(
        z.object({
          score: z.number(),
          matchedSkills: z.array(z.string()),
          missingSkills: z.array(z.string()),
          matchReasons: z.array(z.string()),
          improvementSuggestions: z.array(z.string()),
          scoreBreakdown: z.object({
            skillsScore: z.number(),
            experienceScore: z.number(),
            educationScore: z.number(),
            salaryScore: z.number(),
            industryScore: z.number(),
          }),
        })
      );

      const promptTemplate = `
请评估求职者与岗位的综合匹配程度，包含薪资匹配分析。

岗位信息:
- 职位级别: {jobLevel}
- 必备技能: {requiredSkills}
- 加分技能: {preferredSkills}
- 经验要求: {jobExperienceYears}年
- 学历要求: {jobEducationLevel}
- 行业: {jobIndustry}
- 薪资范围: {jobSalaryRange}
- 薪资可协商: {salaryNegotiable}

求职者信息:
- 技能: {resumeSkills}
- 工作经验: {resumeExperienceYears}年
- 学历: {resumeEducationLevel}
- 行业经验: {resumeIndustryExperience}
- 期望薪资: {expectedSalaryRange}
- 薪资灵活性: {salaryFlexible}

薪资匹配分析结果:
- 匹配评分: {salaryMatchScore}
- 匹配建议: {salaryRecommendation}
- 详细说明: {salaryDetails}

请提供综合评估:
1. 总体匹配评分 (score, 0-1)
2. 匹配技能 (matchedSkills)
3. 缺失技能 (missingSkills)  
4. 匹配原因 (matchReasons)
5. 改进建议 (improvementSuggestions)
6. 评分细分 (scoreBreakdown):
 - 技能匹配 (skillsScore): 权重40%
 - 经验匹配 (experienceScore): 权重25% 
 - 学历匹配 (educationScore): 权重10%
 - 薪资匹配 (salaryScore): 权重15%
 - 行业匹配 (industryScore): 权重10%

{format_instructions}
`;

      const prompt = PromptTemplate.fromTemplate(promptTemplate);
      const formattedPrompt = await prompt.format({
        jobLevel: jobInfo.jobLevel,
        requiredSkills: jobInfo.requiredSkills.join(', '),
        preferredSkills: jobInfo.preferredSkills.join(', '),
        jobExperienceYears: jobInfo.experienceYears,
        jobEducationLevel: jobInfo.educationLevel,
        jobIndustry: jobInfo.industry,
        jobSalaryRange: jobInfo.salaryRange
          ? this.formatSalaryRange(jobInfo.salaryRange)
          : '未明确',
        salaryNegotiable: jobInfo.salaryNegotiable ? '是' : '否',
        resumeSkills: resumeInfo.skills.join(', '),
        resumeExperienceYears: resumeInfo.experienceYears,
        resumeEducationLevel: resumeInfo.educationLevel,
        resumeIndustryExperience: resumeInfo.industryExperience.join(', '),
        expectedSalaryRange: resumeInfo.expectedSalaryRange
          ? this.formatSalaryRange(resumeInfo.expectedSalaryRange)
          : '未明确',
        salaryFlexible: resumeInfo.salaryFlexible ? '是' : '否',
        salaryMatchScore: salaryMatch.matchScore,
        salaryRecommendation: salaryMatch.recommendation,
        salaryDetails: salaryMatch.details,
        format_instructions: parser.getFormatInstructions(),
      });

      const response = await this.model.invoke(formattedPrompt);
      const content =
        typeof response.content === 'string' ? response.content : JSON.stringify(response.content);
      const aiResult = await parser.parse(content);

      // 组合最终结果
      return {
        ...aiResult,
        salaryMatch,
      };
    } catch (error) {
      console.error('计算匹配度失败:', error);
      throw error;
    }
  }

  /**
   * 格式化薪资范围显示
   */
  private formatSalaryRange(salary: SalaryRange): string {
    const currency =
      salary.currency === 'CNY' ? '¥' : salary.currency === 'USD' ? '$' : salary.currency;
    const period = salary.period === 'monthly' ? '/月' : '/年';

    if (salary.min === salary.max) {
      return `${currency}${salary.min.toLocaleString()}${period}`;
    }
    return `${currency}${salary.min.toLocaleString()}-${salary.max.toLocaleString()}${period}`;
  }

  /**
   * 对单个简历和岗位对执行完整的AI增强匹配分析。
   * 这个方法封装了信息提取和评分计算的整个流程，简化了外部服务的调用。
   * @param resume 简历数据
   * @param job 岗位数据
   * @returns 匹配结果，包含评分、技能分析、原因和建议
   */
  async enhanceMatching(resume: Resume, job: Job): Promise<MatchResult> {
    try {
      // 检查简历对象中是否已有解析好的结构化数据
      let resumeInfo: ResumeStructuredInfo;
      if (resume.parsedData && 
          typeof resume.parsedData === 'object' && 
          'skills' in resume.parsedData && 
          'educationLevel' in resume.parsedData) {
        resumeInfo = resume.parsedData as unknown as ResumeStructuredInfo;
      } else {
        // 如果没有结构化数据，才调用AI进行解析
        console.log('简历未解析，开始提取结构化数据');
        resumeInfo = await this.extractResumeInfo(resume);
      }

      // 获取岗位结构化数据
      const jobInfo = await this.extractJobInfo(job);

      // 使用提取出的结构化信息计算匹配分数和详细分析
      const matchResult = await this.calculateMatchScore(resumeInfo, jobInfo);

      return matchResult;
    } catch (error) {
      console.error(`为简历 ${resume.id} 和岗位 ${job.id} 执行增强匹配失败:`, error);
      // 在遇到错误时，将错误包装后重新抛出，以便上层服务能够捕获和处理
      throw new Error(
        `Failed to enhance match for resume ${resume.id} and job ${job.id}: ${(error as Error).message}`
      );
    }
  }

  /**
   * 对已经提取结构化数据的简历和岗位进行增强匹配分析
   * @param resumeInfo 已提取的简历结构化数据
   * @param jobInfo 已提取的岗位结构化数据
   * @returns 完整的匹配分析结果 
   */
  async enhanceMatchingWithExtractedInfo(resumeInfo: ResumeStructuredInfo, jobInfo: JobStructuredInfo): Promise<MatchResult> {
    try {
      // 使用提取出的结构化信息计算匹配分数和详细分析
      const matchResult = await this.calculateMatchScore(resumeInfo, jobInfo);

      return matchResult;
    } catch (error) {
      console.error(`为简历和岗位进行增强匹配失败:`, error);
      // 在遇到错误时，将错误包装后重新抛出，以便上层服务能够捕获和处理
      throw new Error(
        `Failed to enhance match for resume and job: ${(error as Error).message}`
      );
    }
  }

  /**
   * 规范化岗位信息
   * @param jobInfo 原始岗位信息
   * @returns 规范化后的岗位信息
   */
  private normalizeJobInfo(jobInfo: JobStructuredInfo): JobStructuredInfo {
    return {
      ...jobInfo,
      requiredSkills: jobInfo.requiredSkills || [],
      preferredSkills: jobInfo.preferredSkills || [],
      parsedRequiredSkills: this.normalizeSkills(jobInfo.parsedRequiredSkills || []),
      parsedPreferredSkills: this.normalizeSkills(jobInfo.parsedPreferredSkills || []),
      experienceYears: Math.max(0, jobInfo.experienceYears || 0),
      educationLevel: this.normalizeEducationLevel(jobInfo.educationLevel),
      industry: jobInfo.industry || '',
      jobLevel: this.normalizeJobLevel(jobInfo.jobLevel),
      keyResponsibilities: jobInfo.keyResponsibilities || [],
      benefits: jobInfo.benefits || [],
      salaryNegotiable: jobInfo.salaryNegotiable || false
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
      keyAchievements: resumeInfo.keyAchievements || [],
    };
  }

  /**
   * 规范化技能列表
   * @param skills 技能列表
   * @returns 规范化后的技能列表
   */
  private normalizeSkills(skills: string[]): string[] {
    if (!skills || !Array.isArray(skills)) return [];

    // 过滤掉无效或空字符串，并进行修剪和转换为小写，确保技能匹配的一致性
    return [
      ...new Set(
        skills
          .filter(Boolean)
          .map(skill => skill.trim().toLowerCase())
          .filter(skill => skill.length > 0)
      ),
    ];
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
  apiKey: process.env.OPENROUTER_API_KEY || '',
  model: process.env.AI_MODEL || 'anthropic/claude-sonnet-4',
  baseUrl: process.env.AI_API_BASE_URL || 'https://openrouter.ai/api/v1',
};

// 导出AI服务实例
export const aiService = new LangChainAIService(config);
