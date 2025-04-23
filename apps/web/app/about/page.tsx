'use client';

import Image from 'next/image';
import { Card } from 'ui';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center gradient-text">关于BlockRecruit</h1>
      
      <div className="mb-12 text-center">
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          BlockRecruit是专为Web3行业打造的去中心化招聘平台，将AI与区块链技术结合，为公司和求
          职者提供更高效、更透明的招聘体验。
        </p>
      </div>
      
      <div className="mb-16">
        <h2 className="inline-block text-base bg-blue-100 text-indigo-600 font-semibold tracking-wide px-4 py-1 rounded-full mb-6">我们的愿景</h2>
        <Card>
          <div className="prose max-w-none">
            <p>
              Web3行业正在快速发展，但招聘过程中的效率低下、技能评估不准确以及经验透明度等问题依然存在。BlockRecruit旨在通过结合先
              进的AI技术和区块链技术，解决以下Web3招聘痛点：
            </p>
            <ul>
              <li>通过AI精准匹配人才与职位，提高招聘效率</li>
              <li>利用区块链技术验证技能证明和项目工作经验，确保信息真实可靠</li>
              <li>构建透明的去中心化招聘生态系统，让人才资源和职位配置更加公平</li>
            </ul>
            <p>
              我们相信，BlockRecruit不仅能够提高招聘效率，还能为Web3行业的发展提供人才支持，推动整个行业向前发展。
            </p>
          </div>
        </Card>
      </div>
      
      <div className="mb-16">
        <h2 className="inline-block text-base bg-indigo-100 text-indigo-600 font-semibold tracking-wide px-4 py-1 rounded-full mb-6">我们的技术优势</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">AI驱动的技能匹配</h3>
              <p className="text-gray-600">
                利用深度学习技术分析Web3项目经验，提供精准的候选人-职位匹配度评分
              </p>
            </div>
          </Card>
          
          <Card>
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">区块链验证与激励</h3>
              <p className="text-gray-600">
                基于区块链技术的验证机制，确保项目经验和技能证明的真实性，并通过代币激励创造更公平的招聘生态
              </p>
            </div>
          </Card>
          
          <Card>
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">智能面试引擎</h3>
              <p className="text-gray-600">
                基于自然语言处理的智能面试系统，能够针对Web3不同职位的专业技术水平进行评估
              </p>
            </div>
          </Card>
        </div>
      </div>
      
      <div className="mb-16">
        <h2 className="inline-block text-base bg-purple-100 text-indigo-600 font-semibold tracking-wide px-4 py-1 rounded-full mb-6">团队介绍</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-bold text-center">张三</h3>
              <p className="text-indigo-600 text-sm text-center mb-2">创始人 & CEO</p>
              <p className="text-gray-600 text-sm text-center">
                前某知名区块链项目CTO，拥有10年区块链开发经验
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-bold text-center">李四</h3>
              <p className="text-indigo-600 text-sm text-center mb-2">CTO</p>
              <p className="text-gray-600 text-sm text-center">
                资深智能合约专家，参与过多个DeFi项目的开发
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-bold text-center">王五</h3>
              <p className="text-indigo-600 text-sm text-center mb-2">AI研发负责人</p>
              <p className="text-gray-600 text-sm text-center">
                人工智能博士，专注于NLP和智能推荐系统
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-bold text-center">赵六</h3>
              <p className="text-indigo-600 text-sm text-center mb-2">产品负责人</p>
              <p className="text-gray-600 text-sm text-center">
                前某知名Web3产品经理，深度参与多个DAO治理
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="inline-block text-base bg-green-100 text-indigo-600 font-semibold tracking-wide px-4 py-1 rounded-full mb-6">联系我们</h2>
        <Card>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2">加入我们</h3>
              <p className="text-gray-600">
                我们正在寻找充满激情的Web3人才加入团队，一起构建去中心化招聘的未来。如果您对区块链技术、AI应用领域深感兴趣，欢迎联系我们。
              </p>
            </div>
            <div className="flex flex-col space-y-3">
              <a href="mailto:contact@blockrecruit.io" className="flex items-center text-indigo-600 hover:text-indigo-700">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                contact@blockrecruit.io
              </a>
              <a href="https://blockrecruit.io" target="_blank" rel="noopener noreferrer" className="flex items-center text-indigo-600 hover:text-indigo-700">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
                https://blockrecruit.io
              </a>
              <a href="https://twitter.com/BlockRecruit" target="_blank" rel="noopener noreferrer" className="flex items-center text-indigo-600 hover:text-indigo-700">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
                Twitter: @BlockRecruit
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 