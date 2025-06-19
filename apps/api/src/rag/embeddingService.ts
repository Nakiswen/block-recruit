import axios from 'axios';
import { HfInference } from '@huggingface/inference';
import { EmbeddingServiceConfig } from './types';

/**
 * 向量嵌入服务
 * 负责生成文本的向量表示
 */
class EmbeddingService {
  private config: EmbeddingServiceConfig;
  private cache: Map<string, number[]>;
  private hf: HfInference | null = null;

  constructor(config: EmbeddingServiceConfig) {
    this.config = config;
    this.cache = new Map<string, number[]>();
    
    // 初始化HuggingFace客户端（如果提供了HF API密钥）
    if (this.config.hfApiKey) {
      this.hf = new HfInference(this.config.hfApiKey);
    }
  }

  /**
   * 生成文本的向量表示
   * @param text 输入文本
   * @returns 向量数组
   */
  async generateEmbedding(text: string): Promise<number[]> {
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
   * 计算两个向量之间的余弦相似度
   * @param vector1 向量1
   * @param vector2 向量2
   * @returns 余弦相似度 (0-1之间)
   */
  calculateCosineSimilarity(vector1: number[], vector2: number[]): number {
    if (vector1.length !== vector2.length) {
      throw new Error('向量维度不匹配');
    }
    
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;
    
    for (let i = 0; i < vector1.length; i++) {
      dotProduct += vector1[i] * vector2[i];
      magnitude1 += vector1[i] * vector1[i];
      magnitude2 += vector2[i] * vector2[i];
    }
    
    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);
    
    if (magnitude1 === 0 || magnitude2 === 0) {
      return 0;
    }
    
    return dotProduct / (magnitude1 * magnitude2);
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
    try {
      // 如果使用HuggingFace模型
      if (this.config.modelName === 'BAAI/bge-large-en-v1.5-icl' && this.hf) {
        return await this.callHuggingFaceEmbedding(text);
      }

      // 如果是智谱AI
      const apiUrl = this.config.apiKey.includes('sk-zpmodel') 
        ? 'https://api.zhipuai.cn/v1/embeddings' 
        : 'https://api.openai.com/v1/embeddings';
      
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
          }
        }
      );
      
      return response.data.data[0].embedding;
    } catch (error) {
      console.error('调用Embedding API失败:', error);
      throw error;
    }
  }

  /**
   * 调用HuggingFace Embedding API
   * @param text 输入文本
   * @returns 向量数组
   */
  private async callHuggingFaceEmbedding(text: string): Promise<number[]> {
    try {
      if (!this.hf) {
        throw new Error('HuggingFace客户端未初始化，请提供有效的HF API密钥');
      }

      // 调用HuggingFace的feature-extraction接口获取embedding
      const result = await this.hf.featureExtraction({
        model: 'BAAI/bge-large-en-v1.5-icl',
        inputs: text,
        // ICL提示模板，根据模型文档添加
        options: {
          use_pooling: true,
          wait_for_model: true
        }
      });

      // 返回特征向量
      if (Array.isArray(result)) {
        // 如果返回的是数组
        if (result.length > 0 && !Array.isArray(result[0])) {
          // 如果是一维数组，直接返回
          return result as number[];
        } else if (result.length > 0 && Array.isArray(result[0])) {
          // 如果是二维数组，返回第一个元素
          return result[0] as number[];
        }
      } else if (typeof result === 'object' && result !== null) {
        // 如果返回的是复杂对象，尝试解析
        const resultObj = result as Record<string, unknown>;
        if ('embeddings' in resultObj && Array.isArray(resultObj.embeddings)) {
          return resultObj.embeddings as number[];
        }
      }
      
      // 如果无法正确解析，返回空数组并记录错误
      console.error('无法解析HuggingFace返回的embedding结果:', result);
      return [];
    } catch (error) {
      console.error('调用HuggingFace Embedding API失败:', error);
      throw error;
    }
  }

  /**
   * 批量调用Embedding API生成向量
   * @param texts 文本列表
   * @returns 向量数组列表
   */
  private async callBatchEmbeddingAPI(texts: string[]): Promise<number[][]> {
    try {
      // 如果使用HuggingFace模型，我们需要单独处理每个文本（HF API可能不支持批量）
      if (this.config.modelName === 'BAAI/bge-large-en-v1.5-icl' && this.hf) {
        // 并行处理所有文本
        const promises = texts.map(text => this.callHuggingFaceEmbedding(text));
        return await Promise.all(promises);
      }

      // 否则使用原来的OpenAI或智谱AI的批量API
      const apiUrl = this.config.apiKey.includes('sk-zpmodel') 
        ? 'https://api.zhipuai.cn/v1/embeddings' 
        : 'https://api.openai.com/v1/embeddings';
      
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
          }
        }
      );
      
      // API返回的向量数组可能不是按输入顺序排列的，需要根据index排序
      return response.data.data
        .sort((a: any, b: any) => a.index - b.index)
        .map((item: any) => item.embedding);
    } catch (error) {
      console.error('批量调用Embedding API失败:', error);
      throw error;
    }
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
    
    // 针对BAAI/bge-large-en-v1.5-icl模型，添加特定的文本处理
    if (this.config.modelName === 'BAAI/bge-large-en-v1.5-icl') {
      // 对于bge-large-en-v1.5-icl，按照文档建议添加查询前缀
      if (!normalized.startsWith('Represent this sentence for searching:') && normalized.length < 5000) {
        normalized = `Represent this sentence for searching: ${normalized}`;
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

// 从环境变量获取配置
const config: EmbeddingServiceConfig = {
  apiKey: process.env.EMBEDDING_API_KEY || process.env.AI_API_KEY || '',
  hfApiKey: process.env.HF_API_KEY || process.env.HUGGINGFACE_API_KEY || '',
  modelName: process.env.EMBEDDING_MODEL || 'BAAI/bge-large-en-v1.5-icl',
  dimensions: parseInt(process.env.EMBEDDING_DIMENSIONS || '1024', 10) // BGE模型默认是1024维
};

// 导出服务实例
export const embeddingService = new EmbeddingService(config); 