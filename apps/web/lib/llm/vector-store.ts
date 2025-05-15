import { createClient } from '@supabase/supabase-js';

// 获取Supabase客户端实例
function getSupabaseClient() {
  // 获取环境变量，提供默认值防止报错
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example-key';
  
  // 验证环境变量存在（开发环境可使用默认值）
  if (process.env.NODE_ENV === 'production' && (!supabaseUrl || !supabaseKey)) {
    throw new Error('缺少Supabase配置环境变量');
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

/**
 * 将岗位向量存储到Supabase
 *
 * @param jobId 岗位ID
 * @param vectors 向量数据，包含skills、responsibilities和web3向量
 * @returns 操作结果
 */
export async function storeJobVectors(jobId: string, vectors: {
  description: number[];
  requirements: number[];
  responsibilities: number[];
}) {
  try {
    const supabase = getSupabaseClient();
    
    // 存储职位向量数据
    const { error } = await supabase
      .from('job_vectors')
      .upsert({
        job_id: jobId,
        description_vector: vectors.description,
        requirements_vector: vectors.requirements,
        responsibilities_vector: vectors.responsibilities,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'job_id'
      });
    
    if (error) {
      console.error('存储职位向量失败:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('存储职位向量出错:', error);
    throw error;
  }
}

/**
 * 从Supabase获取岗位向量
 *
 * @param jobId 岗位ID
 * @returns 各种类型的向量
 */
export async function fetchJobVectors(jobId: string) {
  try {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('job_vectors')
      .select('description_vector, requirements_vector, responsibilities_vector')
      .eq('job_id', jobId)
      .single();
    
    if (error) {
      console.error('获取职位向量失败:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error(`未找到职位ID:${jobId}的向量数据`);
    }
    
    // 返回格式化的向量数据
    return {
      description: data.description_vector as number[],
      requirements: data.requirements_vector as number[],
      responsibilities: data.responsibilities_vector as number[]
    };
  } catch (error) {
    console.error('获取职位向量出错:', error);
    throw error;
  }
}

/**
 * 计算向量相似度
 * 
 * @param queryVector 查询向量
 * @param jobId 岗位ID
 * @param vectorType 向量类型（skills, responsibilities 或 web3）
 * @param threshold 相似度阈值
 * @returns 相似度结果
 */
export async function findSimilarVectors(
  queryVector: number[],
  jobId: string,
  vectorType: string,
  threshold: number = 0.7
) {
  try {
    const supabase = getSupabaseClient();
    
    // 调用数据库函数进行相似度查询
    const { data, error } = await supabase.rpc('match_job_vectors', {
      query_embedding: queryVector,
      job_id: jobId,
      vector_type: vectorType,
      match_threshold: threshold,
      match_count: 1 // 我们只需要最相似的一个向量
    });
    
    if (error) {
      console.error('向量相似度查询失败:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('查找相似向量失败:', error);
    throw error;
  }
}

/**
 * 删除与岗位相关的向量
 * 
 * @param jobId 岗位ID
 * @returns 操作结果
 */
export async function deleteJobVectors(jobId: string) {
  try {
    const supabase = getSupabaseClient();
    
    const { error } = await supabase
      .from('job_vectors')
      .delete()
      .eq('job_id', jobId);
    
    if (error) {
      console.error('删除向量失败:', error);
      throw error;
    }
    
    console.log(`成功删除岗位ID为${jobId}的向量数据`);
    return true;
  } catch (error) {
    console.error('删除向量失败:', error);
    throw error;
  }
}

// 存储简历向量到Supabase
export async function storeResumeVectors(resumeId: string, vectors: {
  skills: number[];
  experience: number[];
  web3: number[];
}) {
  try {
    const supabase = getSupabaseClient();
    
    // 存储简历向量数据
    const { error } = await supabase
      .from('resume_vectors')
      .upsert({
        resume_id: resumeId,
        skills_vector: vectors.skills,
        experience_vector: vectors.experience,
        web3_vector: vectors.web3,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'resume_id'
      });
    
    if (error) {
      console.error('存储简历向量失败:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('存储简历向量出错:', error);
    throw error;
  }
}

// 从Supabase获取简历向量
export async function fetchResumeVectors(resumeId: string) {
  try {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('resume_vectors')
      .select('skills_vector, experience_vector, web3_vector')
      .eq('resume_id', resumeId)
      .single();
    
    if (error) {
      console.error('获取简历向量失败:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error(`未找到简历ID:${resumeId}的向量数据`);
    }
    
    // 返回格式化的向量数据
    return {
      skills: data.skills_vector as number[],
      experience: data.experience_vector as number[],
      web3: data.web3_vector as number[]
    };
  } catch (error) {
    console.error('获取简历向量出错:', error);
    throw error;
  }
}

// 计算两个向量之间的余弦相似度
export function calculateCosineSimilarity(vectorA: number[], vectorB: number[]) {
  if (!vectorA || !vectorB || vectorA.length !== vectorB.length) {
    throw new Error('向量无效或长度不匹配');
  }
  
  // 计算点积
  const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);
  
  // 计算向量大小
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0));
  
  // 检查向量大小是否为0
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }
  
  // 计算余弦相似度
  return dotProduct / (magnitudeA * magnitudeB);
} 