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
  // 过滤条件
  filters?: Record<string, any>;
  // 返回的最大结果数
  topK?: number;
  // 最小相似度阈值
  minScore?: number;
}

/**
 * 向量搜索结果
 */
export interface SearchResult {
  // 匹配的结果
  matches: Array<{
    id: string;
    score: number;
    metadata: Record<string, any>;
  }>;
  // 候选项总数
  totalCandidates: number;
  // 搜索耗时(毫秒)
  searchTimeMs: number;
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
  vector: number[];
  topK: number;
  filter?: Record<string, any>;
  minScore?: number;
  // 指定使用的索引类型
  indexType?: PineconeIndexType;
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
};

export type Resume = {
  id: string;
  userId: string;
  name?: string;
  content: string;
  parsedContent?: any;
  skills?: string[];
  experienceYears?: number;
  educationLevel?: string;
  industry?: string;
  location?: string;
  summary?: string;
  workExperience?: string;
  projects?: string;
  education?: string;
};