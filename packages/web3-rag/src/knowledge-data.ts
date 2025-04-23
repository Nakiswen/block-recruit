import { Web3KnowledgeBase, Web3Skill } from './types';
import { embedText } from './embeddings';

/**
 * Web3知识库预设
 */
export const web3KnowledgeData: Web3KnowledgeBase = {
  name: 'Web3技能知识库',
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  skills: [
    {
      name: 'Solidity',
      description: 'Solidity是一种面向合约的、为实现智能合约而创建的高级编程语言。它的设计目标是针对以太坊虚拟机(EVM)，是最流行的智能合约开发语言。',
      category: '智能合约开发',
      relatedTechnologies: ['Ethereum', 'Binance Smart Chain', 'EVM', 'Remix', 'Truffle', 'Hardhat'],
    },
    {
      name: 'Web3.js',
      description: 'Web3.js是一个JavaScript库，允许开发者与以太坊区块链交互。它可以用于前端应用程序，允许用户查询区块链数据、发送交易和与智能合约交互。',
      category: '前端开发',
      relatedTechnologies: ['JavaScript', 'Ethereum', 'MetaMask', 'React', 'Vue.js'],
    },
    {
      name: 'Ethers.js',
      description: 'Ethers.js是一个完整而紧凑的开源库，用于与以太坊区块链及其生态系统进行交互。相比Web3.js，它更轻量、更安全、更模块化。',
      category: '前端开发',
      relatedTechnologies: ['JavaScript', 'TypeScript', 'Ethereum', 'React', 'Vue.js'],
    },
    {
      name: 'Hardhat',
      description: 'Hardhat是一个以太坊开发环境，用于编译、部署、测试和调试以太坊软件。它内置了Hardhat Network，一个为开发而设计的本地以太坊网络。',
      category: '开发工具',
      relatedTechnologies: ['Ethereum', 'Solidity', 'JavaScript', 'TypeScript', 'Node.js'],
    },
    {
      name: 'Truffle',
      description: 'Truffle是一个开发环境、测试框架和资产管道，用于基于以太坊的区块链开发。它提供了合约编译、链接、部署和二进制管理的功能。',
      category: '开发工具',
      relatedTechnologies: ['Ethereum', 'Solidity', 'JavaScript', 'Ganache'],
    },
    {
      name: 'MetaMask',
      description: 'MetaMask是一个浏览器扩展和移动应用，充当以太坊钱包和网关，允许用户与去中心化应用(dApps)交互，而无需运行完整的以太坊节点。',
      category: '钱包与交互',
      relatedTechnologies: ['Ethereum', 'Web3.js', 'Ethers.js', 'DApps'],
    },
    {
      name: 'IPFS',
      description: 'IPFS(InterPlanetary File System)是一种点对点的分布式文件系统，旨在使网络更快、更安全、更开放。在Web3开发中常用于存储不可变的、去中心化的内容。',
      category: '去中心化存储',
      relatedTechnologies: ['Filecoin', 'NFT', 'Pinata', 'Infura'],
    },
    {
      name: 'NFT开发',
      description: 'NFT(非同质化代币)开发涉及创建和管理遵循ERC-721或ERC-1155等标准的唯一数字资产。这些资产可以代表艺术品、收藏品、游戏内物品等。',
      category: '区块链应用',
      relatedTechnologies: ['Solidity', 'ERC-721', 'ERC-1155', 'OpenSea', 'IPFS'],
    },
    {
      name: 'DeFi开发',
      description: 'DeFi(去中心化金融)开发涉及构建不依赖传统中心化金融中介的金融应用。这包括借贷平台、去中心化交易所、稳定币等。',
      category: '区块链应用',
      relatedTechnologies: ['Solidity', 'Uniswap', 'Aave', 'Compound', 'MakerDAO'],
    },
    {
      name: 'Rust',
      description: 'Rust是一种系统编程语言，在Web3领域用于开发高性能的区块链节点、智能合约(如用于Solana)和其他需要安全性和性能的组件。',
      category: '区块链开发',
      relatedTechnologies: ['Solana', 'Near', 'Polkadot', 'WebAssembly'],
    },
    {
      name: 'Polkadot',
      description: 'Polkadot是一个多链网络，允许不同的区块链在安全的、信任最小化的环境中进行互操作。开发者可以创建自定义区块链(称为平行链)并将其连接到Polkadot网络。',
      category: '区块链平台',
      relatedTechnologies: ['Substrate', 'Rust', 'Kusama', 'Parachains'],
    },
    {
      name: 'ZK-Rollups',
      description: 'ZK-Rollups是一种第2层扩展解决方案，通过将多个交易捆绑成一个零知识证明，从而提高以太坊等区块链的吞吐量。这允许更高的交易吞吐量和更低的费用。',
      category: '扩展解决方案',
      relatedTechnologies: ['zkSync', 'StarkNet', 'Polygon zkEVM', 'Zero-Knowledge Proofs'],
    },
    {
      name: 'DAO开发',
      description: 'DAO(去中心化自治组织)开发涉及创建能够自主运行、由代码控制的组织，其治理规则通过智能合约实施，决策通过成员投票做出。',
      category: '区块链应用',
      relatedTechnologies: ['Solidity', 'Aragon', 'Compound Governance', 'Snapshot'],
    },
    {
      name: 'Remix IDE',
      description: 'Remix IDE是一个开源的Web和桌面应用程序，用于以太坊智能合约开发。它集成了编译、部署、事务调试和测试功能，特别适合Solidity开发。',
      category: '开发工具',
      relatedTechnologies: ['Solidity', 'Ethereum', 'JavaScript', 'Web3.js'],
    },
  ]
};

