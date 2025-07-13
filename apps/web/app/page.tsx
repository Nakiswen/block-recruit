'use client';

import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from 'ui';

import api, { resumeServices, nftServices, Job, applicationServices, userServices, User } from '../lib/api';
import { matchedJobsAtom, currentResumeIdAtom, resumeProcessingStatusAtom } from '../store/matchedJobsAtom';
import { pollWithInterval, HybridProgressManager } from '../utils';


// 定义NFT类型
interface NFT {
  id: string;
  title: string;
  description: string;
  image: string;
  type: string;
  verifiedBy: string;
  icon: string;
  bgColor?: string;
}

// 产品功能列表
const PRODUCT_FEATURES = [
  {
    id: 'feature-1',
    title: '智能岗位匹配',
    description: '基于AI分析您的简历与Web3岗位需求，提供精准匹配推荐',
    icon: '🔍',
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
  const [matchedJobs, setMatchedJobsAtom] = useAtom(matchedJobsAtom);
  const [userNFTs, setUserNFTs] = useState<NFT[]>([]);
  const [activePage, setActivePage] = useState('home');
  const [activeSection, setActiveSection] = useState('');
  const [matchingStarted, setMatchingStarted] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedState, setExpandedState] = useState<Record<string, boolean>>({});
  const [appliedJobId, setAppliedJobId] = useState<string | null>(null);
  
  const fallbackCountRef = useRef(0);
  
  const [, setCurrentResumeId] = useAtom(currentResumeIdAtom);
  const [, setResumeProcessingStatus] = useAtom(resumeProcessingStatusAtom);
  
  const router = useRouter();
  
  // 获取用户NFT证明
  const fetchUserNFTs = useCallback(async (userId: string) => {
    try {
      const nftsData = await nftServices.getUserNfts(userId);
      if (nftsData && Array.isArray(nftsData)) {
        setUserNFTs(nftsData);
      }
    } catch (err) {
      // 静默处理错误
    }
  }, []);
  
  // 获取用户信息
  const fetchUserInfo = useCallback(async () => {
    try {
      const userData = await userServices.getCurrentUser();
      setCurrentUser(userData);
      
      // 如果用户有NFT证明，获取用户NFT
      if (userData && userData.id) {
        fetchUserNFTs(userData.id);
      }
    } catch (err) {
      // 静默失败，不影响用户体验
    }
  }, [fetchUserNFTs]);
  
  // 轮询后端进度接口，混合进度条方案
  useEffect(() => {
    if (resumeUploaded && matchingStarted && resumeId) {
      setIsLoading(true);

      // 创建混合进度条管理器
      const progressManager = new HybridProgressManager(
        (progress) => setMatchingProgress(progress)
      );

      // 开始伪进度增长
      progressManager.startFakeProgress(90, 200);

      // 轮询后端进度
      const pollProgress = async () => {
        try {
          const result = await pollWithInterval(
            () => api.get(`/resumes/${resumeId}/progress`),
            (res) => {
              return res.data.status === 'done';
            },
            2000,
            90000 // 1.5分钟超时
          );
          const { progress, status, jobs } = result.data;
          
          // 更新全局状态
          setResumeProcessingStatus({
            progress: progress || 0,
            status: status || 'processing'
          });
          
          // 更新真实进度
          if (typeof progress === 'number') {
            progressManager.updateRealProgress(progress);
          }
          
          if (status === 'done') {
            progressManager.complete(100);
            setIsLoading(false);
            
            // 获取岗位数据
            if (jobs && Array.isArray(jobs) && jobs.length > 0) {
              setMatchedJobsAtom(jobs); // 存到全局
              setCurrentResumeId(resumeId); // 保存简历ID到全局
            } else {
              // 兜底再拉一次岗位
              if (fallbackCountRef.current < 2) {
                try {
                  const matchedJobsData = await resumeServices.getMatchingJobs(resumeId);
                  if (matchedJobsData && matchedJobsData.length > 0) {
                    progressManager.complete(100);
                    setIsLoading(false);
                    setMatchedJobsAtom(matchedJobsData);
                    setCurrentResumeId(resumeId);
                  }
                  fallbackCountRef.current += 1;
                } catch (e) {
                  setUploadError('岗位匹配结果获取失败，请稍后重试');
                  fallbackCountRef.current += 1;
                }
              }
            }
          } else if (status === 'failed') {
            setIsLoading(false);
            setUploadError('简历处理失败，请重试或联系客服');
          }
        } catch (err) {
          // 网络/接口异常时，继续用伪进度
          
          // 如果多次失败，尝试直接获取匹配结果
          if (fallbackCountRef.current < 2) {
            try {
              const matchedJobsData = await resumeServices.getMatchingJobs(resumeId);
              if (matchedJobsData && matchedJobsData.length > 0) {
                progressManager.complete(100);
                setIsLoading(false);
                setMatchedJobsAtom(matchedJobsData);
                setCurrentResumeId(resumeId);
              }
              fallbackCountRef.current += 1;
            } catch (e) {
              fallbackCountRef.current += 1;
            }
          }
        }
      };

      // 只调用一次pollProgress，pollWithInterval内部已经实现了轮询逻辑
      pollProgress();

      return () => {
        progressManager.cleanup();
      };
    }
  }, [resumeUploaded, matchingStarted, resumeId, setMatchedJobsAtom, setCurrentResumeId, setResumeProcessingStatus]);
  
  // 修复useEffect依赖问题
  useEffect(() => {
    // 检查本地存储的钱包连接状态 - 仅读取状态，不发起连接
    const walletConnected = localStorage.getItem('walletAuth') === 'true';
    setIsWalletConnected(walletConnected);
    
    // 检查是否有已上传简历的标志
    const hasUploadedResume = localStorage.getItem('resumeUploaded') === 'true';
    if (hasUploadedResume) {
      setResumeUploaded(true);
      
      // 获取resumeId
      const storedResumeId = localStorage.getItem('resumeId');
      if (storedResumeId) {
        setResumeId(storedResumeId);
      }
    }
    
    // 不再自动获取用户信息，只在用户明确请求时获取
    
    // 监听以太坊钱包账户变化
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // 用户断开钱包连接
        localStorage.removeItem('token');
        localStorage.removeItem('walletAuth');
        localStorage.removeItem('walletAuthAddress');
        setIsWalletConnected(false);
        setCurrentUser(null);
      } else {
        // 用户切换了账户，使用新地址重新登录
        const newAddress = accounts[0];
        localStorage.setItem('walletAuthAddress', newAddress);
        // 这里可以选择自动重新登录或提示用户重新登录
      }
    };

    // 添加以太坊钱包事件监听
    if (typeof window.ethereum !== 'undefined') {
      (window.ethereum as any).on('accountsChanged', handleAccountsChanged);
    }

    // 监听localStorage变化，确保顶部导航栏和首页状态同步
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'walletAuth') {
        const walletConnected = e.newValue === 'true';
        setIsWalletConnected(walletConnected);
        if (walletConnected) {
          // 钱包已连接，但不自动获取用户信息
          // 用户可以通过点击相关按钮来获取信息
        } else {
          setCurrentUser(null);
        }
      } else if (e.key === 'resumeUploaded') {
        const resumeUploaded = e.newValue === 'true';
        setResumeUploaded(resumeUploaded);
      } else if (e.key === 'resumeId') {
        const resumeId = e.newValue;
        setResumeId(resumeId);
      }
    };

    // 页面内更新处理
    const handleWalletEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.connected !== undefined) {
        setIsWalletConnected(detail.connected);
        if (detail.connected) {
          // 钱包已连接，但不自动获取用户信息
        } else {
          setCurrentUser(null);
        }
      }
    };
    
    const handleResumeEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.uploaded !== undefined) {
        setResumeUploaded(detail.uploaded);
        if (detail.resumeId) {
          setResumeId(detail.resumeId);
        }
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
      
      // 移除以太坊钱包事件监听
      if (typeof window.ethereum !== 'undefined') {
        (window.ethereum as any).removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);  // 移除fetchUserInfo依赖，避免自动调用
  
  // 处理简历文件选择
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // 检查文件类型
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/markdown', 'text/x-markdown'];
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
      // 调用API上传简历
      const response = await resumeServices.uploadResume(resumeFile);
      
      // 上传成功
      if (response && response.resumeId) {
        setResumeId(response.resumeId);
        setResumeUploaded(true);
        setMatchingStarted(true);
      }
      
      // 上传成功
      setIsUploading(false);
      
      // 触发自定义事件
      const event = new CustomEvent('resumeUploaded', { 
        detail: { uploaded: true, resumeId: response?.resumeId } 
      });
      document.dispatchEvent(event);
      
    } catch (err) {
      setUploadError("上传失败，请重试");
      setIsUploading(false);
    }
  }, [resumeFile]);
  
  // 处理岗位申请
  const handleApplyJob = useCallback((jobId: string) => {
    // 如果没有用户ID或jobId，则无法申请
    if (!currentUser || !currentUser.id || !jobId) {
      setUploadError("请先登录或选择有效的岗位");
      return;
    }
    
    // 调用API创建投递记录
    const applyJob = async () => {
      try {
        await applicationServices.createApplication({
          userId: currentUser.id,
          jobId: jobId
        });
        
        // 设置申请成功状态
        setAppliedJobId(jobId);
        
        // 2秒后清除提示
        setTimeout(() => {
          setAppliedJobId(null);
        }, 3000);
      } catch (err) {
        setUploadError("岗位申请失败，请重试");
      }
    };
    
    applyJob();
  }, [currentUser]);

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
  
  // 获取用户信息的函数，供组件中调用
  const handleGetUserInfo = () => {
    fetchUserInfo();
  };
  
  // 处理钱包连接
  const handleConnectWallet = () => {
    // 实现钱包连接逻辑
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
                  onClick={handleConnectWallet}
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
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown,text/x-markdown"
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
                    onClick={() => {
                      router.push('/jobs');
                    }}
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
    return null; // 迁移到新页面后，这里不再渲染岗位列表
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
        {userNFTs.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">成就NFT验证</h3>
            <div className="flex items-center justify-center gap-6 mb-2">
              {userNFTs
                .filter(nft => nft.type === 'achievement')
                .map(nft => (
                  <div key={nft.id} 
                      className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full 
                                flex items-center justify-center text-2xl shadow-lg">
                    {nft.icon}
                  </div>
                ))}
            </div>
            <p className="text-center text-gray-600">您的GitHub成就</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 渲染所有类型为"organization"的NFT */}
          {userNFTs
            .filter(nft => nft.type === 'organization')
            .map(nft => (
              <div key={nft.id} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
                <div className="relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-xl">
                  {/* NFT 顶部图像区域 */}
                  <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                      <span className="text-4xl">{nft.icon}</span>
                    </div>
                  </div>
                  
                  {/* NFT 信息区域 */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{nft.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">由 {nft.verifiedBy} 验证</p>
                      </div>
                      <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full dark:bg-green-900 dark:text-green-300">
                        已上链
                      </div>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{nft.description}</p>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        <span className="mr-1">Token ID:</span>
                        <span className="font-mono">#{nft.id.substring(0, 4)}</span>
                      </div>
                      <button className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm">
                        查看证明
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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