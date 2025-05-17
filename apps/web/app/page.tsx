'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from 'ui';
import Link from 'next/link';
import Image from 'next/image';

// 定义NFT类型
interface NFT {
  id: string;
  title: string;
  description: string;
  image: string;
  type: string;
  verifiedBy: string;
  icon: string;
  bgColor?: string; // 添加可选的背景色属性
}

// Mock数据
const MOCK_RESUME = {
  id: 'mock-resume-1',
  name: '张三',
  email: 'zhangsan@example.com',
  phone: '13800138000',
  education: [
    {
      school: '北京大学',
      degree: '计算机科学与技术',
      startDate: '2016-09',
      endDate: '2020-06',
      gpa: '3.8/4.0'
    }
  ],
  workExperience: [
    {
      company: 'Web3公司',
      title: '区块链开发工程师',
      startDate: '2020-07',
      endDate: '2022-12',
      description: '负责智能合约开发及区块链应用架构设计'
    },
    {
      company: '区块链创业公司',
      title: '全栈开发',
      startDate: '2019-01',
      endDate: '2020-06',
      description: '参与DeFi项目开发，实现前端与智能合约交互'
    }
  ],
  skills: ['Solidity', 'Ethereum', 'React', 'Web3.js', 'TypeScript', 'Smart Contracts']
};

const MOCK_JOBS = [
  {
    id: 'job-1',
    title: '高级智能合约开发工程师',
    company: 'BlockChain Tech',
    location: '远程',
    salary: '30-50k/月',
    matchScore: 89,
    description: '设计和开发基于EVM生态的去中心化应用智能合约，使用Solidity编写高效、安全的智能合约，实现和优化核心功能包括资产管理、交易执行和安全验证，协调与团队其他成员的工作，研究应用最新区块链技术和行业最佳实践。',
    requirements: ['计算机科学相关学位', '2年以上区块链开发经验', '精通Solidity智能合约开发', '熟悉区块链基础架构和共识算法', '有DeFi或NFT项目实战经验']
  },
  {
    id: 'job-2',
    title: '智能合约开发工程师',
    company: 'MetaDAO',
    location: '远程/北京',
    salary: '25-35k/月',
    matchScore: 78,
    description: '设计和开发基于Solana或EVM生态的去中心化应用智能合约，使用Solidity编写高效、安全的智能合约，实现和优化核心功能包括资产管理、交易执行和安全验证，协调与团队其他成员的工作，研究应用最新区块链技术和行业最佳实践。',
    requirements: ['计算机科学相关学位', '2年以上区块链开发经验', '精通Solidity智能合约开发', '熟悉区块链基础架构和共识算法', '良好的沟通能力和团队合作精神']
  },
  {
    id: 'job-3',
    title: '资深智能合约开发工程师',
    company: 'CryptoSafe',
    location: '远程/上海',
    salary: '35-60k/月',
    matchScore: 65,
    description: '设计和开发基于EVM生态的去中心化应用智能合约，针对我们的多链资产管理平台进行智能合约开发，使用Solidity编写高效、安全的智能合约，实现和优化核心功能，研究应用最新区块链技术和行业最佳实践，确保产品安全与高效。',
    requirements: ['计算机科学相关学位', '3年以上区块链开发经验', '精通Solidity智能合约开发', '熟悉区块链基础架构和共识算法', '对区块链技术和行业发展充满热情']
  },
];

// 模拟GitHub成就数据
const MOCK_GITHUB_ACHIEVEMENTS = [
  { id: 1, name: 'Pull Shark', description: '提交了多个被接受的PR', icon: '🦈' },
  { id: 2, name: 'Galaxy Brain', description: '多次解答社区问题', icon: '🧠' },
  { id: 3, name: 'YOLO', description: '不经审核直接合并代码', icon: '🔥' },
];

// 模拟用户组织数据
const MOCK_GITHUB_ORGANIZATIONS = [
  { id: 1, name: 'Ethereum', icon: 'Ξ', bgColor: 'bg-indigo-600' },
  { id: 2, name: 'OpenZeppelin', icon: 'OZ', bgColor: 'bg-purple-600' },
];

