/**
 * 技能标准化服务
 * 负责将不同表述的技能映射为统一的标准格式
 */

/**
 * 技能分类枚举
 */
export enum SkillCategory {
  PROGRAMMING_LANGUAGE = 'programming_language',
  BLOCKCHAIN = 'blockchain',
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  DATABASE = 'database',
  CLOUD = 'cloud',
  DEVOPS = 'devops',
  PRODUCT = 'product',
  OPERATION = 'operation',
  MARKETING = 'marketing',
  DESIGN = 'design',
  RESEARCH = 'research',
  BUSINESS = 'business',
  OTHER = 'other',
}

/**
 * 标准化技能结果
 */
export interface NormalizedSkill {
  original: string; // 原始技能名称
  normalized: string; // 标准化后的名称
  category: SkillCategory; // 技能分类
  aliases: string[]; // 同义词列表
}

/**
 * 技能标准化服务接口
 */
export interface ISkillNormalizer {
  normalize(skill: string): NormalizedSkill;
  normalizeMany(skills: string[]): NormalizedSkill[];
  getCategory(skill: string): SkillCategory;
  areEquivalent(skill1: string, skill2: string): boolean;
  getAliases(skill: string): string[];
}

/**
 * 技能同义词映射表
 * key: 标准名称
 * value: 同义词列表（包含中英文）
 */
