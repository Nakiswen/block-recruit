'use client';

import { Card } from 'ui';

interface SkillMatch {
  skill: string;
  category: string;
  relevance: number;
  level?: 'beginner' | 'intermediate' | 'expert';
  description?: string;
}

interface ExperienceMatch {
  company: string;
  position: string;
  relevance: number;
  duration: number;
  web3Related: boolean;
}

interface LearningResource {
  title: string;
  url: string;
  type: string;
}

interface Web3Evaluation {
  skillMatches: SkillMatch[];
  missingSkills: string[];
  strengthAreas: string[];
  improvementAreas: string[];
  careerSuggestions: string[];
  learningResources: Array<{
    skill: string;
    resources: LearningResource[];
  }>;
}

interface EvaluationResult {
  overallScore: number;
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  projectsScore: number;
  matchingSkills: SkillMatch[];
  relevantExperience: ExperienceMatch[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  web3Evaluation?: Web3Evaluation;
}

interface ResumeEvaluationResultProps {
  result: EvaluationResult;
  jobRequirements: {
    title: string;
    level: string;
  };
}

const ResumeEvaluationResult: React.FC<ResumeEvaluationResultProps> = ({
  result,
  jobRequirements,
}) => {
  // 显示分数的函数
  const renderScore = (score: number) => {
    const color = score >= 8 ? 'text-green-600' :
                  score >= 6 ? 'text-yellow-600' : 'text-red-600';
    return <span className={`text-2xl font-bold ${color}`}>{score.toFixed(1)}/10</span>;
  };

  // 显示技能匹配级别的标签
  const renderSkillLevel = (level?: string) => {
    if (!level) return null;
    
    const color = level === 'expert' ? 'bg-green-100 text-green-800' :
                  level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800';
    
    const label = level === 'expert' ? '专家' :
                  level === 'intermediate' ? '熟练' : '入门';
    
    return (
      <span className={`ml-2 inline-block px-2 py-0.5 text-xs rounded-full ${color}`}>
        {label}
      </span>
    );
  };

  // 显示结果建议
  const renderDecision = () => {
    if (result.overallScore >= 7.5) {
      return (
        <div className="flex items-center bg-green-100 text-green-800 px-4 py-3 rounded mt-4">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">推荐进入面试环节</span>
        </div>
      );
    } else if (result.overallScore >= 6) {
      return (
        <div className="flex items-center bg-yellow-100 text-yellow-800 px-4 py-3 rounded mt-4">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">可考虑进入面试环节，但有待提高</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center bg-red-100 text-red-800 px-4 py-3 rounded mt-4">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">不推荐进入面试环节</span>
        </div>
      );
    }
  };

  // 获取职位级别的中文显示
  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'junior': return '初级';
      case 'mid': return '中级';
      case 'senior': return '高级';
      default: return level;
    }
  };

  return (
    <div className="space-y-8">
      <Card title="评估报告" subtitle={`${jobRequirements.title} (${getLevelLabel(jobRequirements.level)})`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">总体评分</h4>
            <div className="flex items-baseline">
              {renderScore(result.overallScore)}
              <div className="ml-4 text-sm text-gray-600">
                {result.overallScore >= 8 ? '非常匹配' :
                 result.overallScore >= 6 ? '基本匹配' : '匹配度不高'}
              </div>
            </div>
            {renderDecision()}
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">各项评分</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">技能匹配度</span>
                <div className="flex items-center">
                  <div className="w-48 bg-gray-200 rounded-full h-2.5 mr-2">
                    <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${result.skillsScore * 10}%` }}></div>
                  </div>
                  <span className="text-sm font-medium">{result.skillsScore.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">经验匹配度</span>
                <div className="flex items-center">
                  <div className="w-48 bg-gray-200 rounded-full h-2.5 mr-2">
                    <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${result.experienceScore * 10}%` }}></div>
                  </div>
                  <span className="text-sm font-medium">{result.experienceScore.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">教育背景</span>
                <div className="flex items-center">
                  <div className="w-48 bg-gray-200 rounded-full h-2.5 mr-2">
                    <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${result.educationScore * 10}%` }}></div>
                  </div>
                  <span className="text-sm font-medium">{result.educationScore.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">项目经验</span>
                <div className="flex items-center">
                  <div className="w-48 bg-gray-200 rounded-full h-2.5 mr-2">
                    <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${result.projectsScore * 10}%` }}></div>
                  </div>
                  <span className="text-sm font-medium">{result.projectsScore.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="匹配技能" subtitle="与职位需求相关的技能">
          <ul className="divide-y divide-gray-200">
            {result.matchingSkills.map((skill, index) => (
              <li key={index} className="py-3 flex justify-between">
                <div>
                  <span className="font-medium">{skill.skill}</span>
                  {renderSkillLevel(skill.level)}
                </div>
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                    <div 
                      className={`h-1.5 rounded-full ${
                        skill.relevance >= 8 ? 'bg-green-500' : 
                        skill.relevance >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} 
                      style={{ width: `${skill.relevance * 10}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{skill.relevance}/10</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="相关经验" subtitle="与职位相关的工作经历">
          <ul className="divide-y divide-gray-200">
            {result.relevantExperience.map((exp, index) => (
              <li key={index} className="py-3">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{exp.position}</span>
                  <span className="text-sm text-gray-500">
                    {Math.floor(exp.duration / 12) > 0 ? `${Math.floor(exp.duration / 12)}年` : ''}
                    {exp.duration % 12 > 0 ? `${exp.duration % 12}个月` : ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{exp.company}</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                      <div 
                        className={`h-1.5 rounded-full ${
                          exp.relevance >= 8 ? 'bg-green-500' : 
                          exp.relevance >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} 
                        style={{ width: `${exp.relevance * 10}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{exp.relevance}/10</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="优势">
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            {result.strengths.map((strength, index) => (
              <li key={index} className="text-sm">{strength}</li>
            ))}
          </ul>
        </Card>

        <Card title="不足">
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            {result.weaknesses.map((weakness, index) => (
              <li key={index} className="text-sm">{weakness}</li>
            ))}
          </ul>
        </Card>

        <Card title="建议">
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            {result.recommendations.map((recommendation, index) => (
              <li key={index} className="text-sm">{recommendation}</li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Web3知识库评估结果 */}
      {result.web3Evaluation && (
        <>
          <Card title="Web3技能评估" subtitle="基于Web3知识库的专业技能评估">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Web3技能匹配 */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">技能匹配</h4>
                <ul className="divide-y divide-gray-200">
                  {result.web3Evaluation.skillMatches.slice(0, 5).map((skill, index) => (
                    <li key={index} className="py-3">
                      <div className="flex justify-between mb-1">
                        <div className="font-medium flex items-center">
                          {skill.skill}
                          {renderSkillLevel(skill.level)}
                          <span className="ml-2 text-xs text-gray-500 px-1.5 py-0.5 bg-gray-100 rounded">
                            {getCategoryLabel(skill.category)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                            <div 
                              className={`h-1.5 rounded-full ${
                                skill.relevance >= 8 ? 'bg-green-500' : 
                                skill.relevance >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                              }`} 
                              style={{ width: `${skill.relevance * 10}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{skill.relevance.toFixed(1)}</span>
                        </div>
                      </div>
                      {skill.description && (
                        <p className="text-xs text-gray-600 mt-1">{skill.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
                {result.web3Evaluation.skillMatches.length > 5 && (
                  <div className="text-right mt-2">
                    <span className="text-xs text-gray-500">
                      还有 {result.web3Evaluation.skillMatches.length - 5} 项技能未显示
                    </span>
                  </div>
                )}
              </div>

              {/* 缺失技能 */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">缺失的关键技能</h4>
                {result.web3Evaluation.missingSkills.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    {result.web3Evaluation.missingSkills.map((skill, index) => (
                      <li key={index} className="text-sm">{skill}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-green-600">已掌握所有关键技能</p>
                )}
                <h4 className="font-medium text-gray-700 mt-4 mb-2">优势领域</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {result.web3Evaluation.strengthAreas.map((area, index) => (
                    <li key={index} className="text-sm">{area}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 职业发展建议 */}
            <Card title="职业发展建议" subtitle="基于Web3知识库的职业发展路径">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">需要提升的领域</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {result.web3Evaluation.improvementAreas.map((area, index) => (
                      <li key={index} className="text-sm">{area}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">职业发展方向</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {result.web3Evaluation.careerSuggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm">{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            {/* 学习资源推荐 */}
            <Card title="学习资源推荐" subtitle="针对性的Web3学习资源">
              {result.web3Evaluation.learningResources.length > 0 ? (
                <div className="space-y-4">
                  {result.web3Evaluation.learningResources.slice(0, 2).map((item, index) => (
                    <div key={index}>
                      <h4 className="font-medium text-gray-700 mb-2">{item.skill}</h4>
                      <ul className="space-y-2">
                        {item.resources.map((resource, resIndex) => (
                          <li key={resIndex} className="text-sm">
                            <a 
                              href={resource.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-800 flex items-center"
                            >
                              <ResourceTypeIcon type={resource.type} />
                              <span>{resource.title}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {result.web3Evaluation.learningResources.length > 2 && (
                    <p className="text-sm text-gray-500 italic">
                      还有更多资源推荐未显示...
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-600">没有特定的学习资源推荐</p>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

// 资源类型的图标
const ResourceTypeIcon = ({ type }: { type: string }) => {
  let icon;
  
  switch (type) {
    case 'documentation':
      icon = (
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      );
      break;
    case 'course':
      icon = (
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
        </svg>
      );
      break;
    case 'tutorial':
      icon = (
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
          <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
        </svg>
      );
      break;
    case 'book':
      icon = (
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
        </svg>
      );
      break;
    default:
      icon = (
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      );
  }
  
  return icon;
};

// 获取类别的中文标签
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'blockchain': '区块链',
    'web3': 'Web3',
    'defi': 'DeFi',
    'nft': 'NFT',
    'dao': 'DAO',
    'programming': '编程',
    'other': '其他'
  };
  
  return labels[category] || category;
}

export default ResumeEvaluationResult; 