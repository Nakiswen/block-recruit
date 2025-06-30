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
  score: number | undefined;  // 分数可能为undefined
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
  RESUME = 'resume'
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
  location?: string;    // 可能不存在，添加可选标志
  responsibilities?: string;
  requirements?: string;
  skills?: string[];
  industry?: string;
  experienceYears?: number;
  educationLevel?: string;
  level?: string;
  salaryBenefits?: string; // 薪资福利描述
  benefits?: string[];     // 福利列表
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