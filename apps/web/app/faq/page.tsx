'use client';

import { useState } from 'react';
import { Card } from 'ui';

type FAQItem = {
  question: string;
  answer: string;
  category: string;
};

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const faqItems: FAQItem[] = [
    {
      category: '平台功能',
      question: 'BlockRecruit平台提供哪些主要功能？',
      answer: 'BlockRecruit提供AI简历分析与职位匹配、区块链技能验证、智能面试系统、去中心化招聘流程等功能，专为Web3行业招聘设计。我们的平台能够帮助企业更精准地寻找合适的Web3人才，同时为求职者提供更透明的求职体验。'
    },
    {
      category: '平台功能',
      question: '如何使用AI简历分析功能？',
      answer: '只需上传您的简历，AI系统会自动分析您的技能、经验和教育背景，并与市场上的Web3职位进行匹配。对于招聘方，系统会提供候选人技能与职位要求的匹配度分析，帮助快速筛选合适的候选人。'
    },
    {
      category: '平台功能',
      question: '智能面试系统是如何工作的？',
      answer: '我们的智能面试系统基于先进的自然语言处理技术，针对不同Web3职位设计了专业的技术面试问题。系统会根据候选人的回答实时评估其技术能力和知识深度，为招聘方提供客观的评估报告。'
    },
    {
      category: '区块链技术',
      question: 'BlockRecruit如何利用区块链技术？',
      answer: '我们使用区块链技术来验证用户的技能证明和工作经验，确保信息的真实性和不可篡改性。同时，我们的平台引入代币激励机制，鼓励用户参与和贡献，构建一个更加公平和透明的招聘生态系统。'
    },
    {
      category: '区块链技术',
      question: '我需要持有加密货币才能使用平台吗？',
      answer: '不需要。虽然我们的平台基于区块链技术，但我们设计了友好的用户界面，使用户无需了解复杂的区块链知识即可使用我们的服务。对于希望参与代币激励的用户，我们也提供了简单的入门指南。'
    },
    {
      category: '用户指南',
      question: '如何注册BlockRecruit账户？',
      answer: '点击网站右上角的"注册"按钮，填写基本信息并验证您的邮箱即可完成注册。对于企业用户，需要额外提供公司信息进行验证。注册完成后，您可以创建个人或公司简介，开始使用我们的服务。'
    },
    {
      category: '用户指南',
      question: '如何发布招聘信息？',
      answer: '登录企业账户后，点击"发布职位"按钮，填写职位详情、要求和薪资范围等信息。我们的系统会自动提取关键技能要求，并推荐给匹配度高的候选人。您还可以设置筛选条件，如经验年限、技能要求等，以获得更精准的候选人推荐。'
    },
    {
      category: '用户指南',
      question: '如何更新我的技能和经验？',
      answer: '登录账户后，进入"个人中心"，点击"编辑简历"或"更新技能"选项。您可以添加新技能、上传证书或更新工作经验。对于可验证的技能，我们建议提供相关证明，如GitHub链接、项目案例等，这将有助于提高您的可信度评分。'
    },
    {
      category: '安全与隐私',
      question: 'BlockRecruit如何保护用户数据？',
      answer: '我们采用先进的加密技术保护用户数据，遵循严格的隐私政策，未经用户授权不会分享个人信息。同时，基于区块链的数据存储确保了信息的不可篡改性，用户对自己的数据拥有完全的控制权。'
    },
    {
      category: '安全与隐私',
      question: '简历信息是否会被公开？',
      answer: '不会。您的简历信息默认是私密的，只有在您主动申请职位或同意被推荐时，相关企业才能查看您的信息。您可以在隐私设置中随时调整信息的可见范围，控制谁可以看到您的简历。'
    }
  ];

  const categories = Array.from(new Set(faqItems.map(item => item.category)));

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFAQs = activeCategory 
    ? faqItems.filter(item => item.category === activeCategory) 
    : faqItems;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">常见问题</h1>
      
      <div className="mb-8">
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${activeCategory === null ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            onClick={() => setActiveCategory(null)}
          >
            全部
          </button>
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full text-sm font-medium ${activeCategory === category ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredFAQs.map((faq, index) => (
          <Card key={index} className="overflow-hidden">
            <button
              className="w-full text-left p-4 focus:outline-none flex justify-between items-center"
              onClick={() => toggleFAQ(index)}
            >
              <span className="font-medium text-lg">{faq.question}</span>
              <span className="text-primary-600">
                {activeIndex === index ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
                  </svg>
                )}
              </span>
            </button>
            {activeIndex === index && (
              <div className="p-4 pt-0 border-t border-gray-200">
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-12 p-6 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">还有其他问题？</h2>
        <p className="text-center mb-6">
          如果您没有找到需要的答案，可以直接联系我们的客服团队获取帮助。
        </p>
        <div className="flex justify-center">
          <a
            href="mailto:support@blockrecruit.io"
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            联系客服
          </a>
        </div>
      </div>
    </div>
  );
} 