/**
 * 设置Web3知识库
 */
export function setupWeb3KnowledgeBase(): Web3KnowledgeBase {
  return web3KnowledgeData;
}

/**
 * 计算两个向量间的余弦相似度
 * @param a 向量a
 * @param b 向量b
 * @returns 相似度得分 (0-1)
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('向量维度不匹配');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * 查询Web3知识库以找到与文本最相关的技能
 * @param text 待分析文本
 * @param knowledgeBase 知识库
 * @param similarityThreshold 相似度阈值 (默认0.7)
 * @returns 匹配到的技能列表
 */
export async function queryRelevantSkills(text: string, knowledgeBase: Web3KnowledgeBase, similarityThreshold: number = 0.7): Promise<Web3Skill[]> {
  if (!text || !knowledgeBase?.skills?.length) {
    return [];
  }

  const textEmbedding = await embedText(text);
  const relevantSkills: Web3Skill[] = [];

  for (const skill of knowledgeBase.skills) {
    // 合并技能名称和描述以创建更丰富的上下文
    const skillText = `${skill.name} ${skill.description || ''} ${(skill.relatedTechnologies || []).join(' ')}`;
    const skillEmbedding = await embedText(skillText);
    
    const similarity = cosineSimilarity(textEmbedding, skillEmbedding);
    
    if (similarity >= similarityThreshold) {
      relevantSkills.push(skill);
    }
  }

  return relevantSkills;
}

/**
 * 从简历文本中提取Web3技能
 * @param resumeText 简历文本
 * @param knowledgeBase 知识库
 * @returns 提取到的技能列表
 */
export async function extractWeb3Skills(resumeText: string, knowledgeBase: Web3KnowledgeBase): Promise<Web3Skill[]> {
  if (!resumeText || !knowledgeBase?.skills?.length) {
    return [];
  }

  // 基础关键词检查
  const basicMatches = knowledgeBase.skills.filter(skill => {
    const regex = new RegExp(`\\b${skill.name}\\b`, 'i');
    return regex.test(resumeText);
  });

  // 如果基础检查发现匹配，立即返回
  if (basicMatches.length > 0) {
    return basicMatches;
  }

  // 使用语义搜索查找相关技能
  return await queryRelevantSkills(resumeText, knowledgeBase, 0.75);
} 