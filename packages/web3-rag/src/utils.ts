import { v4 as uuidv4 } from 'uuid';
import { EmbeddingResult, SkillInfo } from './types';

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return uuidv4();
}

/**
 * 计算文本的相似度分数（简化版）
 * 实际项目中应使用更复杂的向量相似度计算
 */
export function calculateSimilarity(text1: string, text2: string): number {
  // 简化的相似度计算（实际项目中使用向量余弦相似度计算）
  const normalizedText1 = text1.toLowerCase();
  const normalizedText2 = text2.toLowerCase();
  
  const words1 = new Set(normalizedText1.split(/\s+/));
  const words2 = new Set(normalizedText2.split(/\s+/));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

/**
 * 提取Web3相关技能关键词
 */
export function extractWeb3Skills(text: string): string[] {
  // Web3相关技能的关键词列表
  const web3Keywords = [
    'blockchain', 'ethereum', 'bitcoin', 'solidity', 'smart contract',
    'web3', 'defi', 'nft', 'dao', 'token', 'crypto', 'cryptocurrency',
    'wallet', 'metamask', 'ledger', 'consensus', 'mining', 'node',
    'truffle', 'hardhat', 'ganache', 'dapp', 'decentralized', 'ipfs',
    'filecoin', 'polkadot', 'chainlink', 'oracles', 'ethers.js', 'web3.js'
  ];
  
  const normalizedText = text.toLowerCase();
  return web3Keywords.filter(keyword => normalizedText.includes(keyword.toLowerCase()));
}

/**
 * 将文本分块用于向量索引
 */
export function chunkText(text: string, size: number = 1000, overlap: number = 200): string[] {
  // 防止无限循环
  if (size <= overlap) {
    throw new Error('Chunk size must be greater than overlap');
  }
  
  const chunks: string[] = [];
  let startIndex = 0;
  
  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + size, text.length);
    chunks.push(text.substring(startIndex, endIndex));
    startIndex += (size - overlap);
  }
  
  return chunks;
}

/**
 * Web3技能分类辅助函数
 */
export function categorizeWeb3Skill(skill: string): 'blockchain' | 'web3' | 'defi' | 'nft' | 'dao' | 'programming' | 'other' {
  const skill_lower = skill.toLowerCase();
  
  if (['ethereum', 'bitcoin', 'consensus', 'mining', 'node', 'blockchain'].some(k => skill_lower.includes(k))) {
    return 'blockchain';
  } else if (['web3', 'web3.js', 'ethers.js', 'dapp'].some(k => skill_lower.includes(k))) {
    return 'web3';
  } else if (['defi', 'lending', 'yield', 'swap', 'amm', 'uniswap'].some(k => skill_lower.includes(k))) {
    return 'defi';
  } else if (['nft', 'erc721', 'erc1155', 'collectible'].some(k => skill_lower.includes(k))) {
    return 'nft';
  } else if (['dao', 'governance', 'voting'].some(k => skill_lower.includes(k))) {
    return 'dao';
  } else if (['javascript', 'typescript', 'rust', 'go', 'solidity', 'react', 'python'].some(k => skill_lower.includes(k))) {
    return 'programming';
  }
  
  return 'other';
}

/**
 * 推断技能水平
 */
export function inferSkillLevel(context: string, skill: string): 'beginner' | 'intermediate' | 'expert' | undefined {
  const context_lower = context.toLowerCase();
  const experienceIndicators = {
    expert: ['expert', 'advanced', 'senior', 'lead', '5+ years', 'extensive experience', 'deep knowledge'],
    intermediate: ['intermediate', 'proficient', 'experienced', '2+ years', '3+ years', 'familiar with'],
    beginner: ['beginner', 'basic', 'entry', 'junior', 'learning', 'started', 'introduction']
  };
  
  if (experienceIndicators.expert.some(ind => context_lower.includes(ind))) {
    return 'expert';
  } else if (experienceIndicators.intermediate.some(ind => context_lower.includes(ind))) {
    return 'intermediate';
  } else if (experienceIndicators.beginner.some(ind => context_lower.includes(ind))) {
    return 'beginner';
  }
  
  return undefined;
}

/**
 * 检查当前代码是否在服务器端运行
 * @returns 如果在服务器端运行则返回true，否则返回false
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * 在服务器端执行函数，如果是客户端则抛出错误
 * @param fn 要执行的函数
 * @param errorMessage 如果在客户端调用时显示的错误消息
 * @returns 函数的返回值
 */
export function serverOnly<T>(fn: () => T, errorMessage = '此函数只能在服务器端调用'): T {
  if (!isServer()) {
    throw new Error(errorMessage);
  }
  return fn();
} 