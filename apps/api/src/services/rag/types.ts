/**
 * 向量数据项
 */
export interface VectorItem {
  id: string;
  vector: number[];
  metadata: Record<string, any>;
}

/**
 * 向量搜索选项
 */
export interface SearchOptions {
  /** 返回的最大结果数 */
  topK?: number;
  /** 过滤条件 */
  filters?: Record<string, any>;
  /** 最小相似度分数 */
  minScore?: number;
  /** 是否包含向量值 */
  includeValues?: boolean;
}

/**
 * 向量搜索的匹配项
 */
export interface Match {
  id: string;
  score: number | undefined; // 分数可能为undefined
  metadata: Record<string, any>;
}

/**
 * 向量搜索结果
 */
export interface SearchResult {
  matches: Match[];
  totalCandidates: number;
  searchTimeMs: number;
  searchSuccess: boolean;
  error?: string;
}

/**
 * Pinecone客户端配置
 */
export interface PineconeConfig {
  apiKey: string;
  // 岗位索引名称
  jobIndexName: string;
  // 岗位索引host
  jobIndexHost: string;
  // 简历索引名称
  resumeIndexName: string;
  // 简历索引host
  resumeIndexHost: string;
}

/**
 * Pinecone索引类型
 */
export enum PineconeIndexType {
  JOB = 'job',
  RESUME = 'resume',
}

/**
 * Pinecone搜索参数
 */
export interface PineconeSearchParams {
  /** 查询向量 */
  vector: number[];
  /** 返回的最大结果数量 */
  topK?: number;
  /** 是否包含元数据 */
  includeMetadata?: boolean;
  /** 是否包含向量值 */
  includeValues?: boolean;
  /** 过滤条件 */
  filter?: Record<string, any>;
  /** 索引类型 */
  indexType?: PineconeIndexType;
  /** 最小相似度分数 */
  minScore?: number;
}

/**
 * Embedding服务配置
 */
export interface EmbeddingServiceConfig {
  apiKey: string;
  embeddingApiUrl: string;
  modelName: string;
  dimensions: number;
}

// 定义模型类型
export type Job = {
  id: string;
  title: string;
  description: string;
  companyName?: string; // 可能不存在，添加可选标志
  salaryRange?: string; // 可能不存在，添加可选标志
  location?: string; // 可能不存在，添加可选标志
  responsibilities?: string;
  requirements?: string;
  skills?: string[];
  industry?: string;
  experienceYears?: number;
  educationLevel?: string;
  level?: string;
  salaryBenefits?: string; // 薪资福利描述
  benefits?: string; // 福利待遇
  companyIntroduction?: string; // 公司介绍
  companyWebsite?: string; // 公司网站
};

export interface Resume {
  id: string;
  userId: string;
  content: string;
  name?: string;
  summary?: string;
  workExperience?: string;
  projects?: string;
  education?: string;
  skills?: string[];
  parsedData?: {
    skills?: string[];
    experienceYears?: number;
    educationLevel?: string;
    industryExperience?: string[];
    location?: string;
    keyAchievements?: string[];
    salaryFlexible?: boolean;
    expectedSalaryRange?: any;
    currentSalary?: any;
  };
  vectorId?: string;
  status?: string;
  title?: string;
  filename?: string;
  filetype?: string;
  filesize?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * 包含了AI增强分析的岗位匹配结果
 */
export interface EnhancedMatch {
  job: Job;
  matchDetails: import('@/services/ai/aiService').MatchResult;
}

/**
 * 包含了AI增强分析的简历匹配结果
 */
export interface EnhancedMatchForResume {
  resume: Resume;
  matchDetails: import('@/services/ai/aiService').MatchResult;
}

export interface ResumeVector {
  id: string;
  vector: number[];
  metadata: Record<string, any>;
}

// ========== V2 统一类型定义 ==========

import { SkillCategory } from './skillNormalizer.js';

/**
 * 岗位类型枚举
 */
export enum JobType {
  TECHNICAL = 'technical',
  PRODUCT = 'product',
  OPERATION = 'operation',
  MARKETING = 'marketing',
  DESIGN = 'design',
  RESEARCH = 'research',
  BUSINESS = 'business',
  OTHER = 'other',
}

/**
 * 统一标签结构 - 简历和岗位共用
 */
export interface UnifiedTags {
  normalizedSkills: string[]; // 标准化后的技能列表
  skillCategories: SkillCategory[]; // 技能分类列表
  experienceYears: number; // 经验年限
  educationLevel: string; // 学历
  jobType: JobType; // 岗位类型
  location: string; // 地点
  industry: string[]; // 行业
}

/**
 * 统一的 Pinecone Metadata 结构
 * 简历和岗位使用相同的字段名
 */
export interface UnifiedMetadata {
  id: string; // 实体ID
  type: 'resume' | 'job'; // 类型标识
  normalized_skills: string[]; // 标准化技能（统一字段名）
  skill_categories: string[]; // 技能分类
  experience_years: number; // 经验年限
  education_level: string; // 学历
  job_type: string; // 岗位类型
  location: string; // 地点
  industry: string[]; // 行业
  update_time: string; // 更新时间