const SKILL_SYNONYMS: Record<string, string[]> = {
  // ========== 编程语言 ==========
  JavaScript: [
    'JS',
    'ECMAScript',
    'ES6',
    'ES2015',
    'ES2016',
    'ES2017',
    'ES2018',
    'ES2019',
    'ES2020',
  ],
  TypeScript: ['TS', 'Typescript'],
  Python: ['Python3', 'Py', 'Python 3'],
  Rust: ['Rust Lang', 'Rust语言'],
  Go: ['Golang', 'Go Lang', 'Go语言'],
  Solidity: ['Sol', 'Solidity语言'],
  Java: ['Java8', 'Java11', 'Java17', 'JDK'],
  'C++': ['CPP', 'C Plus Plus', 'Cpp'],
  'C#': ['CSharp', 'C Sharp', 'DotNet', '.NET'],
  Ruby: ['Ruby on Rails', 'RoR'],
  PHP: ['PHP7', 'PHP8', 'Laravel'],
  Swift: ['Swift语言', 'iOS开发'],
  Kotlin: ['Kotlin语言', 'Android开发'],
  Scala: ['Scala语言'],
  Haskell: ['Haskell语言'],
  Move: ['Move语言', 'Aptos Move', 'Sui Move'],
  Cairo: ['Cairo语言', 'StarkNet Cairo'],

  // ========== 区块链 ==========
  Ethereum: ['ETH', '以太坊', 'Ether'],
  'Smart Contract': ['智能合约', 'Smart Contracts', '合约开发'],
  DeFi: ['去中心化金融', 'Decentralized Finance', 'DeFi开发'],
  NFT: ['Non-Fungible Token', '非同质化代币', 'NFT开发'],
  DAO: ['去中心化自治组织', 'Decentralized Autonomous Organization', 'DAO治理'],
  Web3: ['Web 3.0', 'Web3.0', 'Web3开发'],
  Solana: ['Solana开发', 'Solana链', 'Solana生态'],
  Polygon: ['Matic', 'Polygon开发'],
  Avalanche: ['AVAX', 'Avalanche开发'],
  Cosmos: ['ATOM', 'Cosmos SDK', 'Cosmos开发'],
  Polkadot: ['DOT', 'Substrate', 'Polkadot开发'],
  Arbitrum: ['ARB', 'Arbitrum开发', 'L2'],
  Optimism: ['OP', 'Optimism开发', 'OP Stack'],
  zkSync: ['zkSync Era', 'zkSync开发'],
  StarkNet: ['STRK', 'StarkNet开发'],
  Tokenomics: ['Token Economics', '代币经济学', '代币设计', '通证经济'],
  Hardhat: ['Hardhat开发', 'HardhatJS'],
  Foundry: ['Foundry开发', 'Forge'],
  Truffle: ['Truffle Suite', 'Truffle开发'],
  'Wallet Integration': ['钱包集成', 'Web3钱包', 'MetaMask集成'],
  IPFS: ['星际文件系统', 'IPFS存储'],
  'The Graph': ['Graph Protocol', 'Subgraph'],
  Chainlink: ['LINK', 'Oracle', '预言机'],

  // ========== 前端框架 ==========
  React: ['ReactJS', 'React.js', 'React JS', 'React开发'],
  Vue: ['Vue.js', 'VueJS', 'Vue JS', 'Vue3', 'Vue 3', 'Vue2', 'Vue开发'],
  Angular: ['AngularJS', 'Angular.js', 'Angular开发'],
  'Next.js': ['NextJS', 'Next', 'Next.js开发'],
  'Nuxt.js': ['NuxtJS', 'Nuxt', 'Nuxt.js开发'],
  Svelte: ['SvelteKit', 'Svelte开发'],
  HTML: ['HTML5', 'HTML 5'],
  CSS: ['CSS3', 'CSS 3', '样式表'],
  SASS: ['SCSS', 'Sass'],
  TailwindCSS: ['Tailwind', 'Tailwind CSS'],
  Webpack: ['Webpack5', 'Webpack 5'],
  Vite: ['Vite.js', 'ViteJS'],
  'React Native': ['RN', 'React Native开发', '跨平台开发'],
  Flutter: ['Flutter开发', 'Dart'],
  'Ant Design': ['AntD', 'Ant Design Pro'],
  'Material UI': ['MUI', 'Material Design'],
  Ethers: ['Ethers.js', 'EthersJS'],
  'Web3.js': ['Web3JS', 'Web3 JS'],
  Wagmi: ['Wagmi Hooks'],
  RainbowKit: ['Rainbow Kit'],

  // ========== 后端框架 ==========
  'Node.js': ['NodeJS', 'Node', 'Node.js开发', 'Node JS'],
  Express: ['Express.js', 'ExpressJS', 'Express JS', 'Express框架'],
  Koa: ['Koa.js', 'KoaJS', 'Koa2', 'Koa框架'],
  NestJS: ['Nest.js', 'Nest', 'NestJS开发', 'Nest JS'],
  Django: ['Django REST', 'DRF', 'Django Framework', 'Django框架', 'Python Django'],
  Flask: ['Flask API', 'Flask Framework', 'Flask框架', 'Python Flask'],
  FastAPI: ['Fast API', 'FastAPI框架', 'Python FastAPI'],
  'Spring Boot': ['SpringBoot', 'Spring', 'Spring Framework', 'Spring框架', 'Java Spring'],
  GraphQL: ['GraphQL API', 'Apollo GraphQL', 'Apollo Server', 'GraphQL Server'],
  'REST API': ['RESTful', 'RESTful API', 'REST接口', 'REST服务', 'HTTP API'],
  gRPC: ['gRPC API', 'Protocol Buffers', 'Protobuf', 'gRPC服务'],
  Microservices: ['微服务', '微服务架构', 'Microservice Architecture', '分布式服务'],
  Gin: ['Gin框架', 'Go Gin', 'Gin Web'],
  Fiber: ['Go Fiber', 'Fiber框架'],
  Echo: ['Go Echo', 'Echo框架'],
  Actix: ['Actix Web', 'Rust Actix', 'Actix框架'],
  Rocket: ['Rocket框架', 'Rust Rocket'],
  Rails: ['Ruby on Rails', 'RoR', 'Rails框架'],
  Laravel: ['Laravel框架', 'PHP Laravel'],
  'ASP.NET': ['ASP.NET Core', 'DotNet Core', '.NET Core', 'ASP.NET MVC'],

  // ========== 数据库 ==========
  PostgreSQL: ['Postgres', 'PG', 'PostgreSQL数据库'],
  MongoDB: ['Mongo', 'MongoDB数据库'],
  Redis: ['Redis Cache', 'Redis缓存'],
  MySQL: ['MariaDB', 'MySQL数据库'],
  Elasticsearch: ['ES', 'ElasticSearch', 'ELK'],
  DynamoDB: ['AWS DynamoDB', 'Dynamo'],
  Cassandra: ['Apache Cassandra'],
  Neo4j: ['Neo4j图数据库', '图数据库'],
  Prisma: ['Prisma ORM', 'PrismaJS'],
  TypeORM: ['Type ORM'],
  Sequelize: ['Sequelize ORM'],

  // ========== 云服务 ==========
  AWS: ['Amazon Web Services', '亚马逊云', 'AWS云服务', 'Amazon AWS'],
  Azure: ['Microsoft Azure', '微软云', 'Azure云服务', 'MS Azure'],
  GCP: ['Google Cloud Platform', '谷歌云', 'Google Cloud', 'GCloud'],
  Vercel: ['Vercel部署', 'Vercel Platform', 'Vercel托管'],
  Netlify: ['Netlify部署', 'Netlify Platform', 'Netlify托管'],
  Cloudflare: ['CF', 'Cloudflare Workers', 'Cloudflare CDN', 'CF Workers'],
  'Alibaba Cloud': ['阿里云', 'Aliyun', '阿里云服务', 'AliCloud'],
  'Tencent Cloud': ['腾讯云', '腾讯云服务', 'QCloud'],
  Heroku: ['Heroku Platform', 'Heroku部署'],
  DigitalOcean: ['DO', 'Digital Ocean', 'DigitalOcean Droplet'],
  Linode: ['Linode Cloud', 'Akamai Linode'],
  'Oracle Cloud': ['OCI', 'Oracle Cloud Infrastructure', '甲骨文云'],
  'IBM Cloud': ['IBM云', 'IBM Cloud Services'],
  'Huawei Cloud': ['华为云', 'HUAWEI CLOUD'],
  'AWS Lambda': ['Lambda', 'AWS Serverless', 'Lambda函数'],
  'AWS S3': ['S3', 'Amazon S3', 'S3存储'],
  'AWS EC2': ['EC2', 'Amazon EC2', 'EC2实例'],
  'AWS ECS': ['ECS', 'Amazon ECS', 'Elastic Container Service'],
  'AWS EKS': ['EKS', 'Amazon EKS', 'Elastic Kubernetes Service'],
  'AWS RDS': ['RDS', 'Amazon RDS', 'Relational Database Service'],
  'Azure Functions': ['Azure Serverless', 'Azure函数'],
  'Google Cloud Functions': ['GCF', 'Cloud Functions', 'GCP Functions'],
  Firebase: ['Google Firebase', 'Firebase Platform', 'Firebase服务'],
  Supabase: ['Supabase Platform', 'Supabase Backend'],

  // ========== DevOps ==========
  Docker: ['容器化', 'Containerization', 'Docker容器'],
  Kubernetes: ['K8s', 'K8S', '容器编排', 'Kubernetes集群'],
  'CI/CD': ['持续集成', '持续部署', 'Continuous Integration', 'Continuous Deployment'],
  Jenkins: ['Jenkins CI'],
  'GitHub Actions': ['GHA', 'GitHub CI'],
  GitLab: ['GitLab CI', 'GitLab CI/CD'],
  Terraform: ['IaC', 'Infrastructure as Code'],
  Ansible: ['Ansible自动化'],
  Linux: ['Linux系统', 'Ubuntu', 'CentOS', 'Debian'],
  Nginx: ['Nginx服务器', 'Web服务器'],
  Prometheus: ['Prometheus监控'],
  Grafana: ['Grafana监控'],

  // ========== 产品管理 ==========
  'Product Management': ['产品管理', 'PM', '产品经理', 'Product Manager'],
  'User Research': ['用户研究', '用研', 'UX Research'],
  PRD: ['产品需求文档', 'Product Requirements Document', '需求文档'],
  Agile: ['敏捷开发', 'Agile Development', '敏捷'],
  Scrum: ['Scrum Master', 'Scrum敏捷'],
  JIRA: ['Jira', 'JIRA项目管理'],
  Roadmap: ['产品路线图', 'Product Roadmap'],
  'A/B Testing': ['AB测试', 'A/B测试', '灰度测试'],
  'Data Analysis': ['数据分析', 'Data Analytics'],
  'Product Strategy': ['产品策略', '产品战略'],
  'Competitive Analysis': ['竞品分析', '竞争分析'],
  'User Story': ['用户故事', 'User Stories'],
  Wireframe: ['线框图', '原型图'],
  Prototype: ['原型设计', 'Prototyping'],

  // ========== 运营 ==========
  'Community Operation': ['社区运营', '社群运营', 'Community Management'],
  'Growth Hacking': ['增长黑客', '用户增长', 'Growth'],
  'Content Operation': ['内容运营', 'Content Management'],
  'User Operation': ['用户运营', 'User Management'],
  'KOL Management': ['KOL运营', 'KOL合作', '达人运营'],
  'Event Planning': ['活动策划', '活动运营', 'Event Management'],
  'Discord Management': ['Discord运营', 'Discord社区'],
  'Telegram Management': ['Telegram运营', 'TG运营', 'Telegram社区'],
  'Twitter Operation': ['Twitter运营', 'X运营', '推特运营'],
  'Ambassador Program': ['大使计划', 'Ambassador'],
  'Airdrop Campaign': ['空投活动', 'Airdrop'],
  'Bounty Program': ['赏金计划', 'Bug Bounty'],

  // ========== 市场营销 ==========
  Marketing: ['市场营销', '营销', 'Marketing Strategy'],
  'Brand Marketing': ['品牌营销', 'Brand Strategy'],
  'Digital Marketing': ['数字营销', '数字化营销', 'Online Marketing'],
  SEO: ['搜索引擎优化', 'Search Engine Optimization'],
  SEM: ['搜索引擎营销', 'Search Engine Marketing', 'PPC'],
  'Social Media Marketing': ['社交媒体营销', 'SMM', '社媒营销'],
  'Content Marketing': ['内容营销'],
  'Influencer Marketing': ['网红营销', 'KOL营销'],
  PR: ['公关', 'Public Relations', '媒体关系'],
  'Media Relations': ['媒体关系', '媒体合作'],
  Partnership: ['商务合作', 'BD', 'Business Development'],
  'Crypto Marketing': ['加密货币营销', 'Web3营销'],

  // ========== 设计 ==========
  'UI Design': ['UI设计', '界面设计', 'User Interface Design'],
  'UX Design': ['UX设计', '用户体验设计', 'User Experience Design'],
  Figma: ['Figma Design', 'Figma设计'],
  Sketch: ['Sketch App', 'Sketch设计'],
  'Adobe XD': ['XD', 'Adobe XD设计'],
  Photoshop: ['PS', 'Adobe Photoshop'],
  Illustrator: ['AI', 'Adobe Illustrator'],
  'Motion Design': ['动效设计', 'Motion Graphics', '动画设计'],
  '3D Design': ['3D设计', '三维设计'],
  'Graphic Design': ['平面设计', 'Visual Design'],
  'Design System': ['设计系统', 'Design Token'],
  'Brand Design': ['品牌设计', 'VI设计'],
  'NFT Art': ['NFT艺术', 'NFT设计', 'Crypto Art'],

  // ========== 研究分析 ==========
  'Market Research': ['市场研究', '市场调研'],
  'Data Science': ['数据科学', 'DS'],
  'Machine Learning': ['机器学习', 'ML', 'AI/ML'],
  'Quantitative Analysis': ['量化分析', 'Quant'],
  'Blockchain Research': ['区块链研究', '链上分析'],
  'On-chain Analysis': ['链上数据分析', 'On-chain Data'],
  'Token Analysis': ['代币分析', 'Token Research'],
  'DeFi Research': ['DeFi研究', 'DeFi分析'],
  'Security Audit': ['安全审计', 'Smart Contract Audit', '合约审计'],
  'Economic Modeling': ['经济建模', '经济模型'],

  // ========== 商务 ==========
  'Business Development': ['商务拓展', 'BD', '商务开发'],
  Sales: ['销售', 'Sales Management'],
  'Account Management': ['客户管理', 'AM', '大客户管理'],
  'Investor Relations': ['投资者关系', 'IR'],
  Fundraising: ['融资', '募资'],
  'Legal Compliance': ['法务合规', 'Compliance', '合规'],
  'Financial Analysis': ['财务分析', 'Finance'],
  'Project Management': ['项目管理', 'PMP', '项目经理'],
  'Strategic Planning': ['战略规划', 'Strategy'],
};

