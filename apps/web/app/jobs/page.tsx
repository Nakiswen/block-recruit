"use client";

import { useState } from "react";
import { Button } from "ui";

// Mock岗位数据
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

/**
 * 岗位列表页面
 * 展示所有匹配到的岗位，支持展开详情和申请操作
 */
export default function JobsPage() {
  // 展开状态，记录每个岗位是否展开
  const [expandedState, setExpandedState] = useState<Record<string, boolean>>({});
  // 记录已申请的岗位ID
  const [appliedJobId, setAppliedJobId] = useState<string | null>(null);

  // 切换岗位详情展开/收起
  const toggleJobExpanded = (jobId: string) => {
    setExpandedState(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  // 处理岗位申请
  const handleApplyJob = (jobId: string) => {
    setAppliedJobId(jobId);
    // 2秒后清除提示
    setTimeout(() => {
      setAppliedJobId(null);
    }, 3000);
    // TODO: 可在此处添加实际申请逻辑
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto py-10">
      {/* 顶部栏 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">匹配岗位 ({MOCK_JOBS.length})</h2>
        <Button variant="outline" onClick={() => window.location.href = "/"}>
          返回主页
        </Button>
      </div>

      {/* 岗位列表 */}
      <div className="grid grid-cols-1 gap-6">
        {MOCK_JOBS.map(job => {
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

              {/* 岗位要求 */}
              <div className="mt-4 border border-gray-100 rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium text-gray-900 mb-2">岗位要求</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {job.requirements.map((req: string, index: number) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              {/* 展开后显示详细描述 */}
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

      {/* 动画样式 */}
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