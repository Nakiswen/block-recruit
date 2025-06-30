import axios from 'axios';
import { EmbeddingServiceConfig } from './types';
import dotenv from 'dotenv';

/**
 * 向量嵌入服务
 * 负责生成文本的向量表示
 */
class EmbeddingService {
  private config: EmbeddingServiceConfig;
  private cache: Map<string, number[]>;
  private maxRetries = 3; // 最大重试次数

  constructor(config: EmbeddingServiceConfig) {
    this.config = config;
    this.cache = new Map<string, number[]>();
  }

  /**
   * 生成文本的向量表示
   * @param text 输入文本
   * @returns 向量数组
   */
  async  generateEmbedding(text: string): Promise<number[]> {
    try {
      // 对文本进行清理和归一化处理
      const normalizedText = this.normalizeText(text);
      
      // 检查缓存中是否已存在
      const cacheKey = this.generateCacheKey(normalizedText);
      const cachedVector = this.cache.get(cacheKey);
      if (cachedVector) {
        return cachedVector;
      }

      // 调用API生成向量
      const vector = await this.callEmbeddingAPI(normalizedText);
      
      // 存入缓存
      this.cache.set(cacheKey, vector);
      
      return vector;
    } catch (error) {
      console.error('生成向量失败:', error);
      throw error;
    }
  }

  /**
   * 批量生成向量
   * @param texts 文本列表
   * @returns 向量数组列表
   */
  async batchGenerateEmbeddings(texts: string[]): Promise<number[][]> {
    // 检查是否有文本需要处理
    if (!texts.length) {
      return [];
    }

    try {
      // 对文本进行清理和归一化处理
      const normalizedTexts = texts.map(text => this.normalizeText(text));
      
      // 检查缓存中是否已存在
      const results: number[][] = [];
      const textsToEmbed: string[] = [];
      const indices: number[] = [];
      
      for (let i = 0; i < normalizedTexts.length; i++) {
        const text = normalizedTexts[i];
        const cacheKey = this.generateCacheKey(text);
        const cachedVector = this.cache.get(cacheKey);
        
        if (cachedVector) {
          results[i] = cachedVector;
        } else {
          textsToEmbed.push(text);
          indices.push(i);
        }
      }
      
      // 如果所有文本都在缓存中，直接返回
      if (!textsToEmbed.length) {
        return results;
      }
      
      // 调用API批量生成向量
      const vectors = await this.callBatchEmbeddingAPI(textsToEmbed);
      
      // 存入缓存并填充结果
      for (let i = 0; i < vectors.length; i++) {
        const text = textsToEmbed[i];
        const vector = vectors[i];
        const cacheKey = this.generateCacheKey(text);
        
        this.cache.set(cacheKey, vector);
        results[indices[i]] = vector;
      }
      
      return results;
    } catch (error) {
      console.error('批量生成向量失败:', error);
      throw error;
    }
  }

  /**
   * 使用向量化操作的高性能版本（如果需要处理大量数据）
   * 注意：这个版本需要额外的数学库支持
   */
  calculateCosineSimilarityVectorized(vector1: number[], vector2: number[]): number {
    // 如果可以使用类似numpy的库，这里可以实现向量化操作
    // 例如使用ml-matrix或其他数学库
    
    // 当前实现：使用TypedArray提高性能
    const vec1 = new Float64Array(vector1);
    const vec2 = new Float64Array(vector2);
    
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;
    
    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      magnitude1 += vec1[i] * vec1[i];
      magnitude2 += vec2[i] * vec2[i];
    }
    
    const mag1 = Math.sqrt(magnitude1);
    const mag2 = Math.sqrt(magnitude2);
    
    if (mag1 < 1e-10 || mag2 < 1e-10) {
      return 0;
    }
    
    let similarity = dotProduct / (mag1 * mag2);
    similarity = Math.max(-1, Math.min(1, similarity));
    