/**
 * 技能分类映射表
 * 将技能映射到对应分类
 */
const SKILL_CATEGORIES: Record<SkillCategory, string[]> = {
  [SkillCategory.PROGRAMMING_LANGUAGE]: [
    'JavaScript',
    'TypeScript',
    'Python',
    'Rust',
    'Go',
    'Solidity',
    'Java',
    'C++',
    'C#',
    'Ruby',
    'PHP',
    'Swift',
    'Kotlin',
    'Scala',
    'Haskell',
    'Move',
    'Cairo',
  ],
  [SkillCategory.BLOCKCHAIN]: [
    'Ethereum',
    'Smart Contract',
    'DeFi',
    'NFT',
    'DAO',
    'Web3',
    'Solana',
    'Polygon',
    'Avalanche',
    'Cosmos',
    'Polkadot',
    'Arbitrum',
    'Optimism',
    'zkSync',
    'StarkNet',
    'Tokenomics',
    'Hardhat',
    'Foundry',
    'Truffle',
    'Wallet Integration',
    'IPFS',
    'The Graph',
    'Chainlink',
  ],
  [SkillCategory.FRONTEND]: [
    'React',
    'Vue',
    'Angular',
    'Next.js',
    'Nuxt.js',
    'Svelte',
    'HTML',
    'CSS',
    'SASS',
    'TailwindCSS',
    'Webpack',
    'Vite',
    'React Native',
    'Flutter',
    'Ant Design',
    'Material UI',
    'Ethers',
    'Web3.js',
    'Wagmi',
    'RainbowKit',
  ],
  [SkillCategory.BACKEND]: [
    'Node.js',
    'Express',
    'Koa',
    'NestJS',
    'Django',
    'Flask',
    'FastAPI',
    'Spring Boot',
    'GraphQL',
    'REST API',
    'gRPC',
    'Microservices',
    'Gin',
    'Fiber',
    'Echo',
    'Actix',
    'Rocket',
    'Rails',
    'Laravel',
    'ASP.NET',
  ],
  [SkillCategory.DATABASE]: [
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'MySQL',
    'Elasticsearch',
    'DynamoDB',
    'Cassandra',
    'Neo4j',
    'Prisma',
    'TypeORM',
    'Sequelize',
  ],
  [SkillCategory.CLOUD]: [
    'AWS',
    'Azure',
    'GCP',
    'Vercel',
    'Netlify',
    'Cloudflare',
    'Alibaba Cloud',
    'Tencent Cloud',
    'Heroku',
    'DigitalOcean',
    'Linode',
    'Oracle Cloud',
    'IBM Cloud',
    'Huawei Cloud',
    'AWS Lambda',
    'AWS S3',
    'AWS EC2',
    'AWS ECS',
    'AWS EKS',
    'AWS RDS',
    'Azure Functions',
    'Google Cloud Functions',
    'Firebase',
    'Supabase',
  ],
  [SkillCategory.DEVOPS]: [
    'Docker',
    'Kubernetes',
    'CI/CD',
    'Jenkins',
    'GitHub Actions',
    'GitLab',
    'Terraform',
    'Ansible',
    'Linux',
    'Nginx',
    'Prometheus',
    'Grafana',
  ],
  [SkillCategory.PRODUCT]: [
    'Product Management',
    'User Research',
    'PRD',
    'Agile',
    'Scrum',
    'JIRA',
    'Roadmap',
    'A/B Testing',
    'Data Analysis',
    'Product Strategy',
    'Competitive Analysis',
    'User Story',
    'Wireframe',
    'Prototype',
  ],
  [SkillCategory.OPERATION]: [
    'Community Operation',
    'Growth Hacking',
    'Content Operation',
    'User Operation',
    'KOL Management',
    'Event Planning',
    'Discord Management',
    'Telegram Management',
    'Twitter Operation',
    'Ambassador Program',
    'Airdrop Campaign',
    'Bounty Program',
  ],
  [SkillCategory.MARKETING]: [
    'Marketing',
    'Brand Marketing',
    'Digital Marketing',
    'SEO',
    'SEM',
    'Social Media Marketing',
    'Content Marketing',
    'Influencer Marketing',
    'PR',
    'Media Relations',
    'Partnership',
    'Crypto Marketing',
  ],
  [SkillCategory.DESIGN]: [
    'UI Design',
    'UX Design',
    'Figma',
    'Sketch',
    'Adobe XD',
    'Photoshop',
    'Illustrator',
    'Motion Design',
    '3D Design',
    'Graphic Design',
    'Design System',
    'Brand Design',
    'NFT Art',
  ],
  [SkillCategory.RESEARCH]: [
    'Market Research',
    'Data Science',
    'Machine Learning',
    'Quantitative Analysis',
    'Blockchain Research',
    'On-chain Analysis',
    'Token Analysis',
    'DeFi Research',
    'Security Audit',
    'Economic Modeling',
  ],
  [SkillCategory.BUSINESS]: [
    'Business Development',
    'Sales',
    'Account Management',
    'Investor Relations',
    'Fundraising',
    'Legal Compliance',
    'Financial Analysis',
    'Project Management',
    'Strategic Planning',
  ],
  [SkillCategory.OTHER]: [],
};

