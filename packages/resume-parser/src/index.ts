import OpenAI from "openai";

// 定义简历分析的接口类型
export interface ResumeAnalysis {
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

// 分析简历内容
export const analyzeResume = async (content: string, apiKey: string): Promise<ResumeAnalysis> => {
  try {
    console.log('analyzeResume: 内容长度:', content.length);
    
    // 如果内容太长，进行截断以避免超出token限制
    const truncatedContent = content.length > 12000 
      ? content.substring(0, 12000) + "...(内容已截断)"
      : content;
    
    const client = createOpenAIClient(apiKey);
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

// 判断内容是否与Web3相关的辅助函数
export const isWeb3Related = (text: string): boolean => {
  if (!text) return false;
  
  const web3Keywords = [
    'blockchain', '区块链', 'crypto', '加密货币', 'web3', 'smart contract', '智能合约',
    'ethereum', '以太坊', 'bitcoin', '比特币', 'solidity', 'nft', 'defi', '去中心化金融',
    'dao', 'token', '代币', 'wallet', '钱包', 'dapp', 'consensus', '共识机制'
  ];
  
  const lowerText = text.toLowerCase();
  return web3Keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
}; 