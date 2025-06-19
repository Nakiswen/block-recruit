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
  hfApiKey?: string;
  modelName: string;
  dimensions: number;
}
