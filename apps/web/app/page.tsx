'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from 'ui';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [floatingElements, setFloatingElements] = useState<Array<{id: number, type: string, size: number, position: {x: number, y: number}, animation: string}>>([]);
  
  // 使用useCallback优化事件处理函数
  const handleConnect = useCallback(() => {
    setIsConnected(true);
  }, []);
  
  const handleDisconnect = useCallback(() => {
    setIsConnected(false);
  }, []);
  
  // 生成随机浮动元素
  useEffect(() => {
    const elements = [];
    const elementCount = 15; // 元素数量
    const types = ['circle', 'square', 'triangle', 'x', 'plus']; // 元素类型
    const animations = ['float-slow', 'float-medium', 'float-fast']; // 动画类型
    
    for (let i = 0; i < elementCount; i++) {
      elements.push({
        id: i,
        type: types[Math.floor(Math.random() * types.length)],
        size: 10 + Math.random() * 20, // 随机大小
        position: {
          x: Math.random() * 90, // x位置百分比
          y: Math.random() * 90, // y位置百分比
        },
        animation: animations[Math.floor(Math.random() * animations.length)]
      });
    }
    
    setFloatingElements(elements);
  }, []);
  
  return (
    <div className="space-y-16">
      {/* 英雄区 */}
      <section className="py-16 text-center relative overflow-hidden">
        {/* 装饰元素 - 浮动元素 */}
        {floatingElements.map(el => (
          <div
            key={el.id}
            className={`absolute opacity-20 ${el.animation}`}
            style={{
              top: `${el.position.y}%`,
              left: `${el.position.x}%`,
              width: `${el.size}px`,
              height: `${el.size}px`,
              zIndex: -1,
            }}
          >
            {el.type === 'circle' && (
              <div className="w-full h-full rounded-full border-2 border-indigo-500"></div>
            )}
            {el.type === 'square' && (
              <div className="w-full h-full border-2 border-purple-500 transform rotate-45"></div>
            )}
            {el.type === 'triangle' && (
              <div className="w-0 h-0 border-left-[10px] border-right-[10px] border-bottom-[20px] border-l-transparent border-r-transparent border-b-blue-500"></div>
            )}
            {el.type === 'x' && (
              <div className="w-full h-full relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-pink-500 transform -rotate-45"></div>
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-pink-500 transform rotate-45"></div>
              </div>
            )}
            {el.type === 'plus' && (
              <div className="w-full h-full relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-emerald-500"></div>
                <div className="absolute top-0 left-1/2 w-0.5 h-full bg-emerald-500"></div>
              </div>
            )}
          </div>
        ))}

        <div className="relative z-10">
          <h1 className="max-w-4xl mx-auto text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span className="block mb-2">Web3招聘的未来</span>
            <span className="gradient-text">由AI驱动，区块链验证</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            BlockRecruit将先进的人工智能与区块链技术相结合，打造专为Web3行业设计的去中心化招聘平台
          </p>
          <div className="mt-10 flex justify-center gap-x-6">
            <Link href="/resume-screening">
              <Button size="lg" className="btn-primary">开始筛选简历</Button>
            </Link>
            <Link href="/interview">
              <Button variant="outline" size="lg" className="btn-outline">体验智能面试</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 特点区 */}
      <section className="py-12">
        <div className="text-center mb-16">
          <h2 className="inline-block text-base bg-blue-100 text-indigo-600 font-semibold tracking-wide px-4 py-1 rounded-full">特点</h2>
          <p className="mt-4 text-4xl font-extrabold sm:text-5xl sm:tracking-tight">
            <span className="gradient-text">为什么选择BlockRecruit？</span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-medium text-gray-900">AI简历筛选</h3>
            <p className="mt-3 text-base text-gray-500 text-center">
              智能分析简历与Web3职位要求的匹配度，量化评估候选人的区块链技能与项目经验
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-medium text-gray-900">智能面试官</h3>
            <p className="mt-3 text-base text-gray-500 text-center">
              根据职位要求生成针对性的Web3技术问题，评估候选人的思维方式和问题解决能力
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-medium text-gray-900">区块链技能验证</h3>
            <p className="mt-3 text-base text-gray-500 text-center">
              利用区块链技术验证候选人的技能证明和项目经验，确保简历信息真实可靠
            </p>
          </div>
        </div>
      </section>

      {/* 使用流程 */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl">
        <div className="text-center mb-16">
          <h2 className="inline-block text-base bg-indigo-100 text-indigo-600 font-semibold tracking-wide px-4 py-1 rounded-full">使用流程</h2>
          <p className="mt-4 text-4xl font-extrabold sm:tracking-tight">
            <span className="gradient-text">如何使用BlockRecruit</span>
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <ol className="relative border-l border-gray-300">
            <li className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                1
              </span>
              <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">上传简历</h3>
              <p className="mb-4 text-base text-gray-600">
                上传候选人的简历，支持PDF、Word等格式，系统将自动解析简历内容
              </p>
            </li>
            <li className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                2
              </span>
              <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">选择职位要求</h3>
              <p className="mb-4 text-base text-gray-600">
                选择目标Web3职位和具体要求，或自定义职位技能需求
              </p>
            </li>
            <li className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                3
              </span>
              <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">AI评估匹配度</h3>
              <p className="mb-4 text-base text-gray-600">
                系统分析简历与职位要求的匹配程度，生成详细的评估报告和量化分数
              </p>
            </li>
            <li className="ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white bg-gradient-to-r from-green-500 to-teal-500 text-white">
                4
              </span>
              <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">开始智能面试</h3>
              <p className="mb-4 text-base text-gray-600">
                对筛选通过的候选人进行智能面试，测试其Web3知识深度和问题解决能力
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* CTA区域 */}
      <section className="py-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl text-white text-center">
        <h2 className="text-3xl font-bold">准备好优化您的Web3招聘流程了吗？</h2>
        <p className="mt-4 text-xl">立即使用BlockRecruit，发现最合适的Web3人才</p>
        <div className="mt-8">
          <Link href="/resume-screening">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 transition-colors duration-200">
              免费开始使用
            </Button>
          </Link>
        </div>
      </section>
      
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-25px) rotate(-5deg); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-35px) rotate(8deg); }
        }
        
        .float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
        
        .float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 