    return (similarity + 1) / 2;
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * 调用Embedding API生成向量
   * @param text 输入文本
   * @returns 向量数组
   */
  private async callEmbeddingAPI(text: string): Promise<number[]> {
    let retries = 0;
    let lastError: Error | null = null;

    while (retries <= this.maxRetries) {
      try {
        // 硅基流动的BAAI/bge-m3 API端点
        const apiUrl = this.config.embeddingApiUrl;
        
        const response = await axios.post(
          apiUrl,
          {
            model: this.config.modelName,
            input: text
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.config.apiKey}`
            },
            // 添加请求超时配置 - 30秒超时时间
            timeout: 30000,
            // 添加代理配置（如果需要）
            proxy: false
          }
        );
        
        // 解析硅基流动API的响应格式
        return response.data.data[0].embedding;
      } catch (error) {
        lastError = error as Error;
        console.error(`调用Embedding API失败 (重试 ${retries}/${this.maxRetries}):`, error);
        retries++;
        
        // 如果不是最后一次重试，则等待一段时间后再重试
        if (retries <= this.maxRetries) {
          const delay = Math.pow(2, retries) * 1000; // 指数退避策略
          console.log(`等待 ${delay}ms 后重试...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // 所有重试都失败了
    console.error('所有重试都失败，无法获取嵌入向量');
    throw lastError;
  }

  /**
   * 批量调用Embedding API生成向量
   * @param texts 文本列表
   * @returns 向量数组列表
   */
  private async callBatchEmbeddingAPI(texts: string[]): Promise<number[][]> {
    let retries = 0;
    let lastError: Error | null = null;

    while (retries <= this.maxRetries) {
      try {
        // 硅基流动的BAAI/bge-m3 API端点
        const apiUrl = this.config.embeddingApiUrl;
        
        const response = await axios.post(
          apiUrl,
          {
            model: this.config.modelName,
            input: texts
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.config.apiKey}`
            },
            // 添加请求超时配置 - 60秒超时时间（批量处理需要更长时间）
            timeout: 60000,
            // 添加代理配置（如果需要）
            proxy: false
          }
        );
        
        // 解析硅基流动API的响应格式，确保按索引排序
        return response.data.data
          .sort((a: any, b: any) => a.index - b.index)
          .map((item: any) => item.embedding);
      } catch (error) {
        lastError = error as Error;
        console.error(`批量调用Embedding API失败 (重试 ${retries}/${this.maxRetries}):`, error);
        retries++;
        
        // 如果不是最后一次重试，则等待一段时间后再重试
        if (retries <= this.maxRetries) {
          const delay = Math.pow(2, retries) * 1000; // 指数退避策略
          console.log(`等待 ${delay}ms 后重试...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // 所有重试都失败了
    console.error('所有批量重试都失败，无法获取嵌入向量');
    throw lastError;
  }

  /**
   * 生成缓存键
   * @param text 文本
   * @returns 缓存键
   */
  private generateCacheKey(text: string): string {
    // 简单的缓存键生成，实际项目中可以使用更复杂的哈希函数
    return `${this.config.modelName}:${text.substring(0, 100)}`;
  }

  /**
   * 对文本进行归一化处理
   * @param text 原始文本
   * @returns 归一化后的文本
   */
  private normalizeText(text: string): string {
    if (!text) return '';
    
    // 去除多余空白字符
    let normalized = text.replace(/\s+/g, ' ').trim();
    
    // BAAI/bge-m3 模型可能需要特定的文本处理
    if (this.config.modelName === 'BAAI/bge-m3') {
      // 根据模型文档添加适当的前缀（如果需要）
      if (!normalized.startsWith('Represent this sentence:') && normalized.length < 8000) {
        normalized = `Represent this sentence: ${normalized}`;
      }
    }
    
    // 如果文本过长，可以截取一定长度
    const maxLength = 8000; // API的文本长度限制
    if (normalized.length > maxLength) {
      normalized = normalized.substring(0, maxLength);
    }
    
    return normalized;
  }
}

dotenv.config();

// 从环境变量获取配置
const config: EmbeddingServiceConfig = {
  apiKey: process.env.EMBEDDING_API_KEY || process.env.AI_API_KEY || '',
  embeddingApiUrl: 'https://api.siliconflow.cn/v1/embeddings',
  modelName: 'BAAI/bge-m3',
  dimensions: parseInt(process.env.EMBEDDING_DIMENSIONS || '1024', 10) // BAAI/bge-m3模型默认维度
};

// 导出服务实例
export const embeddingService = new EmbeddingService(config); 