/**
 * 技能匹配器
 * 负责技能精确匹配和语义补充
 */

import { skillNormalizer } from './skillNormalizer.js';

/**
 * 技能匹配结果
 */
export interface SkillMatchResult {
  matchScore: number; // 匹配分数 (0-1)
  matchedSkills: string[]; // 匹配的技能
  missingSkills: string[]; // 缺失的技能
  matchRatio: number; // 匹配比例
}

/**
 * 语义匹配结果
 */
export interface SemanticMatchResult {
  semanticBonus: number; // 语义补充加分
  semanticMatches: Array<{
    resumeSkill: string;
    jobSkill: string;
    similarity: number;
  }>;
}

/**
 * 语义技能组 - 完整版
 * 同一组内的技能被认为是语义相关的
 */
export const SEMANTIC_SKILL_GROUPS: Record<string, string[]> = {
  // ==================== 前端开发 ====================
  前端开发: [
    'React',
    'Vue',
    'Angular',
    'Next.js',
    'Nuxt.js',
    'Svelte',
    'SolidJS',
    'TypeScript',
    'JavaScript',
    'HTML',
    'CSS',
    'SCSS',
    'Less',
    'TailwindCSS',
    'Styled Components',
    'Emotion',
    'CSS Modules',
    'Webpack',
    'Vite',
    'Rollup',
    'Parcel',
    'esbuild',
    'Redux',
    'Zustand',
    'Jotai',
    'Recoil',
    'MobX',
    'Pinia',
    'Vuex',
  ],
  前端工程师: [
    'React',
    'Vue',
    'Angular',
    'Next.js',
    'TypeScript',
    'JavaScript',
    'HTML',
    'CSS',
    'TailwindCSS',
    'Webpack',
    'Vite',
    'Git',
  ],
  React开发: [
    'React',
    'Next.js',
    'Redux',
    'React Query',
    'React Router',
    'React Native',
    'TypeScript',
    'JavaScript',
    'Hooks',
    'Context API',
  ],
  Vue开发: [
    'Vue',
    'Nuxt.js',
    'Vuex',
    'Pinia',
    'Vue Router',
    'Composition API',
    'TypeScript',
    'JavaScript',
    'Vue3',
    'Vue2',
  ],
  Angular开发: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'Angular Material'],
  前端架构师: [
    'React',
    'Vue',
    'TypeScript',
    'Webpack',
    'Micro Frontend',
    'Performance Optimization',
    'Design System',
    'Module Federation',
  ],

  // ==================== 后端开发 ====================
  后端开发: [
    'Node.js',
    'Python',
    'Java',
    'Go',
    'Rust',
    'C++',
    'C#',
    'PHP',
    'Ruby',
    'Express',
    'Koa',
    'NestJS',
    'Fastify',
    'FastAPI',
    'Django',
    'Flask',
    'Spring',
    'Spring Boot',
    'PostgreSQL',
    'MySQL',
    'MongoDB',
    'Redis',
    'Elasticsearch',
    'REST API',
    'GraphQL',
    'gRPC',
    'WebSocket',
  ],
  后端工程师: [
    'Node.js',
    'Python',
    'Java',
    'Go',
    'Rust',
    'PostgreSQL',
    'MySQL',
    'MongoDB',
    'Redis',
    'Docker',
    'Kubernetes',
    'REST API',
    'GraphQL',
    'Microservices',
  ],
  'Node.js开发': [
    'Node.js',
    'Express',
    'Koa',
    'NestJS',
    'Fastify',
    'TypeScript',
    'JavaScript',
    'MongoDB',
    'PostgreSQL',
    'Redis',
    'npm',
    'yarn',
  ],
  Python开发: [
    'Python',
    'Django',
    'FastAPI',
    'Flask',
    'Celery',
    'PostgreSQL',
    'Redis',
    'SQLAlchemy',
    'asyncio',
    'pip',
  ],
  Java开发: [
    'Java',
    'Spring',
    'Spring Boot',
    'Spring Cloud',
    'Maven',
    'Gradle',
    'MySQL',
    'Redis',
    'MyBatis',
    'JPA',
    'Hibernate',
  ],
  Go开发: ['Go', 'Golang', 'Gin', 'Echo', 'gRPC', 'PostgreSQL', 'Redis', 'Kafka'],
  Rust开发: ['Rust', 'Tokio', 'Actix', 'Axum', 'WebAssembly', 'WASM', 'Cargo'],
  PHP开发: ['PHP', 'Laravel', 'Symfony', 'MySQL', 'Redis', 'Composer'],
  后端架构师: [
    'Microservices',
    'DDD',
    'Event Sourcing',
    'CQRS',
    'Distributed Systems',
    'High Availability',
    'System Design',
    'Load Balancing',
  ],

  // ==================== 全栈开发 ====================
  全栈开发: [
    'React',
    'Vue',
    'Next.js',
    'Node.js',
    'Python',
    'TypeScript',
    'JavaScript',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'Docker',
    'AWS',
    'REST API',
    'GraphQL',
  ],
  全栈工程师: [
    'React',
    'Vue',
    'Next.js',
    'Node.js',
    'Python',
    'TypeScript',
    'PostgreSQL',
    'MongoDB',
    'Docker',
    'Kubernetes',
    'CI/CD',
  ],

  // ==================== 区块链/Web3开发 ====================
  智能合约开发: [
    'Solidity',
    'Vyper',
    'Hardhat',
    'Foundry',
    'Truffle',
    'Brownie',
    'Remix',
    'Ethereum',
    'Smart Contract',
    'ERC-20',
    'ERC-721',
    'ERC-1155',
    'ERC-4626',
    'OpenZeppelin',
    'Slither',
    'Mythril',
    'Echidna',
    'Certora',
    'Gas Optimization',
    'Proxy Pattern',
    'Upgradeable Contract',
  ],
  Web3开发: [
    'Solidity',
    'Ethers.js',
    'Web3.js',
    'Wagmi',
    'Viem',
    'RainbowKit',
    'Smart Contract',
    'Ethereum',
    'DeFi',
    'NFT',
    'DAO',
    'Tokenomics',
    'Hardhat',
    'Foundry',
    'IPFS',
    'The Graph',
    'Chainlink',
    'Alchemy',
    'Infura',
  ],
  DeFi开发: [
    'Solidity',
    'DeFi',
    'Smart Contract',
    'Tokenomics',
    'Ethereum',
    'Uniswap',
    'Aave',
    'Compound',
    'Curve',
    'Balancer',
    'MakerDAO',
    'AMM',
    'Yield Farming',
    'Liquidity Mining',
    'Flash Loan',
    'Lending Protocol',
    'Staking',
    'Governance',
    'Oracle',
    'Chainlink',
  ],
  区块链工程师: [
    'Solidity',
    'Rust',
    'Go',
    'C++',
    'Ethereum',
    'Solana',
    'Polkadot',
    'Cosmos',
    'Smart Contract',
    'Consensus',
    'P2P',
    'Cryptography',
    'Zero Knowledge',
    'Layer 2',
    'Rollup',
    'Bridge',
    'Cross-chain',
  ],
  Solana开发: ['Rust', 'Solana', 'Anchor', 'SPL Token', 'Metaplex', 'Serum', 'Raydium'],
  Move开发: ['Move', 'Aptos', 'Sui', 'Smart Contract'],
  Substrate开发: ['Rust', 'Substrate', 'Polkadot', 'Parachain', 'FRAME'],
  NFT开发: ['Solidity', 'ERC-721', 'ERC-1155', 'IPFS', 'Metadata', 'Marketplace', 'Royalty'],
  DAO开发: ['Solidity', 'Governance', 'Voting', 'Treasury', 'Snapshot', 'Aragon'],

  // ==================== DevOps/基础设施 ====================
  DevOps工程师: [
    'Docker',
    'Kubernetes',
    'AWS',
    'GCP',
    'Azure',
    'Terraform',
    'Pulumi',
    'Ansible',
    'Chef',
    'Puppet',
    'Jenkins',
    'GitHub Actions',
    'GitLab CI',
    'CircleCI',
    'Prometheus',
    'Grafana',
    'ELK',
    'Datadog',
    'Linux',
    'Bash',
    'Python',
  ],
  SRE工程师: [
    'Kubernetes',
    'Docker',
    'AWS',
    'GCP',
    'Terraform',
    'Prometheus',
    'Grafana',
    'PagerDuty',
    'Linux',
    'Python',
    'Go',
    'Incident Management',
    'SLO',
    'SLI',
    'Error Budget',
  ],
  云架构师: [
    'AWS',
    'GCP',
    'Azure',
    'Kubernetes',
    'Docker',
    'Terraform',
    'Serverless',
    'Lambda',
    'Cloud Functions',
    'Microservices',
    'Service Mesh',
    'Istio',
  ],
  运维工程师: [
    'Linux',
    'Shell',
    'Bash',
    'Python',
    'Ansible',
    'Docker',
    'Nginx',
    'HAProxy',
    'MySQL',
    'Redis',
    'Monitoring',
    'Zabbix',
  ],
  平台工程师: [
    'Kubernetes',
    'Docker',
    'Terraform',
    'ArgoCD',
    'Helm',
    'Platform Engineering',
    'Internal Developer Platform',
    'GitOps',
  ],

  // ==================== 数据/AI ====================
  数据工程师: [
    'Python',
    'SQL',
    'Spark',
    'Flink',
    'Kafka',
    'Airflow',
    'Dagster',
    'PostgreSQL',
    'BigQuery',
    'Snowflake',
    'Redshift',
    'Databricks',
    'ETL',
    'ELT',
    'Data Pipeline',
    'Data Warehouse',
    'Data Lake',
  ],
  数据分析师: [
    'SQL',
    'Python',
    'R',
    'Excel',
    'Tableau',
    'Power BI',
    'Looker',
    'Data Analysis',
    'Statistics',
    'A/B Testing',
    'Data Visualization',
  ],
  机器学习工程师: [
    'Python',
    'TensorFlow',
    'PyTorch',
    'Scikit-learn',
    'Keras',
    'Machine Learning',
    'Deep Learning',
    'NLP',
    'Computer Vision',
    'MLOps',
    'Kubeflow',
    'MLflow',
    'Feature Engineering',
  ],
  AI工程师: [
    'Python',
    'Machine Learning',
    'Deep Learning',
    'LLM',
    'GPT',
    'BERT',
    'TensorFlow',
    'PyTorch',
    'Langchain',
    'LlamaIndex',
    'RAG',
    'Prompt Engineering',
    'Fine-tuning',
    'Vector Database',
  ],
  算法工程师: [
    'Python',
    'C++',
    'Algorithm',
    'Data Structure',
    'Machine Learning',
    'Recommendation System',
    'Search Engine',
    'NLP',
    'Computer Vision',
  ],
  NLP工程师: [
    'Python',
    'NLP',
    'BERT',
    'GPT',
    'Transformer',
    'Hugging Face',
    'Text Classification',
    'Named Entity Recognition',
    'Sentiment Analysis',
  ],

  // ==================== 移动开发 ====================
  iOS开发: [
    'Swift',
    'SwiftUI',
    'Objective-C',
    'Xcode',
    'iOS',
    'UIKit',
    'Core Data',
    'Combine',
    'RxSwift',
    'CocoaPods',
  ],
  Android开发: [
    'Kotlin',
    'Java',
    'Android',
    'Jetpack Compose',
    'Android Studio',
    'Room',
    'Retrofit',
    'Coroutines',
    'Gradle',
  ],
  移动开发: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android', 'Mobile Development'],
  'React Native开发': [
    'React Native',
    'JavaScript',
    'TypeScript',
    'iOS',
    'Android',
    'Expo',
    'Redux',
  ],
  Flutter开发: ['Flutter', 'Dart', 'iOS', 'Android', 'Bloc', 'Provider', 'GetX'],
  跨平台开发: ['React Native', 'Flutter', 'Ionic', 'Capacitor', 'Electron'],

  // ==================== 安全 ====================
  安全工程师: [
    'Security Audit',
    'Penetration Testing',
    'Vulnerability Assessment',
    'OWASP',
    'Burp Suite',
    'Nmap',
    'Metasploit',
    'Cryptography',
    'SSL/TLS',
  ],
  智能合约审计: [
    'Solidity',
    'Security Audit',
    'Slither',
    'Mythril',
    'Echidna',
    'Manticore',
    'Formal Verification',
    'Smart Contract',
    'Reentrancy',
    'Flash Loan Attack',
    'Access Control',
    'Integer Overflow',
    'Front Running',
  ],
  区块链安全: [
    'Smart Contract Audit',
    'DeFi Security',
    'Bridge Security',
    'MEV',
    'Sandwich Attack',
    'Oracle Manipulation',
    'Governance Attack',
  ],

  // ==================== 产品/设计 ====================
  产品经理: [
    'Product Management',
    'PRD',
    'User Research',
    'Agile',
    'Scrum',
    'Kanban',
    'JIRA',
    'Confluence',
    'Figma',
    'A/B Testing',
    'Data Analysis',
    'User Story',
    'Roadmap',
    'OKR',
    'KPI',
  ],
  Web3产品经理: [
    'Product Management',
    'Web3',
    'DeFi',
    'NFT',
    'DAO',
    'Tokenomics',
    'User Research',
    'PRD',
    'Agile',
    'Crypto Native',
  ],
  UI设计师: [
    'Figma',
    'Sketch',
    'Adobe XD',
    'Photoshop',
    'Illustrator',
    'UI Design',
    'Design System',
    'Component Library',
  ],
  UX设计师: [
    'User Research',
    'UX Design',
    'Figma',
    'Prototyping',
    'Usability Testing',
    'User Journey',
    'Wireframe',
    'Information Architecture',
  ],
  交互设计师: [
    'Interaction Design',
    'Figma',
    'Principle',
    'After Effects',
    'Motion Design',
    'Micro Interaction',
    'Prototyping',
  ],
  视觉设计师: ['Visual Design', 'Photoshop', 'Illustrator', 'Brand Design', 'Graphic Design'],

  // ==================== 运营/市场 ====================
  社区运营: [
    'Community Operation',
    'Discord',
    'Twitter',
    'Telegram',
    'Reddit',
    'Content Operation',
    'Growth Hacking',
    'User Engagement',
    'AMA',
    'Ambassador Program',
  ],
  Web3运营: [
    'Community Operation',
    'Discord',
    'Twitter',
    'Telegram',
    'Airdrop',
    'Token Launch',
    'IDO',
    'Whitelist',
    'NFT Drop',
  ],
  内容运营: [
    'Content Operation',
    'Content Strategy',
    'Copywriting',
    'SEO',
    'Social Media',
    'Blog',
    'Newsletter',
    'Video Content',
  ],
  用户增长: [
    'Growth Hacking',
    'User Acquisition',
    'Retention',
    'Conversion',
    'A/B Testing',
    'Funnel Analysis',
    'Referral Program',
  ],
  市场营销: [
    'Marketing',
    'Digital Marketing',
    'SEO',
    'SEM',
    'Google Ads',
    'Facebook Ads',
    'Social Media Marketing',
    'Content Marketing',
    'Brand Marketing',
    'PR',
    'KOL',
    'Influencer Marketing',
    'Email Marketing',
  ],

  // ==================== 商务/销售 ====================
  商务拓展: [
    'Business Development',
    'Partnership',
    'BD',
    'Negotiation',
    'Client Relationship',
    'Deal Closing',
    'Contract',
  ],
  销售: [
    'Sales',
    'B2B Sales',
    'B2C Sales',
    'Account Management',
    'CRM',
    'Salesforce',
    'Pipeline Management',
    'Quota',
  ],
  投资者关系: [
    'Investor Relations',
    'Fundraising',
    'Pitch Deck',
    'Due Diligence',
    'VC',
    'Angel Investment',
    'Tokenomics',
    'Valuation',
  ],

  // ==================== 测试/QA ====================
  测试工程师: [
    'Testing',
    'QA',
    'Test Automation',
    'Selenium',
    'Cypress',
    'Playwright',
    'Unit Testing',
    'Integration Testing',
    'E2E Testing',
    'Performance Testing',
    'Jest',
    'Mocha',
    'Pytest',
    'JUnit',
  ],
  自动化测试: [
    'Test Automation',
    'Selenium',
    'Cypress',
    'Playwright',
    'Appium',
    'CI/CD',
    'Jenkins',
    'GitHub Actions',
    'Test Framework',
  ],
  性能测试: [
    'Performance Testing',
    'Load Testing',
    'JMeter',
    'Gatling',
    'k6',
    'Stress Testing',
    'Benchmark',
    'Profiling',
  ],
};

