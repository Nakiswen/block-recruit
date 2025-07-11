'use client';

import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary?: string;
}

interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description?: string;
}

interface Education {
  school: string;
  degree: string;
  major?: string;
  startDate: string;
  endDate: string;
}

interface Project {
  name: string;
  description?: string;
  technologies?: string;
  url?: string;
}

interface Resume {
  personalInfo: PersonalInfo;
  skills?: string[];
  workExperiences?: WorkExperience[];
  education?: Education[];
  projects?: Project[];
}

interface VerificationResult {
  isValid: boolean;
  resume?: Resume;
  verifiedAt?: string;
  message?: string;
}

export default function VerifyResumePage() {
  const params = useParams();
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (params.id) {
      verifyResume(params.id as string);
    }
  }, [params.id]);

  const verifyResume = async (_resumeId: string) => {
    try {
      setLoading(true);
      setError('');

      // 在实际应用中，这里会调用后端API验证简历
      // const response = await fetch(`/api/resume/verify/${resumeId}`)
      // const result = await response.json()

      // 模拟验证过程
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 模拟验证结果
      const mockResult: VerificationResult = {
        isValid: true,
        resume: {
          personalInfo: {
            name: '张三',
            email: 'zhangsan@example.com',
            phone: '13800138000',
            location: '北京市',
            summary: '资深前端开发工程师，专注于React和Web3技术栈。',
          },
          skills: ['React', 'TypeScript', 'Node.js', 'Solidity', 'Web3'],
          workExperiences: [
            {
              company: 'ABC科技有限公司',
              position: '高级前端开发工程师',
              startDate: '2022-01',
              endDate: '2024-01',
              description: '负责公司主要产品的前端开发和架构设计',
            },
          ],
          education: [
            {
              school: '北京大学',
              degree: '计算机科学与技术学士',
              major: '计算机科学与技术',
              startDate: '2018-09',
              endDate: '2022-06',
            },
          ],
          projects: [
            {
              name: 'DeFi交易平台',
              description: '基于以太坊的去中心化交易平台',
              technologies: 'React, Solidity, Web3.js, Ethers.js',
              url: 'https://github.com/example/defi-platform',
            },
          ],
        },
        verifiedAt: new Date().toISOString(),
        message: '简历验证成功',
      };

      setVerificationResult(mockResult);
    } catch (error) {
      console.error('验证失败:', error);
      setError('验证过程中发生错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在验证简历...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <XCircleIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">验证失败</h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              重新验证
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">简历验证</h1>
          <p className="text-gray-600">验证简历的真实性和完整性</p>
        </div>

        {/* Verification Status */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-center mb-4">
            {verificationResult?.isValid ? (
              <CheckCircleIcon className="h-16 w-16 text-green-400" />
            ) : (
              <XCircleIcon className="h-16 w-16 text-red-400" />
            )}
          </div>

          <div className="text-center">
            <h2
              className={`text-xl font-semibold mb-2 ${
                verificationResult?.isValid ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {verificationResult?.isValid ? '验证通过' : '验证失败'}
            </h2>

            <p
              className={`text-sm ${
                verificationResult?.isValid ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {verificationResult?.message || '未知状态'}
            </p>

            {verificationResult?.verifiedAt && (
              <p className="text-xs text-gray-500 mt-2">
                验证时间: {formatDate(verificationResult.verifiedAt)}
              </p>
            )}
          </div>
        </div>

        {/* Resume Content */}
        {verificationResult?.isValid && verificationResult.resume && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-5 w-5 text-amber-400 mr-2" />
              <span className="text-sm font-medium text-amber-800">已验证简历内容</span>
            </div>

            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">个人信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">姓名:</span>
                    <p className="text-sm text-gray-900">
                      {verificationResult.resume.personalInfo.name}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">邮箱:</span>
                    <p className="text-sm text-gray-900">
                      {verificationResult.resume.personalInfo.email}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">电话:</span>
                    <p className="text-sm text-gray-900">
                      {verificationResult.resume.personalInfo.phone}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">地址:</span>
                    <p className="text-sm text-gray-900">
                      {verificationResult.resume.personalInfo.location}
                    </p>
                  </div>
                </div>
                {verificationResult.resume.personalInfo.summary && (
                  <div className="mt-4">
                    <span className="text-sm font-medium text-gray-500">个人简介:</span>
                    <p className="text-sm text-gray-900 mt-1">
                      {verificationResult.resume.personalInfo.summary}
                    </p>
                  </div>
                )}
              </div>

              {/* Skills */}
              {(verificationResult.resume.skills?.length || 0) > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">技能</h3>
                  <div className="flex flex-wrap gap-2">
                    {verificationResult.resume.skills?.map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Work Experience */}
              {(verificationResult.resume.workExperiences?.length || 0) > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">工作经历</h3>
                  <div className="space-y-4">
                    {verificationResult.resume.workExperiences?.map(
                      (exp: WorkExperience, index: number) => (
                        <div key={index} className="border-l-4 border-blue-200 pl-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-md font-medium text-gray-900">{exp.position}</h4>
                              <p className="text-sm text-gray-600">{exp.company}</p>
                            </div>
                            <div className="text-xs text-gray-500">
                              {exp.startDate} - {exp.endDate}
                            </div>
                          </div>
                          {exp.description && (
                            <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Education */}
              {(verificationResult.resume.education?.length || 0) > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">教育背景</h3>
                  <div className="space-y-4">
                    {verificationResult.resume.education?.map((edu: Education, index: number) => (
                      <div key={index} className="border-l-4 border-green-200 pl-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-md font-medium text-gray-900">{edu.degree}</h4>
                            <p className="text-sm text-gray-600">{edu.school}</p>
                            {edu.major && (
                              <p className="text-sm text-gray-600">专业: {edu.major}</p>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {edu.startDate} - {edu.endDate}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {(verificationResult.resume.projects?.length || 0) > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">项目经历</h3>
                  <div className="space-y-4">
                    {verificationResult.resume.projects?.map((project: Project, index: number) => (
                      <div key={index} className="border-l-4 border-purple-200 pl-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-md font-medium text-gray-900">{project.name}</h4>
                            {project.technologies && (
                              <p className="text-sm text-gray-600">
                                技术栈: {project.technologies}
                              </p>
                            )}
                          </div>
                        </div>
                        {project.description && (
                          <p className="text-sm text-gray-600 mt-2">{project.description}</p>
                        )}
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 mt-1 inline-block"
                          >
                            查看项目 →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">安全提示:</p>
              <ul className="mt-1 list-disc list-inside space-y-1">
                <li>此验证页面确保简历内容的真实性和完整性</li>
                <li>简历内容由本人提交并通过区块链技术保护</li>
                <li>如有疑问，请联系简历所有者进行确认</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