  // 简历特有字段
  owner?: string; // 简历所有者ID
  expected_salary_min?: number; // 期望薪资下限
  expected_salary_max?: number; // 期望薪资上限

  // 岗位特有字段
  company?: string; // 公司名称
  title?: string; // 岗位标题
  required_skills?: string[]; // 必须技能（原始描述）
  preferred_skills?: string[]; // 加分技能（原始描述）
  parsed_required_skills?: string[]; // 解析后的必须技能（具体技能词）
  parsed_preferred_skills?: string[]; // 解析后的加分技能（具体技能词）
  salary_min?: number; // 薪资下限
  salary_max?: number; // 薪资上限
  job_level?: string; // 岗位级别
}

/**
 * 匹配配置
 */
export interface MatchingConfig {
  hardFilterEnabled: boolean; // 是否启用硬性过滤
  vectorRecallTopK: number; // 向量召回数量
  finalTopK: number; // 最终返回数量
  minVectorScore: number; // 最低向量相似度
  relaxFilterOnEmpty: boolean; // 空结果时是否放宽过滤
  weights: {
    skillMatch: number; // 技能匹配权重
    vectorSimilarity: number; // 向量相似度权重
    experienceMatch: number; // 经验匹配权重
    salaryMatch: number; // 薪资匹配权重
    jobTypeMatch: number; // 岗位类型匹配权重
  };
}

/**
 * 匹配结果
 */
export interface MatchingResult {
  id: string;
  score: number; // 综合得分
  vectorScore: number; // 向量相似度
  skillMatchScore: number; // 技能匹配度
  experienceMatchScore: number; // 经验匹配度
  salaryMatchScore: number; // 薪资匹配度
  jobTypeMatchScore: number; // 岗位类型匹配度
  matchedSkills: string[]; // 匹配的技能
  missingSkills: string[]; // 缺失的技能
  metadata: UnifiedMetadata;
}

/**
 * 默认匹配配置
 * 权重分配说明：
 * - skillMatch (0.35): 技能匹配最重要
 * - jobTypeMatch (0.20): 岗位类型匹配很重要，开发不应该匹配产品岗
 * - vectorSimilarity (0.20): 语义相似度
 * - experienceMatch (0.15): 经验匹配
 * - salaryMatch (0.05): 薪资匹配权重较低
 * - semanticBonus (0.05): 语义补充加分
 */
export const DEFAULT_MATCHING_CONFIG: MatchingConfig = {
  hardFilterEnabled: true,
  vectorRecallTopK: 50,
  finalTopK: 10,
  minVectorScore: 0.6,
  relaxFilterOnEmpty: true,
  weights: {
    skillMatch: 0.35,
    jobTypeMatch: 0.2,
    vectorSimilarity: 0.2,
    experienceMatch: 0.15,
    salaryMatch: 0.05,
  },
};

// ========== 增强匹配类型定义 ==========

/**
 * 增强匹配配置
 */
export interface EnhancedMatchingConfig extends MatchingConfig {
  structuredFilterEnabled: boolean; // 是否启用结构化过滤
  semanticSupplementEnabled: boolean; // 是否启用语义补充
  maxRelaxLevel: number; // 最大放宽级别
  semanticThreshold: number; // 语义补充阈值
}

/**
 * 增强匹配结果
 */
export interface EnhancedMatchingResult extends MatchingResult {
  filterRelaxed: boolean; // 是否使用了放宽的过滤
  relaxLevel: number; // 放宽级别
  semanticBonus: number; // 语义补充加分
  semanticMatches: Array<{
    // 语义匹配详情
    resumeSkill: string;
    jobSkill: string;
    similarity: number;
  }>;
}

/**
 * 默认增强匹配配置
 */
export const DEFAULT_ENHANCED_MATCHING_CONFIG: EnhancedMatchingConfig = {
  ...DEFAULT_MATCHING_CONFIG,
  structuredFilterEnabled: true,
  semanticSupplementEnabled: true,
  maxRelaxLevel: 4,
  semanticThreshold: 0.7,
};
