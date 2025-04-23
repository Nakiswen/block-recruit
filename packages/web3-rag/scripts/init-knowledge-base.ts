import { Web3KnowledgeManager } from '../src/knowledge-base';

async function main() {
  // 创建知识库管理器
  const knowledgeManager = new Web3KnowledgeManager(process.env.OPENAI_API_KEY);
  
  // 创建Web3知识库
  const knowledgeBase = knowledgeManager.createKnowledgeBase(
    'Web3 Skills Knowledge Base',
    'Web3和区块链相关技能和知识的集合'
  );
  
  console.log(`知识库已创建: ${knowledgeBase.id}`);
  
  // Web3相关知识文本
  const web3Texts = [
    {
      title: 'Solidity基础概念',
      content: `
        Solidity是一种面向对象的高级编程语言，用于实现智能合约。智能合约是在区块链上运行的程序，
        控制数字资产的行为。Solidity受C++、Python和JavaScript影响，专为以太坊虚拟机(EVM)设计。
        
        主要特点:
        - 静态类型
        - 支持继承
        - 库调用
        - 复杂的用户自定义类型
        
        Solidity开发者需要了解合约结构、数据类型、函数、事件、修饰器、错误处理、安全最佳实践等。
        专家级Solidity开发者需精通合约安全性审计、gas优化、高级设计模式和EVM细节。
      `
    },
    {
      title: 'Web3.js与前端开发',
      content: `
        Web3.js是以太坊生态系统中的JavaScript库，允许开发者与以太坊区块链交互。它提供了API来操作
        以太坊对象，如账户、合约、交易等。
        
        核心功能:
        - 连接到以太坊节点
        - 账户管理
        - 智能合约交互
        - 交易创建和发送
        - 事件监听
        
        Web3前端开发者需要掌握JavaScript/TypeScript、React等现代前端框架、MetaMask集成、交易签名、
        状态管理等技能。高级开发者还需了解ENS集成、IPFS存储、多链支持和去中心化身份解决方案。
      `
    },
    {
      title: 'DeFi协议与开发',
      content: `
        去中心化金融(DeFi)是建立在区块链上的金融应用生态系统，无需中央权威或中介机构。DeFi应用包括
        稳定币、借贷平台、去中心化交易所、资产管理工具等。
        
        主要DeFi概念:
        - 自动做市商(AMM)
        - 流动性挖矿
        - 收益聚合
        - 闪电贷
        - 抵押债仓
        
        DeFi开发者需要深入理解金融产品、安全审计、预言机集成、流动性管理和风险控制。专家级DeFi开发者
        还需掌握经济激励机制设计、高效交易执行和复杂金融模型实现。
      `
    },
    {
      title: 'NFT标准与实现',
      content: `
        非同质化代币(NFT)是区块链上唯一的数字资产，可代表艺术品、收藏品、虚拟地产等。主要NFT标准包括
        以太坊的ERC-721和ERC-1155。
        
        NFT开发要点:
        - 元数据设计与存储
        - 铸造机制
        - 版税实现
        - 市场整合
        - 媒体渲染
        
        NFT开发者需掌握合约编写、元数据处理、IPFS/Arweave存储、身份验证和媒体处理。高级NFT开发人员
        还需了解跨链NFT、动态NFT、分数化NFT和大规模铸造优化。
      `
    },
    {
      title: 'DAO治理与实现',
      content: `
        去中心化自治组织(DAO)是由代码执行的规则组织和管理的实体，成员通常持有治理代币参与决策。
        DAO可用于投资、社区管理、协议治理等。
        
        DAO核心组件:
        - 投票系统
        - 提案机制
        - 代币分配
        - 资金管理
        - 争议解决
        
        DAO开发者需掌握治理合约、投票机制、分布式决策、加密经济学和社区激励。专家级DAO开发者还需了解
        二次方投票、代表民主、声誉系统和链下治理协调。
      `
    }
  ];
  
  // 将文本添加到知识库
  console.log('开始添加知识到知识库...');
  
  for (const text of web3Texts) {
    console.log(`添加: ${text.title}`);
    await knowledgeManager.addToKnowledgeBase(
      knowledgeBase.id,
      text.content,
      { title: text.title }
    );
  }
  
  console.log('知识库初始化完成!');
  
  // 测试查询
  const testQueries = [
    'solidity',
    'web3.js',
    'defi',
    'nft',
    'dao'
  ];
  
  console.log('\n测试知识库查询:');
  
  for (const query of testQueries) {
    console.log(`\n查询: "${query}"`);
    const results = await knowledgeManager.queryKnowledgeBase(knowledgeBase.id, query, 1);
    
    if (results.length > 0) {
      console.log(`相似度: ${results[0].similarity.toFixed(4)}`);
      console.log(`结果: ${results[0].text.substring(0, 100)}...`);
    } else {
      console.log('未找到相关结果');
    }
  }
}

// 执行主函数
main().catch(error => {
  console.error('初始化知识库失败:', error);
  process.exit(1);
}); 