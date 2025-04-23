// TODO：
// 1.后期希望在构建的专业技能RAG知识库中，来支持简历的智能匹配

interface Skill {
  name: string;
  aliases?: string[];
  relevance: number; // 1-10，表示在Web3领域的重要性
  description?: string;
}

/**
 * Web3技能数据库 - 按类别组织的Web3相关技能
 */
export const web3Skills: Record<string, Skill[]> = {
  // 区块链核心技术
  blockchain: [
    {
      name: 'Solidity',
      aliases: ['智能合约编程语言', 'ETH编程语言'],
      relevance: 10,
      description: '以太坊智能合约开发的主要编程语言'
    },
    {
      name: 'Rust',
      aliases: ['Substrate开发'],
      relevance: 9,
      description: '用于开发高性能区块链和智能合约的系统编程语言'
    },
    {
      name: 'Go',
      aliases: ['Golang'],
      relevance: 8,
      description: '许多区块链节点和协议的开发语言'
    },
    {
      name: 'EVM',
      aliases: ['以太坊虚拟机', 'Ethereum Virtual Machine'],
      relevance: 9,
      description: '以太坊智能合约的运行环境'
    },
    {
      name: 'Consensus Mechanisms',
      aliases: ['共识机制', 'PoW', 'PoS', '权益证明', '工作量证明'],
      relevance: 8,
      description: '区块链网络达成共识的算法机制'
    },
    {
      name: 'Smart Contracts',
      aliases: ['智能合约', '自动执行合约'],
      relevance: 10,
      description: '在区块链上自动执行的程序'
    },
    {
      name: 'Cryptography',
      aliases: ['密码学', '加密算法', '数字签名'],
      relevance: 8,
      description: '保障区块链安全的密码学原理和技术'
    },
    {
      name: 'Gas Optimization',
      aliases: ['gas优化', '以太坊费用优化'],
      relevance: 9,
      description: '优化智能合约以降低交易费用'
    },
    {
      name: 'Chain Development',
      aliases: ['公链开发', '区块链开发'],
      relevance: 9,
      description: '开发区块链协议和网络'
    },
    {
      name: 'Layer 2',
      aliases: ['二层扩容', 'L2', 'Rollups', 'State Channels'],
      relevance: 9,
      description: '构建在主链之上的扩容解决方案'
    }
  ],
  
  // Web3生态相关技术
  web3: [
    {
      name: 'Web3.js',
      aliases: ['以太坊JavaScript API'],
      relevance: 8,
      description: '与以太坊区块链交互的JavaScript库'
    },
    {
      name: 'Ethers.js',
      aliases: ['ethers'],
      relevance: 9,
      description: '完整的以太坊库和钱包实现'
    },
    {
      name: 'Hardhat',
      aliases: ['以太坊开发环境'],
      relevance: 9,
      description: '以太坊智能合约开发工具'
    },
    {
      name: 'Truffle',
      aliases: ['松露框架'],
      relevance: 7,
      description: '智能合约开发框架'
    },
    {
      name: 'Remix',
      aliases: ['Remix IDE'],
      relevance: 6,
      description: '基于浏览器的Solidity IDE'
    },
    {
      name: 'MetaMask',
      aliases: ['小狐狸钱包', '以太坊钱包'],
      relevance: 7,
      description: '流行的以太坊浏览器钱包'
    },
    {
      name: 'IPFS',
      aliases: ['星际文件系统', '分布式存储'],
      relevance: 8,
      description: '分布式文件存储系统'
    },
    {
      name: 'The Graph',
      aliases: ['Graph Protocol', '区块链数据索引'],
      relevance: 8,
      description: '区块链数据索引协议'
    },
    {
      name: 'Substrate',
      aliases: ['波卡开发框架'],
      relevance: 8,
      description: 'Polkadot生态的区块链开发框架'
    },
    {
      name: 'WalletConnect',
      aliases: ['钱包连接协议'],
      relevance: 7,
      description: '开源协议，用于连接去中心化应用和钱包'
    }
  ],
  
  // DeFi相关技能
  defi: [
    {
      name: 'AMM',
      aliases: ['自动做市商', 'Automated Market Maker'],
      relevance: 8,
      description: '自动化交易协议'
    },
    {
      name: 'Yield Farming',
      aliases: ['流动性挖矿', '收益耕作'],
      relevance: 7,
      description: '通过提供流动性获取收益的策略'
    },
    {
      name: 'Lending Protocols',
      aliases: ['借贷协议', 'DeFi借贷'],
      relevance: 8,
      description: '去中心化金融中的借贷平台'
    },
    {
      name: 'DEX',
      aliases: ['去中心化交易所'],
      relevance: 9,
      description: '点对点交易加密资产的平台'
    },
    {
      name: 'Staking',
      aliases: ['质押', '权益质押'],
      relevance: 7,
      description: '锁定加密资产参与网络验证并获得奖励'
    },
    {
      name: 'Liquidity Pools',
      aliases: ['流动性池'],
      relevance: 8,
      description: 'DeFi中用户锁定资产的资金池'
    },
    {
      name: 'Oracles',
      aliases: ['预言机', '链下数据服务'],
      relevance: 8,
      description: '为区块链提供外部数据的服务'
    },
    {
      name: 'Synthetic Assets',
      aliases: ['合成资产'],
      relevance: 7,
      description: '追踪其他资产价值的代币'
    },
    {
      name: 'Flash Loans',
      aliases: ['闪电贷'],
      relevance: 6,
      description: '无抵押借贷，在单个交易中完成借贷'
    },
    {
      name: 'Impermanent Loss',
      aliases: ['无常损失'],
      relevance: 7,
      description: '流动性提供者因资产价格变化可能面临的损失'
    }
  ],
  
  // NFT相关技能
  nft: [
    {
      name: 'ERC-721',
      aliases: ['非同质化代币标准'],
      relevance: 9,
      description: '以太坊上的非同质化代币标准'
    },
    {
      name: 'ERC-1155',
      aliases: ['多代币标准'],
      relevance: 8,
      description: '同时支持同质化和非同质化代币的标准'
    },
    {
      name: 'NFT Marketplaces',
      aliases: ['NFT交易市场', 'NFT平台'],
      relevance: 7,
      description: 'NFT买卖和拍卖的平台'
    },
    {
      name: 'Metadata',
      aliases: ['元数据', 'NFT元数据'],
      relevance: 7,
      description: 'NFT的描述性数据'
    },
    {
      name: 'Digital Art',
      aliases: ['数字艺术', 'NFT艺术'],
      relevance: 6,
      description: '区块链上的数字艺术作品'
    },
    {
      name: 'Gaming NFTs',
      aliases: ['游戏NFT', '区块链游戏资产'],
      relevance: 7,
      description: '游戏中的NFT资产'
    },
    {
      name: 'NFT Royalties',
      aliases: ['版税', '创作者收益'],
      relevance: 6,
      description: 'NFT二次销售时原创作者获得的收益'
    }
  ],
  
  // DAO治理相关技能
  dao: [
    {
      name: 'Governance',
      aliases: ['治理', '链上治理'],
      relevance: 8,
      description: '去中心化组织的决策机制'
    },
    {
      name: 'Voting Systems',
      aliases: ['投票系统', '链上投票', '治理投票'],
      relevance: 7,
      description: 'DAO中的投票协议'
    },
    {
      name: 'Treasury Management',
      aliases: ['财库管理', 'DAO资金管理'],
      relevance: 7,
      description: '管理DAO资产的策略和工具'
    },
    {
      name: 'Tokenomics',
      aliases: ['代币经济学', '通证经济'],
      relevance: 8,
      description: '代币供应、分配和激励设计'
    },
    {
      name: 'Quadratic Voting',
      aliases: ['二次方投票'],
      relevance: 6,
      description: '基于偏好强度的投票系统'
    },
    {
      name: 'Multisig',
      aliases: ['多重签名', '多签钱包'],
      relevance: 8,
      description: '需要多个密钥持有者授权的钱包'
    }
  ],
  
  // 常见编程语言和Web开发技能
  programming: [
    {
      name: 'JavaScript',
      aliases: ['JS'],
      relevance: 7,
      description: 'Web开发的主要语言'
    },
    {
      name: 'TypeScript',
      aliases: ['TS'],
      relevance: 8,
      description: 'JavaScript的超集，具有类型系统'
    },
    {
      name: 'React',
      aliases: ['React.js'],
      relevance: 7,
      description: '流行的前端JavaScript库'
    },
    {
      name: 'Node.js',
      aliases: ['Node'],
      relevance: 7,
      description: '服务器端JavaScript运行环境'
    },
    {
      name: 'Python',
      aliases: ['py'],
      relevance: 6,
      description: '多用途编程语言，常用于区块链分析'
    },
    {
      name: 'RESTful API',
      aliases: ['REST', 'API'],
      relevance: 6,
      description: 'Web服务设计风格'
    },
    {
      name: 'GraphQL',
      aliases: ['GQL'],
      relevance: 7,
      description: 'API查询语言和运行时'
    }
  ]
}; 