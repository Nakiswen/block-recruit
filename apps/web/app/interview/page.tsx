'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card, Button } from 'ui';

// 模拟面试问题数据
const mockInterviewQuestions = {
  'Web3产品经理': [
    '请解释流动性挖矿的基本原理，以及它如何影响DeFi产品的用户获取策略？',
    '在设计一个借贷协议时，您会考虑哪些主要风险因素？如何在产品设计中缓解这些风险？',
    '情景题：假设您负责一个跨链DeFi产品，在主网上线前发现了一个可能导致资金损失的漏洞，但修复需要推迟发布日期。作为产品经理，您会如何权衡并做决策？',
    '您认为当前DeFi协议中哪些用户体验问题是最亟待解决的？您会提出什么创新解决方案？',
    '请分析一个您认为成功的DeFi产品案例，解释其产品策略的关键成功因素。'
  ],
  '智能合约开发工程师': [
    '请解释重入攻击的原理，以及如何在Solidity中防止这种攻击？',
    '请详细描述ERC-721和ERC-1155标准的区别，以及如何选择适合特定NFT项目的标准？',
    '如何优化智能合约的Gas消耗？请给出至少三种具体的技术或策略。',
    '情景题：您正在开发一个质押奖励合约，如何确保奖励分配的公平性和防止前置交易攻击？',
    '您如何进行智能合约的安全审计？有哪些工具和方法可以用来提高合约的安全性？'
  ],
  '区块链前端开发工程师': [
    '请解释如何在React应用中集成MetaMask钱包，包括连接钱包、签名消息和发送交易的流程？',
    '在Web3前端开发中，如何处理不同链的切换和兼容性问题？',
    '如何优化Dapp的用户体验，特别是在交易确认和等待时间方面？',
    '情景题：您正在开发一个NFT市场前端，如何设计一个高效的NFT浏览和搜索功能？',
    '请解释Web3.js和ethers.js的主要区别，以及您如何选择适合项目的库？'
  ],
  '默认问题': [
    '请简要介绍一下您的Web3相关经验和背景？',
    '您参与过哪些区块链项目？在其中担任什么角色？',
    '您如何看待区块链技术和Web3的未来发展趋势？',
    '您在Web3领域遇到的最大技术挑战是什么？您是如何解决的？',
    '为什么您对这个Web3职位感兴趣？您认为自己能为团队带来什么价值？'
  ]
};