/**
 * 构建技能到语义组的反向索引
 */
function buildSkillToGroupIndex(): Map<string, string[]> {
  const index = new Map<string, string[]>();

  for (const [groupName, skills] of Object.entries(SEMANTIC_SKILL_GROUPS)) {
    for (const skill of skills) {
      const normalizedSkill = skill.toLowerCase();
      const groups = index.get(normalizedSkill) || [];
      if (!groups.includes(groupName)) {
        groups.push(groupName);
      }
      index.set(normalizedSkill, groups);
    }
  }

  return index;
}

// 预构建索引
const SKILL_TO_GROUP_INDEX = buildSkillToGroupIndex();

/**
 * 技能匹配器接口
 */
export interface ISkillMatcher {
  exactMatch(resumeSkills: string[], jobSkills: string[]): SkillMatchResult;
  semanticSupplement(
    resumeSkills: string[],
    jobSkills: string[],
    vectorScore: number
  ): SemanticMatchResult;
  findSemanticMatches(
    resumeSkills: string[],
    jobSkills: string[]
  ): Array<{ resumeSkill: string; jobSkill: string; similarity: number }>;
}

/**
 * 技能匹配器实现
 */
export class SkillMatcher implements ISkillMatcher {
  /**
   * 执行技能精确匹配
   * @param resumeSkills 简历技能（已标准化）
   * @param jobSkills 岗位技能（已标准化）
   */
  exactMatch(resumeSkills: string[], jobSkills: string[]): SkillMatchResult {
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    if (jobSkills.length === 0) {
      // 如果岗位没有技能要求，返回中等分数
      return {
        matchScore: 0.5,
        matchedSkills: [],
        missingSkills: [],
        matchRatio: 0.5,
      };
    }

    // 标准化简历技能用于比较
    const normalizedResumeSkills = new Set(
      resumeSkills.map(s => skillNormalizer.normalize(s).normalized.toLowerCase())
    );

    // 检查岗位技能在简历中的匹配情况
    for (const skill of jobSkills) {
      const normalizedSkill = skillNormalizer.normalize(skill).normalized.toLowerCase();
      if (normalizedResumeSkills.has(normalizedSkill)) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    }

    // 计算匹配度：匹配的技能数 / 岗位要求的技能数
    const matchScore = matchedSkills.length / jobSkills.length;
    const matchRatio = matchedSkills.length / jobSkills.length;

    return {
      matchScore,
      matchedSkills,
      missingSkills,
      matchRatio,
    };
  }

