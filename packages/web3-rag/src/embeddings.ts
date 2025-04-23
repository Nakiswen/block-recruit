import axios from 'axios';
import { serverOnly } from './utils';

/**
 * 使用OpenAI API为文本生成嵌入向量
 * 此函数只能在服务器端调用
 * @param text 待嵌入的文本
 * @returns 嵌入向量
 */
export async function embedText(text: string): Promise<number[]> {
  // 使用serverOnly工具函数强制确保此函数只在服务器端执行
  return serverOnly(async () => {
    try {
      // 使用环境变量的API密钥
      const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      if (!apiKey) {
        console.warn('Missing OpenAI API key, falling back to mock embeddings');
        return mockEmbedding(text);
      }

      const response = await axios.post(
        'https://api.openai.com/v1/embeddings',
        {
          input: text,
          model: 'text-embedding-3-small'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          }
        }
      );

      return response.data.data[0].embedding;
    } catch (error) {
      console.error('Error generating embeddings:', error);
      // 出错时回退到模拟嵌入
      return mockEmbedding(text);
    }
  }, 'OpenAI嵌入API只能在服务器端调用，请确保通过服务器API请求使用此功能');
}

/**
 * 模拟嵌入生成（用于客户端或API调用失败时）
 * @param text 待嵌入的文本
 * @returns 模拟的嵌入向量
 */
export function mockEmbedding(text: string): number[] {
  // 创建一个固定长度的向量（实际项目中不要使用这种方法）
  const dimension = 32;
  const embedding = new Array(dimension).fill(0);
  
  // 使用简单的哈希算法为文本生成一些值
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    embedding[i % dimension] += charCode / 100;
  }
  
  // 归一化向量
  const magnitude = Math.sqrt(
    embedding.reduce((sum, val) => sum + val * val, 0)
  );
  
  return embedding.map(val => val / magnitude);
}

/**
 * 简单的字符串哈希函数
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }
  return hash;
}

/**
 * 替代的嵌入方法（当无法使用OpenAI API时）
 * 这是一个简单的基于词频的嵌入方法
 * @param text 待嵌入的文本
 * @returns 简化的嵌入向量
 */
export function simplifiedEmbedding(text: string): number[] {
  // 简单的词频向量（仅用于演示，生产环境应使用更高质量的嵌入）
  const words = text.toLowerCase().split(/\W+/).filter(word => word.length > 0);
  const wordFreq: Record<string, number> = {};
  
  // 计算词频
  for (const word of words) {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  }
  
  // 创建固定维度的向量（使用哈希函数将词映射到索引）
  const dimension = 128;
  const embedding = new Array(dimension).fill(0);
  
  Object.entries(wordFreq).forEach(([word, freq]) => {
    // 使用简单的哈希将单词映射到向量的索引
    const index = Math.abs(hashCode(word) % dimension);
    embedding[index] += freq;
  });
  
  // 归一化向量
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    return embedding.map(val => val / magnitude);
  }
  
  return embedding;
} 