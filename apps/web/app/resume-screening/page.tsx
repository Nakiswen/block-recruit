'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Card, ResumeUpload, Button } from 'ui';
import JobRequirementForm from '../../components/JobRequirementForm';
import ResumeEvaluationResult from '../../components/ResumeEvaluationResult';
import ResumeAIParser from '../../components/ResumeAIParser';
import { parseResume, aiParserFunction, ResumeData } from 'resume-parser';

// 职位要求的默认选项
const defaultJobPositions = [
  { title: '智能合约开发工程师', level: 'mid' as const },
  { title: '区块链前端开发工程师', level: 'junior' as const },
  { title: '区块链安全分析师', level: 'senior' as const },
  { title: '密码学研究员', level: 'senior' as const },
  { title: 'Web3产品经理', level: 'mid' as const },
];

// 定义职位要求类型
interface JobRequirements {
  title: string;
  level: 'junior' | 'mid' | 'senior';
  skills: {
    required: string[];
    preferred: string[];
  };
  experience: {
    minYears: number;
    requiredFields: string[];
  };
}

// 前端UI使用的评估结果类型
interface UIEvaluationResult {
  overallScore: number;
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  projectsScore: number;
  matchingSkills: Array<{
    skill: string;
    category: string;
    relevance: number;
    level?: 'beginner' | 'intermediate' | 'expert';
    description?: string;
  }>;
  relevantExperience: Array<{
    company: string;
    position: string;
    relevance: number;
    duration: number;
    web3Related: boolean;
  }>;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  // 增加Web3知识库匹配的内容
  web3Evaluation?: {
    skillMatches: Array<{
      skill: string;
      category: string;
      relevance: number;
      level?: 'beginner' | 'intermediate' | 'expert';
      description?: string;
    }>;
    missingSkills: string[];
    strengthAreas: string[];
    improvementAreas: string[];
    careerSuggestions: string[];
    learningResources: Array<{
      skill: string;
      resources: Array<{
        title: string;
        url: string;
        type: string;
      }>;
    }>;
  };
}

