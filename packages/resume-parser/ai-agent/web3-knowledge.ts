// 移除 web3-rag 导入并创建本地 KnowledgeManager 类
// import { Web3KnowledgeManager } from 'web3-rag';

/**
 * 简单的知识库管理器接口
 */
class KnowledgeManager {
  private knowledgeBase: any = null;

  /**
   * 创建知识库
   */
  createKnowledgeBase(name: string): any {
    return {
      name,
      skills: [],
      version: '1.0',
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * 加载知识库
   */
  loadKnowledgeBase(knowledgeBase: any): void {
    this.knowledgeBase = knowledgeBase;
  }

  /**
   * 获取知识上下文
   */
  async getKnowledgeContext(query: string, limit: number = 3): Promise<string> {
    // 简单实现，实际应用中可以通过API调用web3-rag服务
    return `Web3相关知识: ${query}\n\n这里应该包含从知识库中检索的内容。`;
  }
  
  /**
   * 从文本中提取技能
   * 简单实现，返回硬编码的Web3技能列表
   */
  async extractSkillsFromText(text: string): Promise<string[]> {
    const web3Keywords = [
      'blockchain', 'ethereum', 'bitcoin', 'solidity', 'smart contract',
      'web3', 'defi', 'nft', 'dao', 'token', 'crypto', 'cryptocurrency'
    ];
    
    const lowerText = text.toLowerCase();
    return web3Keywords.filter(keyword => lowerText.includes(keyword));
  }
  
  /**
   * 获取技能知识
   */
  getSkillKnowledge(skillName: string): any {
    // 简单实现，返回基本技能信息
    const web3Skills: Record<string, any> = {
      'blockchain': {
        name: 'Blockchain',
        description: '区块链是一种分布式账本技术',
        category: 'core',
        relatedSkills: ['cryptocurrency', 'smart contracts']
      },
      'ethereum': {
        name: 'Ethereum',
        description: '以太坊是一个开源的区块链平台',
        category: 'platform',
        relatedSkills: ['solidity', 'smart contracts', 'web3.js']
      },
      'solidity': {
        name: 'Solidity',
        description: 'Solidity是以太坊智能合约的编程语言',
        category: 'language',
        relatedSkills: ['ethereum', 'smart contracts']
      }
    };
    
    return web3Skills[skillName.toLowerCase()] || null;
  }
}

// 全局单例知识库管理器
let knowledgeManagerInstance: KnowledgeManager | null = null;

/**
 * 初始化并获取Web3知识库管理器实例
 */
export function getWeb3KnowledgeManager(): KnowledgeManager {
  if (!knowledgeManagerInstance) {
    // 创建知识库管理器实例
    knowledgeManagerInstance = new KnowledgeManager();
  }
  return knowledgeManagerInstance;
}

/**
 * 设置Web3知识库，替代原来的setupKAGKnowledgeBase
 * 加载和处理知识文档，创建向量索引
 */
export function setupWeb3KnowledgeBase(): void {
  try {
    // 使用知识库管理器初始化知识库
    const manager = getWeb3KnowledgeManager();
    manager.loadKnowledgeBase(manager.createKnowledgeBase('Web3技能知识库'));
    console.log('Web3知识库初始化成功');
  } catch (error) {
    console.error('初始化Web3知识库失败:', error);
  }
}

/**
 * 使用RAG检索增强，根据简历内容找出相关的Web3知识
 * @param resumeData - 简历数据
 * @returns 检索到的相关上下文
 */
export async function retrieveRelevantKnowledge(resumeData: any): Promise<string> {
  try {
    // 从简历数据中提取关键内容作为查询
    const skills = resumeData.skills || [];
    const workExperience = resumeData.workExperience || [];
    const projects = resumeData.projects || [];
    
    // 构建查询文本
    let queryText = "";
    
    // 添加技能关键词
    if (skills.length > 0) {
      queryText += "技能: " + skills.join(", ") + ". ";
    }
    
    // 添加工作经验关键词
    workExperience.forEach((exp: any) => {
      if (exp.technologies && exp.technologies.length > 0) {
        queryText += `工作技术: ${exp.technologies.join(", ")}. `;
      }
      if (exp.description) {
        // 提取描述中的关键短语
        queryText += extractKeyPhrases(exp.description);
      }
    });
    
    // 添加项目关键词
    projects.forEach((project: any) => {
      if (project.technologies && project.technologies.length > 0) {
        queryText += `项目技术: ${project.technologies.join(", ")}. `;
      }
      if (project.description) {
        queryText += extractKeyPhrases(project.description);
      }
    });
    
    // 确保查询文本不为空
    if (!queryText.trim()) {
      queryText = "Web3 blockchain skills";
    }
    
    // 执行RAG查询
    const results = await queryWeb3Knowledge(queryText, 5);
    
    // 整合检索结果作为上下文
    let context = "以下是关于Web3和区块链技能的相关知识：\n\n";
    results.forEach(result => {
      context += result.text + "\n\n";
    });
    
    return context;
  } catch (error) {
    console.error('检索Web3知识时出错:', error);
    return "无法检索相关Web3知识。";
  }
}

/**
 * 根据关键词从知识库中检索相关内容
 */
export async function queryWeb3Knowledge(
  query: string,
  limit: number = 3
): Promise<Array<{text: string; similarity: number}>> {
  try {
    const knowledgeManager = getWeb3KnowledgeManager();
    
    // 使用知识库管理器的getKnowledgeContext方法
    const context = await knowledgeManager.getKnowledgeContext(query, limit);
    
    // 将结果转换为统一格式
    const lines = context.split('\n\n').filter(line => line.trim().length > 0);
    return lines.map(line => ({
      text: line,
      similarity: 0.8 // 由于我们没有明确的相似度，使用固定值
    }));
  } catch (error) {
    console.error('查询知识库失败:', error);
    return [];
  }
}

/**
 * 从文本中提取关键短语，用于构建查询
 */
function extractKeyPhrases(text: string): string {
  // 简单实现：查找一些Web3关键词
  const web3Keywords = [
    'blockchain', 'ethereum', 'bitcoin', 'solidity', 'smart contract',
    'web3', 'defi', 'nft', 'dao', 'token', 'crypto', 'cryptocurrency',
    'wallet', 'metamask', 'ledger', 'consensus', 'mining', 'node',
    'truffle', 'hardhat', 'ganache', 'dapp', 'decentralized', 'ipfs',
    'filecoin', 'polkadot', 'chainlink', 'oracles', 'ethers.js', 'web3.js'
  ];
  
  const normalizedText = text.toLowerCase();
  const foundKeywords = web3Keywords.filter(keyword => 
    normalizedText.includes(keyword.toLowerCase())
  );
  
  return foundKeywords.length > 0 ? `关键词: ${foundKeywords.join(", ")}. ` : '';
} 