import OpenAI from "openai";
import {
  fetchJobVectors,
  storeJobVectors,
  storeResumeVectors,
  fetchResumeVectors,
  calculateCosineSimilarity,
} from "./vector-store";
import { OpenAIStream, StreamingTextResponse, createStreamableUI } from 'ai';
import { Configuration, OpenAIApi } from 'openai-edge';
import { JD_ANALYSIS_PROMPT } from './prompts';
import { convertTextToEmbedding, createSupabaseClient } from './vector-store';

// 获取API密钥，优先使用请求中的API密钥
function getApiKey(headers?: Headers) {
  // 如果提供了headers，尝试从中获取API密钥
  const apiKey =
    headers?.get("x-api-key") || process.env.OPENROUTER_API_KEY || "";
  return apiKey;
}

// 创建OpenAI客户端
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

// 获取OpenAI客户端，用于generateEmbedding函数
function getOpenAIClient() {
  const apiKey = process.env.OPENROUTER_API_KEY || "";
  return createOpenAIClient(apiKey);
}

// 分析岗位JD
export async function analyzejobDescription(
  description: string,
  headers?: Headers
) {
  // 获取API密钥并创建客户端
  const apiKey = getApiKey(headers);
  const client = createOpenAIClient(apiKey);

  const response = await client.chat.completions.create({
    model: "openai/gpt-4o",
    messages: [
      {
        role: "system",
        content: `你是一个专业的Web3人才招聘助手。请分析以下岗位JD，提取关键信息：
        1. 必备技能和经验要求
        2. 加分项技能和经验
        3. 职责描述
        4. Web3相关的特殊要求
        请以结构化JSON格式返回，包含以下字段：requiredSkills(数组), preferredSkills(数组), responsibilities(数组), web3Requirements(数组)。确保返回的是有效的JSON字符串。`,
      },
      {
        role: "user",
        content: description,
      },
    ],
    response_format: { type: "json_object" }, // 强制要求返回JSON格式
  });

  try {
    const content = response.choices[0].message.content || "{}";
    // 简单验证返回的内容是否为JSON格式
    if (!content.trim().startsWith("{")) {
      console.error("API返回的不是有效JSON:", content);
      // 返回默认结构，避免解析错误
      return {
        requiredSkills: [],
        preferredSkills: [],
        responsibilities: [],
        web3Requirements: [],
      };
    }
    return JSON.parse(content);
  } catch (error) {
    console.error(
      "解析JSON失败:",
      error,
      "原始内容:",
      response.choices[0].message.content
    );
    // 返回默认结构，避免解析错误
    return {
      requiredSkills: [],
      preferredSkills: [],
      responsibilities: [],
      web3Requirements: [],
    };
  }
}

