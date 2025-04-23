import { embedText, mockEmbedding, simplifiedEmbedding } from './embeddings';
import { isServer } from './utils';

/**
 * 嵌入服务API接口
 * 这个接口可以在客户端导入和使用，但会确保只在服务器端执行嵌入操作
 */

/**
 * 客户端安全的嵌入文本接口
 * 如果在客户端调用，将通过API请求服务器获取嵌入向量
 * 如果在服务器调用，将使用实际的OpenAI API
 * 
 * @param text 要嵌入的文本
 * @returns 嵌入向量结果
 */
export async function embedTextSafe(text: string): Promise<{
  embedding: number[];
  source: 'api' | 'mock' | 'simplified';
}> {
  try {
    // 检查是否在服务器端运行
    if (!isServer()) {
      console.warn('在客户端调用了嵌入接口，将通过API请求获取嵌入向量');
      
      // 客户端环境下，调用服务器API获取嵌入向量
      try {
        const response = await fetch('/api/embeddings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text })
        });
        
        if (!response.ok) {
          throw new Error(`服务器返回错误: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.embedding) {
          return {
            embedding: data.embedding,
            source: data.source || 'api'
          };
        }
        
        throw new Error('服务器响应格式无效');
      } catch (apiError) {
        console.error('API调用失败，使用本地模拟嵌入', apiError);
        // API调用失败，回退到模拟嵌入
        return {
          embedding: mockEmbedding(text),
          source: 'mock'
        };
      }
    }
    
    // 在服务器端运行，直接使用真实API
    const embedding = await embedText(text);
    return {
      embedding,
      source: 'api'
    };
  } catch (error) {
    console.error('嵌入生成失败，使用替代方法', error);
    return {
      embedding: simplifiedEmbedding(text),
      source: 'simplified'
    };
  }
}

/**
 * 创建嵌入服务API路由处理函数
 * 可以在Next.js API路由中使用
 * 
 * 使用示例:
 * ```
 * // app/api/embeddings/route.ts
 * import { createEmbeddingAPI } from 'web3-rag';
 * 
 * export const POST = createEmbeddingAPI();
 * ```
 */
export function createEmbeddingAPI() {
  return async (req: Request) => {
    try {
      // 检查是否在服务器端运行
      if (!isServer()) {
        return new Response(
          JSON.stringify({ error: '此API只能在服务器端调用' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // 解析请求体
      const body = await req.json();
      const { text } = body;
      
      if (!text || typeof text !== 'string') {
        return new Response(
          JSON.stringify({ error: '请求缺少有效的文本字段' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // 生成嵌入向量
      const { embedding, source } = await embedTextSafe(text);
      
      // 返回结果
      return new Response(
        JSON.stringify({ 
          success: true, 
          embedding, 
          source,
          dimension: embedding.length
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('嵌入API错误:', error);
      return new Response(
        JSON.stringify({ 
          error: '处理嵌入请求时发生错误', 
          message: error instanceof Error ? error.message : String(error)
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
} 