/**
 * 构建反向索引：从同义词到标准名称的映射
 */
function buildReverseIndex(): Map<string, string> {
  const reverseIndex = new Map<string, string>();

  for (const [standardName, aliases] of Object.entries(SKILL_SYNONYMS)) {
    // 标准名称本身也加入索引
    reverseIndex.set(standardName.toLowerCase(), standardName);

    // 所有同义词都映射到标准名称
    for (const alias of aliases) {
      reverseIndex.set(alias.toLowerCase(), standardName);
    }
  }

  return reverseIndex;
}

/**
 * 构建技能到分类的映射
 */
function buildCategoryIndex(): Map<string, SkillCategory> {
  const categoryIndex = new Map<string, SkillCategory>();

  for (const [category, skills] of Object.entries(SKILL_CATEGORIES)) {
    for (const skill of skills) {
      categoryIndex.set(skill.toLowerCase(), category as SkillCategory);
    }
  }

  return categoryIndex;
}

// 预构建索引
const REVERSE_INDEX = buildReverseIndex();
const CATEGORY_INDEX = buildCategoryIndex();

/**
 * 清理技能名称
 * 移除多余空格、特殊字符等
 */
function cleanSkillName(skill: string): string {
  return skill
    .trim()
    .replace(/\s+/g, ' ') // 多个空格合并为一个
    .replace(/[^\w\s\u4e00-\u9fa5.#+/-]/g, ''); // 保留字母、数字、中文、常见符号
}

/**
 * 技能标准化服务实现
 */
export class SkillNormalizer implements ISkillNormalizer {
  /**
   * 标准化单个技能
   */
  normalize(skill: string): NormalizedSkill {
    const cleaned = cleanSkillName(skill);

    if (!cleaned) {
      return {
        original: skill,
        normalized: '',
        category: SkillCategory.OTHER,
        aliases: [],
      };
    }

    const lowerCased = cleaned.toLowerCase();
    const standardName = REVERSE_INDEX.get(lowerCased);

    if (standardName) {
      return {
        original: skill,
        normalized: standardName,
        category: this.getCategory(standardName),
        aliases: SKILL_SYNONYMS[standardName] || [],
      };
    }

    // 未知技能，返回原始名称
    return {
      original: skill,
      normalized: cleaned,
      category: SkillCategory.OTHER,
      aliases: [],
    };
  }

  /**
   * 批量标准化技能
   */
  normalizeMany(skills: string[]): NormalizedSkill[] {
    return skills.map(skill => this.normalize(skill));
  }

  /**
   * 获取技能分类
   */
  getCategory(skill: string): SkillCategory {
    const cleaned = cleanSkillName(skill);
    if (!cleaned) {
      return SkillCategory.OTHER;
    }

    // 先尝试直接查找
    const directCategory = CATEGORY_INDEX.get(cleaned.toLowerCase());
    if (directCategory) {
      return directCategory;
    }

    // 尝试通过标准化名称查找
    const standardName = REVERSE_INDEX.get(cleaned.toLowerCase());
    if (standardName) {
      const category = CATEGORY_INDEX.get(standardName.toLowerCase());
      if (category) {
        return category;
      }
    }

    return SkillCategory.OTHER;
  }

  /**
   * 检查两个技能是否等价
   */
  areEquivalent(skill1: string, skill2: string): boolean {
    const normalized1 = this.normalize(skill1).normalized;
    const normalized2 = this.normalize(skill2).normalized;

    if (!normalized1 || !normalized2) {
      return false;
    }

    return normalized1.toLowerCase() === normalized2.toLowerCase();
  }

  /**
   * 获取技能的所有同义词
   */
  getAliases(skill: string): string[] {
    const normalized = this.normalize(skill);
    return normalized.aliases;
  }

  /**
   * 根据技能列表推断岗位类型
   */
  inferJobType(skills: string[]): string {
    const categoryCount = new Map<SkillCategory, number>();

    for (const skill of skills) {
      const category = this.getCategory(skill);
      categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
    }

    // 技术类分类
    const technicalCategories = [
      SkillCategory.PROGRAMMING_LANGUAGE,
      SkillCategory.BLOCKCHAIN,
      SkillCategory.FRONTEND,
      SkillCategory.BACKEND,
      SkillCategory.DATABASE,
      SkillCategory.CLOUD,
      SkillCategory.DEVOPS,
    ];

    let technicalCount = 0;
    for (const cat of technicalCategories) {
      technicalCount += categoryCount.get(cat) || 0;
    }

    const productCount = categoryCount.get(SkillCategory.PRODUCT) || 0;
    const operationCount = categoryCount.get(SkillCategory.OPERATION) || 0;
    const marketingCount = categoryCount.get(SkillCategory.MARKETING) || 0;
    const designCount = categoryCount.get(SkillCategory.DESIGN) || 0;
    const researchCount = categoryCount.get(SkillCategory.RESEARCH) || 0;
    const businessCount = categoryCount.get(SkillCategory.BUSINESS) || 0;

    // 找出最大的分类
    const counts = [
      { type: 'technical', count: technicalCount },
      { type: 'product', count: productCount },
      { type: 'operation', count: operationCount },
      { type: 'marketing', count: marketingCount },
      { type: 'design', count: designCount },
      { type: 'research', count: researchCount },
      { type: 'business', count: businessCount },
    ];

    counts.sort((a, b) => b.count - a.count);

    if (counts[0].count === 0) {
      return 'other';
    }

    return counts[0].type;
  }

  /**
   * 获取技能所属的语义组
   * 注意：语义组功能主要在 skillMatcher.ts 中实现
   * 这里提供基于分类的简化版本
   */
  getSemanticGroup(skill: string): SkillCategory {
    return this.getCategory(skill);
  }

  /**
   * 判断两个技能是否语义相似
   * 基于技能分类判断：同一分类的技能被认为是语义相似的
   */
  areSemanticallySimilar(skill1: string, skill2: string): boolean {
    // 首先检查是否等价（同义词）
    if (this.areEquivalent(skill1, skill2)) {
      return true;
    }

    // 检查是否属于同一分类
    const category1 = this.getCategory(skill1);
    const category2 = this.getCategory(skill2);

    // 如果都是 OTHER 分类，不认为是语义相似
    if (category1 === SkillCategory.OTHER || category2 === SkillCategory.OTHER) {
      return false;
    }

    return category1 === category2;
  }
}

// 导出单例实例
export const skillNormalizer = new SkillNormalizer();