/**
 * 生成文本的向量嵌入
 * @param text 要生成向量的文本
 * @returns 文本的向量表示
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!text || text.trim() === "") {
    console.warn("文本为空，返回零向量");
    // 返回一个默认的384维向量(gte-small维度)，包含一些微小的随机值
    return Array(384)
      .fill(0)
      .map(() => Math.random() * 0.00001);
  }

  // 最大重试次数
  const maxRetries = 3;

  // 首先尝试使用Supabase Edge Function
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`尝试使用Supabase Edge Function生成向量 (尝试 ${attempt}/${maxRetries})`);
      
      // 使用已部署的Edge Function URL
      const response = await fetch('https://nfatjlpggedmnaqckwtt.supabase.co/functions/v1/blockRecruitEmbed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
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
        return data.embedding;
      }
    } catch (error) {
      console.error(`使用Supabase Edge Function生成向量失败:`, error);
      
      // 如果不是最后一次尝试，继续重试
      if (attempt < maxRetries) {
        console.log(`将在1秒后重试 (${attempt}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  // 如果Supabase Edge Function方法全部失败，尝试使用OpenAI API
  try {
    console.log('尝试使用OpenAI API生成向量');
    const openai = getOpenAIClient();
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",  // 使用OpenAI的模型作为备选
      input: text,
      encoding_format: "float",
    });

    if (response && response.data && response.data.length > 0) {
      const embedding = response.data[0].embedding;
      console.log('使用OpenAI API成功生成向量');
      return embedding;
    } else {
      console.error('OpenAI API返回格式不正确');
    }
  } catch (error) {
    console.error('使用OpenAI API生成向量失败:', error);
  }

  // 如果所有方法都失败，返回一个默认的随机微小向量
  console.error("所有向量生成尝试均失败，返回默认随机微小向量");
  return Array(384)
    .fill(0)
    .map(() => Math.random() * 0.00001);
}

// 生成岗位向量
export async function generateJobVectors(
  parsedJD: any,
  jobId: string,
  headers?: Headers
) {
  try {
    const {
      requiredSkills,
      preferredSkills,
      responsibilities,
      web3Requirements,
    } = parsedJD;

    // 为不同维度生成向量
    const descriptionVector = await generateEmbedding(
      [requiredSkills, preferredSkills, web3Requirements].flat().join(" ")
    );
    const requirementsVector = await generateEmbedding(
      [requiredSkills, preferredSkills].flat().join(" ")
    );
    const responsibilitiesVector = await generateEmbedding(
      responsibilities.join(" ")
    );

    // 构造向量对象
    const jobVectors = {
      description: descriptionVector,
      requirements: requirementsVector,
      responsibilities: responsibilitiesVector,
    };

    // 存储向量到Supabase
    await storeJobVectors(jobId, jobVectors);

    // 返回结构化向量
    return jobVectors;
  } catch (error) {
    console.error("生成岗位向量失败:", error);
    throw error;
  }
}

// 计算匹配度和评分
export async function calculateMatchingScore(
  resumeVectors: any,
  job: any,
  headers?: Headers
) {
  try {
    // 从Supabase获取岗位向量
    const jobVectors = await fetchJobVectors(job.id);

    // 检查是否获取到了有效的向量数据
    if (
      !jobVectors.description.length ||
      !jobVectors.requirements.length ||
      !jobVectors.responsibilities.length
    ) {
      console.warn("无法获取完整的岗位向量数据");
    }

    // 计算各维度相似度
    const scores = {
      skillScore: calculateCosineSimilarity(
        resumeVectors.skills,
        jobVectors.requirements
      ),
      experienceScore: calculateCosineSimilarity(
        resumeVectors.experience,
        jobVectors.responsibilities
      ),
      web3Score: calculateCosineSimilarity(
        resumeVectors.web3,
        jobVectors.description
      ),
    };

    // 根据权重计算总分
    const totalScore =
      (scores.skillScore * job.weights.skills +
        scores.experienceScore * job.weights.experience +
        scores.web3Score * job.weights.web3) /
      (job.weights.skills + job.weights.experience + job.weights.web3);

    // 生成匹配点和建议
    const { matchingPoints, suggestions } = await generateMatchingAnalysis(
      job,
      scores,
      totalScore,
      headers
    );

    return {
      totalScore,
      skillScore: scores.skillScore,
      experienceScore: scores.experienceScore,
      web3Score: scores.web3Score,
      matchingPoints,
      suggestions,
    };
  } catch (error) {
    console.error("计算匹配度失败:", error);
    throw error;
  }
}

// 生成匹配分析
async function generateMatchingAnalysis(
  job: any,
  scores: any,
  totalScore: number,
  headers?: Headers
) {
  // 获取API密钥并创建客户端
  const apiKey = getApiKey(headers);
  const client = createOpenAIClient(apiKey);

  const response = await client.chat.completions.create({
    model: "openai/gpt-4o",
    messages: [
      {
        role: "system",
        content: `作为Web3人才匹配分析师，请根据以下匹配结果生成分析报告：
        1. 列出主要匹配点
        2. 提供具体的改进建议
        请以结构化JSON格式返回，包含matchingPoints和suggestions两个数组字段。确保返回的是有效的JSON字符串。`,
      },
      {
        role: "user",
        content: JSON.stringify({
          jobRequirements: job.parsedRequirements,
          scores,
          totalScore,
        }),
      },
    ],
    response_format: { type: "json_object" }, // 强制要求返回JSON格式
  });

  try {
    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("解析JSON失败:", error);
    // 返回默认结构，避免解析错误
    return {
      matchingPoints: [],
      suggestions: [],
    };
  }
}

// 定义简历分析的接口类型
interface ResumeAnalysis {
  skills: string[];
  projects: {
    name: string;
    description: string;
    [key: string]: any;
  }[];
  workExperience: {
    title: string;
    company: string;
    description: string;
    [key: string]: any;
  }[];
  education: {
    institution: string;
    degree: string;
    field?: string;
    [key: string]: any;
  }[];
}

// 定义简历向量的接口类型
interface ResumeVectors {
  skills: number[];
  experience: number[];
  web3: number[];
}

// 分析简历内容
export const analyzeResume = async (content: string): Promise<ResumeAnalysis> => {
  try {
    console.log('analyzeResume: 内容长度:', content.length);
    
    // 如果内容太长，进行截断以避免超出token限制
    const truncatedContent = content.length > 12000 
      ? content.substring(0, 12000) + "...(内容已截断)"
      : content;
    
    const client = createOpenAIClient(getApiKey());
    const response = await client.chat.completions.create({
      model: "anthropic/claude-3.7-sonnet",
      messages: [
        {
          role: "system",
          content: `你是一个专业的Web3人才简历分析师。请分析以下简历内容，提取关键信息：
          1. 技术技能列表
          2. 项目经验（特别关注Web3相关项目）
          3. 工作经历
          4. 教育背景
          请直接以JSON格式返回，包含以下字段：skills(数组), projects(对象数组), workExperience(对象数组), education(对象数组)。
          不要使用markdown标记，直接返回原始JSON数据。`
        },
        {
          role: "user",
          content: truncatedContent
        }
      ],
      response_format: { type: "json_object" } // 强制要求返回JSON格式
    });
    
    console.log('analyzeResume: API响应状态码:', response.model, response.object);
    
    // 清理响应内容中的markdown格式
    let cleanedContent = response.choices[0].message.content;
    if (cleanedContent) {
      // 去除可能的markdown代码块标记
      cleanedContent = cleanedContent.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
      
      try {
        // 尝试解析JSON
        const analysis = JSON.parse(cleanedContent) as ResumeAnalysis;
        return analysis;
      } catch (parseError) {
        console.error('JSON解析错误:', parseError);
        console.error('尝试解析的内容:', cleanedContent);
        throw new Error('简历分析结果解析失败');
      }
    } else {
      throw new Error('API返回的内容为空');
    }
  } catch (error) {
    console.error('简历分析过程发生错误:', error);
    throw new Error('简历分析失败');
  }
};

// 生成简历向量
export const generateResumeVectors = async (content: string, resumeId: string): Promise<ResumeVectors> => {
  try {
    // 先分析简历内容
    const analysis = await analyzeResume(content);
    
    // 准备存储向量的对象
    const resumeVectors: ResumeVectors = {
      skills: [],
      experience: [],
      web3: []
    };
    
    // 生成技能向量
    if (analysis.skills && analysis.skills.length > 0) {
      const skillsText = analysis.skills.join(", ");
      const skillsEmbedding = await generateEmbedding(skillsText);
      resumeVectors.skills = skillsEmbedding;
    }
    
    // 生成工作经验向量
    if (analysis.workExperience && analysis.workExperience.length > 0) {
      const experienceText = analysis.workExperience
        .map((exp) => `${exp.title} at ${exp.company}: ${exp.description}`)
        .join("\n");
      const experienceEmbedding = await generateEmbedding(experienceText);
      resumeVectors.experience = experienceEmbedding;
    }
    
    // 生成Web3相关内容向量
    const web3Content: string[] = [];
    if (analysis.skills) {
      const web3Skills = analysis.skills.filter((skill: string) => 
        isWeb3Related(skill)
      );
      if (web3Skills.length > 0) {
        web3Content.push(`Web3 Skills: ${web3Skills.join(", ")}`);
      }
    }
    
    if (analysis.projects) {
      const web3Projects = analysis.projects.filter((project) => 
        isWeb3Related(project.name) || isWeb3Related(project.description)
      );
      if (web3Projects.length > 0) {
        const projectsText = web3Projects
          .map((project) => `${project.name}: ${project.description}`)
          .join("\n");
        web3Content.push(`Web3 Projects: ${projectsText}`);
      }
    }
    
    if (web3Content.length > 0) {
      const web3Text = web3Content.join("\n");
      const web3Embedding = await generateEmbedding(web3Text);
      resumeVectors.web3 = web3Embedding;
    }
    
    // 将向量存储到Supabase
    await storeResumeVectors(resumeId, resumeVectors);
    
    return resumeVectors;
  } catch (error) {
    console.error('生成简历向量过程中发生错误:', error);
    throw new Error('生成简历向量失败');
  }
};

// 判断内容是否与Web3相关的辅助函数
const isWeb3Related = (text: string): boolean => {
  if (!text) return false;
  
  const web3Keywords = [
    'blockchain', '区块链', 'crypto', '加密货币', 'web3', 'smart contract', '智能合约',
    'ethereum', '以太坊', 'bitcoin', '比特币', 'solidity', 'nft', 'defi', '去中心化金融',
    'dao', 'token', '代币', 'wallet', '钱包', 'dapp', 'consensus', '共识机制'
  ];
  
  const lowerText = text.toLowerCase();
  return web3Keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
};