export default function ResumeScreening() {
  const [step, setStep] = useState(1);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobRequirements, setJobRequirements] = useState<JobRequirements>({
    title: '',
    level: 'mid',
    skills: {
      required: [],
      preferred: [],
    },
    experience: {
      minYears: 2,
      requiredFields: [],
    },
  });
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<UIEvaluationResult | null>(null);
  const [evaluationTimer, setEvaluationTimer] = useState<NodeJS.Timeout | null>(null);
  const [useAI, setUseAI] = useState<boolean>(false);
  const [parsedResumeData, setParsedResumeData] = useState<ResumeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [evaluationProgress, setEvaluationProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [evaluatingErrorMessage, setErrorMessage] = useState<string | null>(null);

  // 清理定时器，防止内存泄露
  useEffect(() => {
    return () => {
      if (evaluationTimer) {
        clearTimeout(evaluationTimer);
      }
    };
  }, [evaluationTimer]);

  // 步骤控制
  const goToNextStep = useCallback(() => {
    setStep(prev => Math.min(prev + 1, 3));
  }, []);

  const goToPreviousStep = useCallback(() => {
    setStep(prev => Math.max(prev - 1, 1));
  }, []);

  const handleResumeParseComplete = useCallback((data: ResumeData) => {
    setParsedResumeData(data);
    setError(null);
    // 解析完成后自动进入下一步
    goToNextStep();
  }, [goToNextStep]);

  const handleResumeParseError = useCallback((error: string) => {
    setError(error);
    console.warn('简历解析错误:', error);
  }, []);

  const handleFileSelect = useCallback((file: File | null) => {
    setResumeFile(file);
    setParsedResumeData(null);
    setError(null);
  }, []);

  const handleJobRequirementsChange = useCallback((requirements: JobRequirements) => {
    setJobRequirements(requirements);
  }, []);

  const handleFileUpload = useCallback(async () => {
    if (!resumeFile) {
      setError('请选择要上传的文件');
      return;
    }
    
    setError(null);
    
    try {
      if (useAI) {
        // 使用AI解析方法
        const parseResult = await aiParserFunction(resumeFile);
        
        if (parseResult.error) {
          setError(parseResult.error);
        } else if (parseResult.data) {
          handleResumeParseComplete(parseResult.data);
        }
      } else {
        // 使用传统解析方法
        const parseResult = await parseResume(resumeFile);
        
        if (parseResult.error) {
          setError(parseResult.error);
        } else if (parseResult.data) {
          handleResumeParseComplete(parseResult.data);
        }
      }
    } catch (error) {
      setError(`解析过程中发生错误: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [resumeFile, useAI, handleResumeParseComplete]);

  const handleEvaluate = useCallback(async () => {
    if (!resumeFile || !jobRequirements.title) {
      setErrorMessage('请先上传简历文件并填写职位要求');
      return;
    }
    
    // 开始评估流程
    setIsEvaluating(true);
    setEvaluationProgress(10);
    setStatusMessage('正在解析简历...');
    
    try {
      // 解析简历文件
      const parseResult = await aiParserFunction(resumeFile);
      
      if (parseResult.error) {
        throw new Error(parseResult.error);
      }
      
      if (!parseResult.data) {
        throw new Error('解析结果为空');
      }
      
      // 保存解析结果
      setParsedResumeData(parseResult.data);
      setEvaluationProgress(40);
      setStatusMessage('简历解析完成，准备评估...');
      
      // 发送到服务端评估API
      setEvaluationProgress(60);
      setStatusMessage('正在进行评估...');
      
      const evaluationResponse = await fetch('/api/resume/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resumeData: parseResult.data,
          jobRequirements
        })
      });
      
      if (!evaluationResponse.ok) {
        const errorData = await evaluationResponse.json();
        throw new Error(`评估服务错误: ${errorData.error || '未知错误'}`);
      }
      
      // 解析评估结果
      const evaluationData = await evaluationResponse.json();
      
      if (!evaluationData.success || !evaluationData.evaluation) {
        throw new Error('评估结果无效');
      }
      
      // 更新评估结果
      setEvaluationProgress(90);
      setStatusMessage('评估完成，生成报告...');
      
      // 设置最终结果
      setEvaluationResult(evaluationData.evaluation);
      setEvaluationProgress(100);
      
      // 完成评估
      setTimeout(() => {
        setStep(3);
        setIsEvaluating(false);
      }, 500);
      
    } catch (error) {
      console.error('评估过程发生错误:', error);
      setErrorMessage(error instanceof Error ? error.message : '评估过程中发生未知错误');
      setIsEvaluating(false);
    }
  }, [resumeFile, jobRequirements, useAI]);

  const resetProcess = useCallback(() => {
    setStep(1);
    setResumeFile(null);
    setParsedResumeData(null);
    setError(null);
    setEvaluationResult(null);
    setJobRequirements({
      title: '',
      level: 'mid',
      skills: {
        required: [],
        preferred: [],
      },
      experience: {
        minYears: 2,
        requiredFields: [],
      },
    });
  }, []);

  // 切换解析模式
  const toggleParseMode = useCallback(() => {
    setUseAI(!useAI);
    setParsedResumeData(null);
    setError(null);
  }, [useAI]);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center gradient-text">Web3简历筛选</h1>

      {/* 步骤指示器 */}
      <div className="mb-10">
        <div className="flex items-center justify-center">
          <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
            <div className="step-circle">1</div>
            <div className="step-title">上传简历</div>
          </div>
          <div className={`step-connector ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
            <div className="step-circle">2</div>
            <div className="step-title">选择职位要求</div>
          </div>
          <div className={`step-connector ${step >= 3 ? 'active' : ''}`}></div>
          <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
            <div className="step-circle">3</div>
            <div className="step-title">查看评估结果</div>
          </div>
        </div>
      </div>

      {/* 步骤内容 */}
      <div className="step-content">
        {step === 1 && (
          <Card className="transition-all">
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2">上传简历</h2>
              <p className="text-gray-600 mb-4">
                支持PDF和DOCX格式的简历文件。我们会自动提取文本内容，您也可以手动检查和调整提取结果。
              </p>
              
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="useAI"
                    checked={useAI}
                    onChange={(e) => setUseAI(e.target.checked)}
                    className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="useAI" className="text-sm text-gray-700">
                    使用AI增强解析（提供更准确的简历内容识别）
                  </label>
                </div>
              </div>
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v4a1 1 0 11-2 0V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <ResumeUpload onFileSelect={handleFileSelect} />
              
              {resumeFile && (
                <div className="flex mt-4 justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">已选择文件: <span className="font-semibold">{resumeFile.name}</span></p>
                    <p className="text-xs text-gray-500">大小: {(resumeFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <Button onClick={handleFileUpload}>
                    {useAI ? '上传并使用AI解析' : '上传并解析'}
                  </Button>
                </div>
              )}
            </div>
            
            {useAI && resumeFile && (
              <ResumeAIParser
                file={resumeFile}
                onParseComplete={handleResumeParseComplete}
                onError={handleResumeParseError}
              />
            )}
          </Card>
        )}

        {step === 2 && (
          <Card title="选择职位要求">
            {parsedResumeData && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <h3 className="text-lg font-medium text-green-800 mb-2">简历已成功解析</h3>
                <div className="text-sm text-green-700">
                  <p>姓名: {parsedResumeData.personalInfo.name || '未知'}</p>
                  <p>技能: {parsedResumeData.skills.slice(0, 5).join(', ')}{parsedResumeData.skills.length > 5 ? '...' : ''}</p>
                  <p>工作经验: {parsedResumeData.workExperience.length} 项</p>
                </div>
              </div>
            )}
            <JobRequirementForm
              defaultPositions={defaultJobPositions}
              onChange={handleJobRequirementsChange}
              initialValues={jobRequirements}
            />
            <div className="mt-6 flex justify-between">
              <Button
                variant="outline"
                onClick={goToPreviousStep}
              >
                上一步
              </Button>
              <Button
                onClick={handleEvaluate}
                disabled={isEvaluating || !jobRequirements.title}
                variant="gradient"
              >
                {isEvaluating ? '评估中...' : '开始评估'}
              </Button>
            </div>
          </Card>
        )}

        {step === 3 && evaluationResult && (
          <div>
            <ResumeEvaluationResult
              result={evaluationResult}
              jobRequirements={jobRequirements}
            />
            <div className="mt-6 flex justify-between">
              <Button
                variant="outline"
                onClick={goToPreviousStep}
              >
                返回修改
              </Button>
              <Button 
                onClick={resetProcess}
                variant="gradient"
              >
                开始新的评估
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 辅助函数：计算总体分数
function calculateOverallScore(resumeData: ResumeData, jobRequirements: JobRequirements) {
  // 简单实现，实际逻辑可以更复杂
  return 7.5; // 暂时返回固定值
}

// 辅助函数：计算技能匹配分数
function calculateSkillScore(resumeData: ResumeData, jobRequirements: JobRequirements) {
  // 根据技能匹配度计算分数
  return 8.0; // 暂时返回固定值
}

// 辅助函数：计算经验匹配分数
function calculateExperienceScore(resumeData: ResumeData, jobRequirements: JobRequirements) {
  // 根据经验匹配度计算分数
  return 7.5; // 暂时返回固定值
}

// 辅助函数：确定技能类别
function determineSkillCategory(skill: string) {
  // 实际实现应该参考KAG知识库
  const categories = ['blockchain', 'smart_contract', 'defi', 'nft', 'dao', 'layer2', 'web3_frontend', 'web3_backend'];
  return categories[Math.floor(Math.random() * categories.length)];
}

// 辅助函数：确定技能级别
function determineSkillLevel(): 'beginner' | 'intermediate' | 'expert' {
  const levels: Array<'beginner' | 'intermediate' | 'expert'> = ['beginner', 'intermediate', 'expert'];
  return levels[Math.floor(Math.random() * levels.length)];
}

// 辅助函数：计算工作持续时间（月数）
function calculateDuration(startDate: string, endDate: string) {
  // 简单实现，未考虑复杂日期格式
  return 18; // 暂时返回固定值
}

// 辅助函数：判断工作经验是否与Web3相关
function isWeb3Related(description: string) {
  // 检查描述中是否包含Web3相关关键词
  const keywords = ['区块链', '智能合约', '以太坊', 'web3', 'blockchain', 'ethereum', 'solidity'];
  return keywords.some(keyword => description.toLowerCase().includes(keyword.toLowerCase()));
}

// 辅助函数：生成优势列表
function generateStrengths(resumeData: ResumeData, jobRequirements: JobRequirements) {
  return [
    '技术栈与岗位需求高度匹配',
    '具有相关行业经验',
    '掌握关键技能和工具'
  ];
}

// 辅助函数：生成劣势列表
function generateWeaknesses(resumeData: ResumeData, jobRequirements: JobRequirements) {
  return [
    '相关经验年限较短',
    '缺少某些特定技能'
  ];
}

// 辅助函数：生成建议列表
function generateRecommendations(resumeData: ResumeData, jobRequirements: JobRequirements) {
  return [
    '加强特定领域的技术深度',
    '获取更多实际项目经验'
  ];
} 