// 产品功能列表
const PRODUCT_FEATURES = [
  {
    id: 'feature-1',
    title: '智能岗位匹配',
    description: '基于AI分析您的简历与Web3岗位需求，提供精准匹配推荐',
    icon: '��',
  },
  {
    id: 'feature-2',
    title: '区块链技能证明',
    description: '将您的GitHub成就和组织身份转化为NFT，作为可信任的技能证明',
    icon: '🔐',
  },
  {
    id: 'feature-3',
    title: '一键式投递',
    description: '匹配岗位后，一键投递简历并附上区块链技能证明',
    icon: '🚀',
  },
];

// 产品特点列表
const PRODUCT_HIGHLIGHTS = [
  {
    id: 'highlight-1',
    title: '多源数据',
    description: 'GitHub、组织成员资格、项目经验等多源数据验证',
    icon: '📊',
  },
  {
    id: 'highlight-2',
    title: '链上验证',
    description: '基于StarkNet的零知识证明，保证数据真实可信',
    icon: '⛓️',
  },
  {
    id: 'highlight-3',
    title: '一键操作',
    description: '从简历上传到岗位投递，全流程一键式体验',
    icon: '👆',
  },
];

// 定价计划
const PRICING_PLANS = [
  {
    id: 'plan-1',
    title: '免费版',
    description: '每日前20次投递免费',
    price: '¥0',
    features: [
      '简历分析与岗位匹配',
      'GitHub成就NFT铸造',
      '20次/天免费投递额度',
    ],
    buttonText: '开始使用',
    recommended: false,
  },
  {
    id: 'plan-2',
    title: 'Pro版',
    description: '专业Web3求职者首选',
    price: '$15',
    features: [
      '无限简历分析与岗位匹配',
      'GitHub与组织身份NFT铸造',
      '无限投递额度',
      '优先岗位匹配',
      '简历优化建议',
      '一键投递',
    ],
    buttonText: '升级Pro',
    recommended: true,
  },
];

