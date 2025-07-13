// Web3 RAG (Retrieval Augmented Generation) Module
// Main exports for the Web3 knowledge base and related functionality

// Export the knowledge manager
export { Web3KnowledgeManager } from './knowledge-manager';

// Export types
export * from './types';

// Export embedding functions
export { embedText, mockEmbedding, simplifiedEmbedding } from './embeddings';

// Export Web3 resume evaluator
export { Web3ResumeEvaluator } from './resume-evaluator';

// Export the Web3 skills data and functions
export { 
  web3KnowledgeData,
  setupWeb3KnowledgeBase,
  queryRelevantSkills,
  extractWeb3Skills
} from './knowledge-data';

import { createClient } from '@supabase/supabase-js';
import OpenAI from "openai";

import { mockEmbedding, simplifiedEmbedding } from './embeddings';

/**
 * 判断技能或关键词是否与Web3相关
 * @param text 要检查的文本
 * @returns 是否与Web3相关
 */
export function isWeb3Related(text: string): boolean {
  const web3Keywords = [
    'blockchain', 'ethereum', 'bitcoin', 'solidity', 'smart contract',
    'web3', 'defi', 'nft', 'dao', 'token', 'crypto', 'cryptocurrency',
    'wallet', 'metamask', 'ledger', 'consensus', 'mining', 'node',
    'truffle', 'hardhat', 'ganache', 'dapp', 'decentralized', 'ipfs',
    'filecoin', 'polkadot', 'chainlink', 'oracles', 'ethers.js', 'web3.js'
  ];
  
  const lowerText = text.toLowerCase();
  return web3Keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
}

/**
 * 生成文本的向量嵌入
 * @param text 要生成向量的文本
 * @param apiKey OpenAI API密钥
 * @returns 文本的向量表示
 */