  /**
   * 执行语义补充匹配
   * @param resumeSkills 简历技能
   * @param jobSkills 岗位技能
   * @param vectorScore 向量相似度分数
   */
  semanticSupplement(
    resumeSkills: string[],
    jobSkills: string[],
    vectorScore: number
  ): SemanticMatchResult {
    // 找出语义匹配的技能对
    const semanticMatches = this.findSemanticMatches(resumeSkills, jobSkills);

    // 计算语义补充加分
    // 只有当向量相似度较高但精确匹配较低时才给予加分
    let semanticBonus = 0;

    if (semanticMatches.length > 0 && vectorScore > 0.7) {
      // 语义匹配数量越多，加分越高，但有上限
      const matchCount = Math.min(semanticMatches.length, 5);
      // 每个语义匹配贡献 0.02 的加分，最多 0.1
      semanticBonus = matchCount * 0.02;
    }

    return {
      semanticBonus,
      semanticMatches,
    };
  }

  /**
   * 查找语义匹配的技能对
   * @param resumeSkills 简历技能
   * @param jobSkills 岗位技能
   */
  findSemanticMatches(
    resumeSkills: string[],
    jobSkills: string[]
  ): Array<{ resumeSkill: string; jobSkill: string; similarity: number }> {
    const matches: Array<{ resumeSkill: string; jobSkill: string; similarity: number }> = [];

    // 标准化简历技能
    const normalizedResumeSkills = resumeSkills.map(s => ({
      original: s,
      normalized: skillNormalizer.normalize(s).normalized.toLowerCase(),
    }));

    // 标准化岗位技能
    const normalizedJobSkills = jobSkills.map(s => ({
      original: s,
      normalized: skillNormalizer.normalize(s).normalized.toLowerCase(),
    }));

    // 已经精确匹配的技能不再进行语义匹配
    const exactMatchedJobSkills = new Set<string>();
    for (const resumeSkill of normalizedResumeSkills) {
      for (const jobSkill of normalizedJobSkills) {
        if (resumeSkill.normalized === jobSkill.normalized) {
          exactMatchedJobSkills.add(jobSkill.normalized);
        }
      }
    }

    // 对于未精确匹配的岗位技能，查找语义相似的简历技能
    for (const jobSkill of normalizedJobSkills) {
      if (exactMatchedJobSkills.has(jobSkill.normalized)) {
        continue;
      }

      // 获取岗位技能所属的语义组
      const jobSkillGroups = SKILL_TO_GROUP_INDEX.get(jobSkill.normalized) || [];

      for (const resumeSkill of normalizedResumeSkills) {
        // 获取简历技能所属的语义组
        const resumeSkillGroups = SKILL_TO_GROUP_INDEX.get(resumeSkill.normalized) || [];

        // 检查是否有共同的语义组
        const commonGroups = jobSkillGroups.filter(g => resumeSkillGroups.includes(g));

        if (commonGroups.length > 0) {
          // 计算相似度：共同语义组数量 / 最大语义组数量
          const similarity =
            commonGroups.length / Math.max(jobSkillGroups.length, resumeSkillGroups.length, 1);

          matches.push({
            resumeSkill: resumeSkill.original,
            jobSkill: jobSkill.original,
            similarity: Math.min(similarity, 0.8), // 语义匹配最高 0.8 相似度
          });
        }
      }
    }

    // 按相似度降序排序
    matches.sort((a, b) => b.similarity - a.similarity);

    return matches;
  }

  /**
   * 获取技能所属的语义组
   * @param skill 技能名称
   */
  getSemanticGroups(skill: string): string[] {
    const normalized = skillNormalizer.normalize(skill).normalized.toLowerCase();
    return SKILL_TO_GROUP_INDEX.get(normalized) || [];
  }

  /**
   * 检查两个技能是否语义相似
   * @param skill1 技能1
   * @param skill2 技能2
   */
  areSemanticallySimilar(skill1: string, skill2: string): boolean {
    const groups1 = this.getSemanticGroups(skill1);
    const groups2 = this.getSemanticGroups(skill2);

    // 如果有共同的语义组，则认为语义相似
    return groups1.some(g => groups2.includes(g));
  }
}

// 导出单例实例
export const skillMatcher = new SkillMatcher();