export default function Home() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [matchedJobs, setMatchedJobs] = useState<any[]>([]);
  const [userNFTs, setUserNFTs] = useState<NFT[]>([]);
  const [activePage, setActivePage] = useState('home');
  const [activeSection, setActiveSection] = useState('');
  const [expandedState, setExpandedState] = useState<Record<string, boolean>>({});
  const [appliedJobId, setAppliedJobId] = useState<string | null>(null);
  const [matchingStarted, setMatchingStarted] = useState(false);
  
  // 处理钱包连接
  useEffect(() => {
    // 检查本地存储的钱包连接状态
    const walletConnected = localStorage.getItem('walletAuth') === 'true';
    setIsWalletConnected(walletConnected);
    
    // 检查是否有已上传简历的标志 - 不再自动设置resumeUploaded
    const hasUploadedResume = localStorage.getItem('resumeUploaded') === 'true';
    if (hasUploadedResume) {
      setResumeUploaded(true);
    }
    
    // 如果有简历上传，则生成NFT数据
    if (hasUploadedResume) {
      // 生成NFT数据
      const nfts = MOCK_GITHUB_ACHIEVEMENTS.map(achievement => ({
        id: `nft-${achievement.id}`,
        title: achievement.name,
        description: achievement.description,
        image: achievement.icon,
        type: 'achievement',
        verifiedBy: 'GitHub',
        icon: achievement.icon
      }));
      
      MOCK_GITHUB_ORGANIZATIONS.forEach(org => {
        nfts.push({
          id: `nft-org-${org.id}`,
          title: `${org.name} 组织成员`,
          description: `验证为 ${org.name} 组织的成员资格`,
          image: org.icon,
          type: 'organization',
          verifiedBy: 'GitHub',
          icon: org.icon
        });
      });
      
      setUserNFTs(nfts);
    }

    // 监听localStorage变化，确保顶部导航栏和首页状态同步
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'walletAuth') {
        const walletConnected = e.newValue === 'true';
        setIsWalletConnected(walletConnected);
      } else if (e.key === 'resumeUploaded') {
        const resumeUploaded = e.newValue === 'true';
        setResumeUploaded(resumeUploaded);
      }
    };

    // 页面内更新处理
    const handleWalletEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.connected !== undefined) {
        setIsWalletConnected(detail.connected);
      }
    };
    
    const handleResumeEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.uploaded !== undefined) {
        setResumeUploaded(detail.uploaded);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('walletConnected', handleWalletEvent);
    document.addEventListener('resumeUploaded', handleResumeEvent);
    
    // 监听滚动事件以更新当前活动段落
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let currentSection = '';
      
      sections.forEach(section => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        
        if (window.scrollY >= sectionTop - 200 && 
            window.scrollY < sectionTop + sectionHeight - 200) {
          currentSection = section.id;
        }
      });
      
      setActiveSection(currentSection);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始化
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('walletConnected', handleWalletEvent);
      document.removeEventListener('resumeUploaded', handleResumeEvent);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // 模拟匹配过程 - 仅在matchingStarted为true时开始匹配
  useEffect(() => {
    if (resumeUploaded && matchingStarted && matchingProgress < 100) {
      const timer = setTimeout(() => {
        setMatchingProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            // 匹配完成，加载推荐岗位
            setMatchedJobs(MOCK_JOBS);
          }
          return Math.min(newProgress, 100);
        });
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [resumeUploaded, matchingProgress, matchingStarted]);
  
  // 处理简历文件选择
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // 检查文件类型
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        setUploadError("请上传PDF或Word格式的简历");
        return;
      }
      
      // 检查文件大小 (限制为5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("文件大小不能超过5MB");
        return;
      }
      
      setResumeFile(file);
      setUploadError("");
    }
  };
  
  // 处理简历上传
  const handleResumeUpload = useCallback(async () => {
    if (!resumeFile) {
      setUploadError("请先选择简历文件");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // 这里模拟文件上传过程
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 模拟上传成功
      setResumeUploaded(true);
      setIsUploading(false);
      
      // 设置开始匹配标志
      setMatchingStarted(true);
      
      // 保存简历已上传的状态
      localStorage.setItem('resumeUploaded', 'true');
      
      // 触发自定义事件
      const event = new CustomEvent('resumeUploaded', { 
        detail: { uploaded: true } 
      });
      document.dispatchEvent(event);
      
    } catch (error) {
      setUploadError("上传失败，请重试");
      setIsUploading(false);
    }
  }, [resumeFile]);
  
  // 处理岗位申请
  const handleApplyJob = useCallback((jobId: string) => {
    console.log(`应聘岗位: ${jobId}，附带NFT证明`);
    // 设置申请成功状态
    setAppliedJobId(jobId);
    
    // 2秒后清除提示
    setTimeout(() => {
      setAppliedJobId(null);
    }, 3000);
    
    // 这里可以实现申请岗位的逻辑
  }, []);

  // 滚动到指定部分
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // 处理岗位展开/收起
  const toggleJobExpanded = (jobId: string) => {
    setExpandedState(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };
  
  // 首页内容
  if (activePage === 'home') {
  return (
      <div className="space-y-20">
        {/* 导航指示器 */}
        <nav className="fixed right-10 top-1/2 transform -translate-y-1/2 z-50 hidden md:block">
          <ul className="space-y-4">
            {['hero', 'features', 'how-it-works', 'highlights', 'pricing'].map((section) => (
              <li key={section}>
                <button 
                  onClick={() => scrollToSection(section)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeSection === section 
                      ? 'bg-indigo-600 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`跳转到${section}部分`}
                />
              </li>
            ))}
          </ul>
        </nav>

        {/* 英雄区域 */}
        <section id="hero" className="min-h-[90vh] flex flex-col md:flex-row items-center justify-center">
          <div className="max-w-2xl space-y-6 py-20">
            <h1 className="text-4xl md:text-6xl font-bold">
              <span className="block">重新定义Web3</span>
              <span className="gradient-text block mt-2">招聘与求职体验</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              BlockRecruit结合AI与区块链技术，将您的技能与经验转化为可验证的链上证明，
              为Web3人才提供精准岗位匹配，重塑去中心化招聘流程。
            </p>
            
            <div className="flex flex-wrap gap-4 pt-6">
              <Button 
                size="lg" 
                onClick={() => scrollToSection('get-started')}
                className="px-8"
              >
                立即体验
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => scrollToSection('how-it-works')}
                className="px-8"
              >
                了解更多
              </Button>
            </div>
          </div>
          
          <div className="relative w-full max-w-lg h-80 md:h-[500px]">
            <div className="absolute -z-10 w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl transform rotate-3"></div>
            <div className="w-full h-full bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-center items-center">
              <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <div className="space-y-2 text-center">
                <div className="font-semibold text-gray-900">成就NFT验证</div>
                <div className="flex justify-center gap-2">
                  <span className="text-2xl">🦈</span>
                  <span className="text-2xl">🧠</span>
                  <span className="text-2xl">🔥</span>
                </div>
                <div className="text-gray-600 text-sm">您的GitHub成就</div>
              </div>
              
              <div className="w-full h-px bg-gray-200 my-6"></div>
              
              <div className="space-y-2 text-center">
                <div className="font-semibold text-gray-900">组织身份验证</div>
                <div className="flex justify-center gap-3">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">Ξ</div>
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">OZ</div>
                </div>
                <div className="text-gray-600 text-sm">您的组织成员身份</div>
              </div>
          </div>
        </div>
      </section>

        {/* 主要功能区域 */}
        <section id="features" className="py-20 bg-gradient-to-b from-white to-indigo-50">
          <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
              <p className="inline-block px-3 py-1 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-full mb-4">
                核心功能
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                重新定义Web3招聘流程
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                BlockRecruit将AI与区块链技术相结合，为求职者和招聘方打造全新的Web3招聘体验
          </p>
        </div>

            <div className="grid md:grid-cols-3 gap-8">
              {PRODUCT_FEATURES.map((feature) => (
                <div 
                  key={feature.id} 
                  className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* 工作流程区域 */}
        <section id="how-it-works" className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <p className="inline-block px-3 py-1 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-full mb-4">
                工作流程
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                如何使用BlockRecruit
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                通过简单几步，找到最适合您的Web3工作机会
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="relative">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3">连接钱包</h3>
                <p className="text-gray-600">连接您的Web3钱包，开始去中心化求职体验</p>
                
                {/* 连接线 - 仅在大屏幕显示 */}
                <div className="hidden md:block absolute top-8 left-16 w-full h-0.5 bg-gradient-to-r from-indigo-200 to-transparent"></div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3">上传简历</h3>
                <p className="text-gray-600">上传您的简历，我们将自动提取关键信息</p>
                
                {/* 连接线 */}
                <div className="hidden md:block absolute top-8 left-16 w-full h-0.5 bg-gradient-to-r from-indigo-200 to-transparent"></div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3">生成证明</h3>
                <p className="text-gray-600">系统自动生成您的GitHub成就与组织身份NFT证明</p>
                
                {/* 连接线 */}
                <div className="hidden md:block absolute top-8 left-16 w-full h-0.5 bg-gradient-to-r from-indigo-200 to-transparent"></div>
          </div>

              <div>
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl font-bold mb-4">
                  4
                </div>
                <h3 className="text-xl font-semibold mb-3">匹配岗位</h3>
                <p className="text-gray-600">AI分析简历并推荐最匹配的Web3岗位，一键投递</p>
            </div>
          </div>
        </div>
      </section>

        {/* 产品特点区域 */}
        <section id="highlights" className="py-20 bg-gradient-to-b from-indigo-50 to-white">
          <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
              <p className="inline-block px-3 py-1 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-full mb-4">
                产品特点
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                为什么选择BlockRecruit
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                以下特点让BlockRecruit成为Web3求职的理想选择
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12">
              {PRODUCT_HIGHLIGHTS.map((highlight) => (
                <div key={highlight.id} className="text-center">
                  <div className="text-5xl mb-6 flex justify-center">{highlight.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{highlight.title}</h3>
                  <p className="text-gray-600">{highlight.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* 定价区域 */}
        <section id="pricing" className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <p className="inline-block px-3 py-1 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-full mb-4">
                使用策略
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                简单透明的价格方案
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                每天前20次投递完全免费，满足您的基本求职需求
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {PRICING_PLANS.map((plan) => (
                <div 
                  key={plan.id} 
                  className={`
                    bg-white rounded-xl shadow-lg overflow-hidden flex flex-col
                    ${plan.recommended ? 'border-2 border-indigo-500 relative' : 'border border-gray-200'}
                  `}
                >
                  {plan.recommended && (
                    <div className="bg-indigo-500 text-white text-sm font-semibold py-1 px-4 absolute top-0 right-0 rounded-bl-lg">
                      推荐方案
                    </div>
                  )}
                  
                  <div className="p-8 flex-grow">
                    <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    
                    <div className="flex items-baseline mb-6">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.price !== '¥0' && <span className="text-gray-500 ml-2">/月</span>}
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span>{feature}</span>
            </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="px-8 pb-8 mt-auto">
                    <Button 
                      variant={plan.recommended ? 'primary' : 'outline'} 
                      className="w-full"
                    >
                      {plan.buttonText}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </section>

        {/* 开始使用区域 */}
        <section id="get-started" className="py-20 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              准备好开始您的Web3求职之旅了吗？
            </h2>
            <p className="text-xl opacity-90 mb-10">
              连接钱包，上传简历，让AI为您找到最合适的Web3工作机会
            </p>
            
            {!isWalletConnected ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto">
                <h3 className="text-xl font-semibold mb-4 text-white">第一步：连接钱包</h3>
                <p className="mb-6 opacity-80">连接您的Web3钱包，开启去中心化求职体验</p>
                <Button 
                  size="lg" 
                  className="bg-white text-indigo-600 hover:bg-gray-50"
                  onClick={() => {
                    setIsWalletConnected(true);
                    localStorage.setItem('walletAuth', 'true');
                    localStorage.setItem('walletAuthAddress', '0x1234...5678');
                    
                    // 触发自定义事件通知状态变化
                    const event = new CustomEvent('walletConnected', { 
                      detail: { connected: true } 
                    });
                    document.dispatchEvent(event);
                    
                    // 触发storage事件
                    window.dispatchEvent(new StorageEvent('storage', {
                      key: 'walletAuth',
                      newValue: 'true'
                    }));
                  }}
                >
                  连接钱包
                </Button>
              </div>
            ) : !resumeUploaded ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto">
                <h3 className="text-xl font-semibold mb-4 text-white">第二步：上传简历</h3>
                <p className="mb-4 opacity-80">上传您的简历，系统将自动分析匹配合适岗位</p>
                
                <div className="mb-6">
                  <div className="mb-4">
                    <label 
                      htmlFor="resume-upload" 
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-white border-dashed rounded-lg cursor-pointer hover:bg-white/5 transition-all"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        {resumeFile ? (
                          <p className="mb-2 text-sm text-white">
                            <span className="font-semibold">{resumeFile.name}</span>
                          </p>
                        ) : (
                          <p className="mb-2 text-sm text-white">
                            <span className="font-semibold">点击上传简历</span> 或拖放文件
                          </p>
                        )}
                        <p className="text-xs text-white/70">
                          支持PDF、DOC、DOCX格式，大小不超过5MB
                        </p>
                      </div>
                      <input 
                        id="resume-upload" 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  
                  {uploadError && (
                    <div className="text-red-300 text-sm mb-4">
                      {uploadError}
                    </div>
                  )}
                </div>
                
                <Button 
                  size="lg" 
                  className="bg-white text-indigo-600 hover:bg-gray-50 w-full"
                  onClick={handleResumeUpload}
                  disabled={!resumeFile || isUploading}
                >
                  {isUploading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      正在上传...
                    </div>
                  ) : "上传简历"}
                </Button>
              </div>
            ) : !matchingStarted ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto">
                <h3 className="text-xl font-semibold mb-4 text-white">第三步：开始岗位匹配</h3>
                <p className="mb-6 opacity-80">简历已上传成功，点击下方按钮开始寻找匹配的Web3岗位</p>
                <Button 
                  size="lg" 
                  className="bg-white text-indigo-600 hover:bg-gray-50"
                  onClick={() => setMatchingStarted(true)}
                >
                  开始匹配
                </Button>
              </div>
            ) : matchingProgress < 100 ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto">
                <h3 className="text-xl font-semibold mb-4 text-white">正在匹配中...</h3>
                <div className="w-full bg-white/20 rounded-full h-4 mb-4 overflow-hidden">
                  <div 
                    className="bg-white h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${matchingProgress}%` }}
                  ></div>
                </div>
                <p className="opacity-80">
                  正在分析您的简历并匹配最适合的岗位 ({matchingProgress}%)
                </p>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto">
                <h3 className="text-xl font-semibold mb-4 text-white">匹配完成！</h3>
                <p className="mb-6 opacity-80">
                  我们为您找到了 {matchedJobs.length} 个合适的Web3岗位
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-white text-indigo-600 hover:bg-gray-50"
                    onClick={() => setActivePage('jobs')}
                  >
                    查看匹配岗位
                  </Button>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white border border-transparent hover:opacity-90"
                    onClick={() => setActivePage('nfts')}
                  >
                    查看我的证明
            </Button>
                </div>
              </div>
            )}
        </div>
      </section>
      </div>
    );
  }
  
  // 岗位列表页面
  if (activePage === 'jobs') {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">匹配岗位 ({matchedJobs.length})</h2>
          <Button variant="outline" onClick={() => setActivePage('home')}>
            返回主页
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {matchedJobs.map(job => {
            const isExpanded = expandedState[job.id] || false;
            const isApplied = appliedJobId === job.id;
            
            return (
              <div key={job.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold">{job.title} <span className="text-blue-600 font-medium ml-2">{job.salary}</span></h3>
                    </div>
                    <p className="text-gray-600">{job.company} · {job.location}</p>
                  </div>
                  <div className="bg-purple-100 text-purple-800 font-medium px-3 py-1 rounded-full text-sm ml-4">
                    匹配度 {job.matchScore}%
                  </div>
                </div>
                
                {/* 默认显示岗位要求 */}
                <div className="mt-4 border border-gray-100 rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium text-gray-900 mb-2">岗位要求</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {job.requirements.map((req: string, index: number) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
                
                {/* 点击展开后显示详细描述 */}
                {isExpanded && (
                  <div className="mt-4 animate-fadeIn">
                    <h4 className="font-medium text-gray-900 mb-2">职位描述</h4>
                    <p className="text-gray-700">{job.description}</p>
                  </div>
                )}
                
                <div className="mt-6 flex justify-between items-center">
                  <button 
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                    onClick={() => toggleJobExpanded(job.id)}
                  >
                    {isExpanded ? '收起详情' : '查看详情'}
                    <svg 
                      className={`ml-1 w-4 h-4 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  <div className="flex items-center">
                    {isApplied && (
                      <div className="animate-fadeIn mr-4 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        申请成功
                      </div>
                    )}
                    <Button 
                      onClick={() => handleApplyJob(job.id)}
                      disabled={isApplied}
                    >
                      {isApplied ? '已申请' : '申请并发送证明'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-in-out;
          }
        `}</style>
      </div>
    );
  }
  
  // NFT证明页面
  if (activePage === 'nfts') {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">我的证明</h2>
          <Button variant="outline" onClick={() => setActivePage('home')}>
            返回主页
          </Button>
        </div>
        
        {/* GitHub成就NFT部分 */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">成就NFT验证</h3>
          <div className="flex items-center justify-center gap-6 mb-2">
            {MOCK_GITHUB_ACHIEVEMENTS.map(achievement => (
              <div key={achievement.id} 
                   className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full 
                            flex items-center justify-center text-2xl shadow-lg">
                {achievement.icon}
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600">您的GitHub成就</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Ethereum 组织成员 NFT */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
            <div className="relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-xl">
              {/* NFT 顶部图像区域 */}
              <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                  <span className="text-4xl">Ξ</span>
                </div>
              </div>
              
              {/* NFT 信息区域 */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">Ethereum 组织成员</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">由 GitHub 验证</p>
                  </div>
                  <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full dark:bg-green-900 dark:text-green-300">
                    已上链
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">验证为 Ethereum 组织的成员资格</p>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="mr-1">Token ID:</span>
                    <span className="font-mono">#0004</span>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm">
                    查看证明
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* OpenZeppelin 组织成员 NFT */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
            <div className="relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-xl">
              {/* NFT 顶部图像区域 */}
              <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                  <span className="text-4xl">OZ</span>
                </div>
              </div>
              
              {/* NFT 信息区域 */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">OpenZeppelin 组织成员</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">由 GitHub 验证</p>
                  </div>
                  <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full dark:bg-green-900 dark:text-green-300">
                    已上链
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">验证为 OpenZeppelin 组织的成员资格</p>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="mr-1">Token ID:</span>
                    <span className="font-mono">#0005</span>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm">
                    查看证明
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes pulse-slow {
            0%, 100% {
              opacity: 0.75;
            }
            50% {
              opacity: 0.5;
            }
          }
          .animate-pulse-slow {
            animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
  }
  
  return null;
} 