export async function generateEmbedding(text: string, apiKey?: string): Promise<number[]> {
  if (!text || text.trim() === "") {
    console.warn("文本为空，返回零向量");
    // 返回一个默认的1536维向量，包含一些微小的随机值
    return Array(1536)
      .fill(0)
      .map(() => Math.random() * 0.00001);
  }

  // 最大重试次数
  const maxRetries = 3;
  let error: any = null;

  // 首先尝试使用OpenAI API生成向量
  try {
    console.log('尝试使用OpenAI API生成向量');
    const openai = createOpenAIClient(apiKey || process.env.OPENROUTER_API_KEY || "");
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",  // 使用返回1536维的模型
      input: text,
      encoding_format: "float",
    });

    if (response && response.data && response.data.length > 0) {
      const embedding = response.data[0].embedding;
      console.log('使用OpenAI API成功生成向量');
      
      // 确认维度是否正确
      if (embedding.length !== 1536) {
        console.warn(`生成的向量维度不符合要求：期望1536，实际${embedding.length}`);
        // 转换向量维度到1536
        return resizeVector(embedding, 1536);
      }
      
      return embedding;
    } else {
      console.error('OpenAI API返回格式不正确');
    }
  } catch (err) {
    error = err;
    console.error('使用OpenAI API生成向量失败:', err);
  }

  // 如果OpenAI API失败，尝试使用Supabase Edge Function
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`尝试使用Supabase Edge Function生成向量 (尝试 ${attempt}/${maxRetries})`);
        
        // 使用环境变量中的URL
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        // 确认URL和密钥存在
        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error('Supabase URL或匿名密钥未配置');
        }
        
        // DNS预解析检查
        try {
          const urlObj = new URL(supabaseUrl);
          console.log(`使用Supabase域名: ${urlObj.hostname}`);
        } catch (urlErr) {
          console.error('Supabase URL格式错误:', urlErr);
          throw new Error('Supabase URL格式错误');
        }
        
        const response = await fetch(`${supabaseUrl}/functions/v1/blockRecruitEmbed`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`
          },
          body: JSON.stringify({ input: text }),
        });

        if (!response.ok) {
          throw new Error(`Supabase Edge Function返回错误: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data && data.embedding) {
          // 检查是否是零向量
          const isZeroVector = data.embedding.every((val: number) => val === 0);
          if (isZeroVector) {
            console.warn(`返回的是零向量，尝试其他方法`);
            continue;
          }

          console.log(`成功生成向量`);
          
          // 确认向量维度
          if (data.embedding.length !== 1536) {
            console.warn(`Supabase返回的向量维度不符合要求：期望1536，实际${data.embedding.length}`);
            return resizeVector(data.embedding, 1536);
          }
          
          return data.embedding;
        }
      } catch (err) {
        console.error(`使用Supabase Edge Function生成向量失败:`, err);
        error = err;
        
        // 如果不是最后一次尝试，继续重试
        if (attempt < maxRetries) {
          console.log(`将在1秒后重试 (${attempt}/${maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
  }

  // 如果远程方法都失败，尝试使用本地方法
  try {
    console.log('尝试使用简单相似性向量生成方法');
    const simplifiedVector = simplifiedEmbedding(text);
    // 确保是1536维
    if (simplifiedVector.length !== 1536) {
      return resizeVector(simplifiedVector, 1536);
    }
    return simplifiedVector;
  } catch (err) {
    console.error('简单相似性向量生成失败:', err);
  }

  // 如果简单相似性方法失败，尝试使用mock方法
  try {
    console.log("尝试使用本地模拟向量方法");
    return mockEmbedding(text);
  } catch (err) {
    console.error("本地模拟向量生成失败:", err);
  }

  // 如果所有方法都失败，返回一个默认的随机微小向量
  console.error("所有向量生成尝试均失败，返回默认随机微小向量", error);
  return Array(1536)
    .fill(0)
    .map(() => Math.random() * 0.00001);
}

/**
 * 调整向量维度
 * @param vector 原始向量
 * @param targetDimension 目标维度
 * @returns 调整后的向量
 */
function resizeVector(vector: number[], targetDimension: number): number[] {
  if (vector.length === targetDimension) {
    return vector;
  }

  const resized = new Array(targetDimension).fill(0);
  
  if (vector.length > targetDimension) {
    // 如果原始向量更大，则取前targetDimension个元素
    for (let i = 0; i < targetDimension; i++) {
      resized[i] = vector[i];
    }
  } else {
    // 如果原始向量更小，则复制原始向量并填充剩余部分
    for (let i = 0; i < vector.length; i++) {
      resized[i] = vector[i];
    }
    
    // 剩余部分使用微小随机值填充
    for (let i = vector.length; i < targetDimension; i++) {
      resized[i] = Math.random() * 0.00001;
    }
  }
  
  // 重新归一化向量
  const magnitude = Math.sqrt(resized.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    return resized.map(val => val / magnitude);
  }
  
  return resized;
}

/**
 * 创建OpenAI客户端
 * @param apiKey API密钥
 * @returns OpenAI客户端实例
 */
function createOpenAIClient(apiKey: string) {
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: apiKey,
    defaultHeaders: {
      "HTTP-Referer": "https://blockrecruitmentapp.com",
      "X-Title": "BlockRecruit",
    },
  });
}

/**
 * 计算余弦相似度
 * @param vectorA 向量A
 * @param vectorB 向量B
 * @returns 相似度得分
 */
export function calculateCosineSimilarity(vectorA: number[], vectorB: number[]): number {
  if (!vectorA || !vectorB || vectorA.length !== vectorB.length) {
    console.warn("向量长度不匹配或为空");
    return 0;
  }

  try {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      normA += vectorA[i] * vectorA[i];
      normB += vectorB[i] * vectorB[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) {
      return 0;
    }

    const similarity = dotProduct / (normA * normB);
    return similarity;
  } catch (error) {
    console.error("计算相似度时出错:", error);
    return 0;
  }
}

// 向量存储相关功能
export async function storeJobVectors(jobId: string, jobVectors: any) {
  try {
    // 实现向量存储逻辑
    const supabase = createSupabaseClient();
    
    const { error } = await supabase
      .from('job_vectors')
      .upsert({
        job_id: jobId,
        description_vector: jobVectors.description,
        requirements_vector: jobVectors.requirements,
        responsibilities_vector: jobVectors.responsibilities,
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('存储岗位向量失败:', error);
    throw error;
  }
}

export async function storeResumeVectors(resumeId: string, resumeVectors: any) {
  try {
    // 验证向量类型和长度
    const validateVector = (vector: any) => {
      if (!vector || !Array.isArray(vector)) {
        console.warn('向量不是数组类型，使用空数组替代');
        return [];
      }
      return vector;
    };

    // 实现向量存储逻辑
    const supabase = createSupabaseClient();
    
    // 确保所有向量字段都是数组
    const skillsVector = validateVector(resumeVectors.skills);
    const experienceVector = validateVector(resumeVectors.experience);
    const web3Vector = validateVector(resumeVectors.web3);
    
    const { error } = await supabase
      .from('resume_vectors')
      .upsert({
        resume_id: resumeId,
        skills_vector: skillsVector,
        experience_vector: experienceVector,
        web3_vector: web3Vector,
        created_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Supabase upsert错误:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('存储简历向量失败:', error);
    // 不要抛出错误，以便应用可以继续运行
    return false;
  }
}

export async function fetchJobVectors(jobId: string) {
  try {
    // 实现获取向量逻辑
    const supabase = createSupabaseClient();
    
    const { data, error } = await supabase
      .from('job_vectors')
      .select('description_vector, requirements_vector, responsibilities_vector')
      .eq('job_id', jobId)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return {
        description: [],
        requirements: [],
        responsibilities: []
      };
    }
    
    return {
      description: data.description_vector,
      requirements: data.requirements_vector,
      responsibilities: data.responsibilities_vector
    };
  } catch (error) {
    console.error('获取岗位向量失败:', error);
    return {
      description: [],
      requirements: [],
      responsibilities: []
    };
  }
}

export async function fetchResumeVectors(resumeId: string) {
  try {
    // 实现获取向量逻辑
    const supabase = createSupabaseClient();
    
    const { data, error } = await supabase
      .from('resume_vectors')
      .select('skills_vector, experience_vector, web3_vector')
      .eq('resume_id', resumeId)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return {
        skills: [],
        experience: [],
        web3: []
      };
    }
    
    return {
      skills: data.skills_vector,
      experience: data.experience_vector,
      web3: data.web3_vector
    };
  } catch (error) {
    console.error('获取简历向量失败:', error);
    return {
      skills: [],
      experience: [],
      web3: []
    };
  }
}

// 创建Supabase客户端的功能
function createSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// 将简历分析结果转换为向量
export async function generateResumeVectors(analysis: any, resumeId: string) {
  try {
    // 类型定义
    type ResumeVectorsType = {
      skills: number[];
      experience: number[];
      web3: number[];
    };
    
    // 初始化向量对象
    const resumeVectors: ResumeVectorsType = {
      skills: [],
      experience: [],
      web3: []
    };
    
    // 提取技能
    const skillsText = analysis.skills ? analysis.skills.join(' ') : '';
    
    // 生成技能向量
    if (skillsText.trim()) {
      const skillsEmbedding = await generateEmbedding(skillsText);
      resumeVectors.skills = skillsEmbedding;
    } else {
      resumeVectors.skills = Array(1536).fill(0);
    }
    
    // 提取工作经验
    const experienceText = analysis.workExperience
      ? analysis.workExperience
        .map((exp: any) => `${exp.position || ''} ${exp.description || ''} ${exp.technologies ? exp.technologies.join(' ') : ''}`)
        .join(' ')
      : '';
    
    // 生成经验向量
    if (experienceText.trim()) {
      const experienceEmbedding = await generateEmbedding(experienceText);
      resumeVectors.experience = experienceEmbedding;
    } else {
      resumeVectors.experience = Array(1536).fill(0);
    }
    
    // 提取Web3相关内容
    const web3Text = [
      skillsText,
      experienceText,
      analysis.projects
        ? analysis.projects
          .map((proj: any) => `${proj.name || ''} ${proj.description || ''} ${proj.technologies ? proj.technologies.join(' ') : ''}`)
          .join(' ')
        : ''
    ]
      .join(' ')
      .split(' ')
      .filter(isWeb3Related)
      .join(' ');
    
    // 生成Web3向量
    if (web3Text.trim()) {
      const web3Embedding = await generateEmbedding(web3Text);
      resumeVectors.web3 = web3Embedding;
    } else {
      resumeVectors.web3 = Array(1536).fill(0);
    }
    
    // 存储向量
    await storeResumeVectors(resumeId, resumeVectors);
    
    return resumeVectors;
  } catch (error) {
    console.error('生成简历向量失败:', error);
    throw error;
  }
} 