export default function Interview() {
  const [position, setPosition] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [feedbackTimer, setFeedbackTimer] = useState<NodeJS.Timeout | null>(null);

  // 获取当前职位的问题列表
  const questions = position ? 
    (mockInterviewQuestions[position as keyof typeof mockInterviewQuestions] || mockInterviewQuestions['默认问题']) 
    : mockInterviewQuestions['默认问题'];

  // 清理定时器，防止内存泄露
  useEffect(() => {
    return () => {
      if (feedbackTimer) {
        clearTimeout(feedbackTimer);
      }
    };
  }, [feedbackTimer]);

  // 开始面试
  const startInterview = useCallback(() => {
    setIsInterviewStarted(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setCurrentAnswer('');
    setIsInterviewComplete(false);
    setFeedback(null);
    
    if (feedbackTimer) {
      clearTimeout(feedbackTimer);
      setFeedbackTimer(null);
    }
  }, [feedbackTimer]);

  // 提交当前答案
  const submitAnswer = useCallback(() => {
    if (currentAnswer.trim()) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = currentAnswer;
      setAnswers(newAnswers);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setCurrentAnswer('');
      } else {
        // 面试完成，生成反馈
        setIsInterviewComplete(true);
        generateFeedback(newAnswers);
      }
    }
  }, [answers, currentAnswer, currentQuestion, questions.length]);

  // 回到上一题
  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setCurrentAnswer(answers[currentQuestion - 1] || '');
    }
  }, [answers, currentQuestion]);

  // 模拟生成面试反馈
  const generateFeedback = useCallback((finalAnswers: string[]) => {
    // 在实际应用中，这里会调用AI服务来分析答案并生成反馈
    const timer = setTimeout(() => {
      // 模拟反馈数据
      setFeedback({
        overallScore: 7.8,
        technicalKnowledge: 8,
        problemSolving: 7.5,
        communication: 8.2,
        strengths: [
          '对Web3概念有深入的理解',
          '能够清晰解释复杂的技术问题',
          '提供了具体的工作案例支持观点'
        ],
        improvements: [
          '可以进一步深化对某些技术实现细节的讨论',
          '在解决方案中考虑更多的边缘情况'
        ],
        recommendation: '建议进入下一轮面试'
      });
    }, 2000);
    
    setFeedbackTimer(timer);
  }, []);

  // 处理职位选择变更
  const handlePositionChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setPosition(e.target.value);
  }, []);

  // 处理答案变更
  const handleAnswerChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentAnswer(e.target.value);
  }, []);

  // 返回首页
  const handleReturnToHome = useCallback(() => {
    setIsInterviewStarted(false);
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center gradient-text">Web3智能面试</h1>
      
      {!isInterviewStarted ? (
        <Card title="开始面试">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">选择面试职位</label>
              <select
                className="web3-select w-full"
                value={position}
                onChange={handlePositionChange}
              >
                <option value="">-- 选择职位 --</option>
                <option value="Web3产品经理">Web3产品经理</option>
                <option value="智能合约开发工程师">智能合约开发工程师</option>
                <option value="区块链前端开发工程师">区块链前端开发工程师</option>
              </select>
            </div>
            
            <div className="py-4">
              <h3 className="text-lg font-medium mb-2">面试说明：</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>面试将包含5个与Web3相关的问题</li>
                <li>请尽可能详细地回答每个问题</li>
                <li>您可以随时返回修改之前的回答</li>
                <li>完成所有问题后，将生成AI评估报告</li>
                <li>整个过程大约需要15-20分钟</li>
              </ul>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={startInterview} className="btn-primary">
                开始面试
              </Button>
            </div>
          </div>
        </Card>
      ) : isInterviewComplete ? (
        // 面试完成，显示反馈
        <div className="space-y-8">
          <Card title="面试评估" subtitle={position || '智能面试'}>
            {feedback ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">总体评分</h4>
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold text-primary-600">{feedback.overallScore.toFixed(1)}/10</span>
                    </div>
                    
                    <div className="mt-6 flex items-center bg-green-100 text-green-800 px-4 py-3 rounded">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">{feedback.recommendation}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">能力评估</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">技术知识</span>
                        <div className="flex items-center">
                          <div className="w-48 bg-gray-200 rounded-full h-2.5 mr-2">
                            <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${feedback.technicalKnowledge * 10}%` }}></div>
                          </div>
                          <span className="text-sm font-medium">{feedback.technicalKnowledge.toFixed(1)}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">问题解决能力</span>
                        <div className="flex items-center">
                          <div className="w-48 bg-gray-200 rounded-full h-2.5 mr-2">
                            <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${feedback.problemSolving * 10}%` }}></div>
                          </div>
                          <span className="text-sm font-medium">{feedback.problemSolving.toFixed(1)}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">沟通表达能力</span>
                        <div className="flex items-center">
                          <div className="w-48 bg-gray-200 rounded-full h-2.5 mr-2">
                            <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${feedback.communication * 10}%` }}></div>
                          </div>
                          <span className="text-sm font-medium">{feedback.communication.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">优势</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {feedback.strengths.map((strength: string, i: number) => (
                        <li key={i} className="text-sm">{strength}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">改进建议</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {feedback.improvements.map((improvement: string, i: number) => (
                        <li key={i} className="text-sm">{improvement}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-700 mb-2">问题与回答</h4>
                  <div className="space-y-4">
                    {questions.map((question, i) => (
                      <div key={i} className="p-4 bg-gray-50 rounded">
                        <p className="font-medium text-gray-800">{i + 1}. {question}</p>
                        <p className="mt-2 text-gray-600">{answers[i]}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handleReturnToHome}
                    className="btn-outline"
                  >
                    返回选择
                  </Button>
                  <Button
                    onClick={resetProcess}
                    className="btn-primary"
                  >
                    再次面试
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                <p className="mt-4 text-gray-600">正在生成面试评估报告...</p>
              </div>
            )}
          </Card>
        </div>
      ) : (
        // 进行中的面试
        <div className="space-y-8">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold gradient-text-secondary">
                {position || 'Web3'} 面试
              </h2>
              <div className="text-sm font-medium text-gray-500">
                问题 {currentQuestion + 1} / {questions.length}
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">{questions[currentQuestion]}</h3>
              <textarea
                className="web3-textarea w-full h-48"
                placeholder="在这里输入您的回答..."
                value={currentAnswer}
                onChange={handleAnswerChange}
              ></textarea>
            </div>
            
            <div className="mt-4 space-x-4 flex justify-between">
              <Button
                variant="outline"
                onClick={goToPreviousQuestion}
                disabled={currentQuestion === 0}
                className="btn-outline"
              >
                上一题
              </Button>
              <Button
                onClick={submitAnswer}
                disabled={!currentAnswer.trim()}
                className="btn-primary"
              >
                {currentQuestion < questions.length - 1 ? '下一题' : '完成面试'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
} 