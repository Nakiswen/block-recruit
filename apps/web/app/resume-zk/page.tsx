'use client';

import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from 'ui';

import Cet4Zktls from '../../components/Cet4Zktls';
import DigreeZktls from '../../components/DigreeZktls';
import {
  persistedResumeFormDataAtom,
  persistedVerificationStatusAtom,
  loadDraftDataAtom,
} from '../../store/resumeAtoms';

export default function ManualResumePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useAtom(persistedResumeFormDataAtom);
  const [verificationStatus, setVerificationStatus] = useAtom(persistedVerificationStatusAtom);
  const [, loadDraftData] = useAtom(loadDraftDataAtom);
  const [newSkill, setNewSkill] = useState('');
  const [draftRestored, setDraftRestored] = useState(false);
  const [degreeErrorMessage, setDegreeErrorMessage] = useState('');
  const [englishErrorMessage, setEnglishErrorMessage] = useState('');

  // 从localStorage加载草稿数据
  useEffect(() => {
    // 检查是否有草稿数据
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('resume-draft');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          // 检查是否有实际数据（不是空的默认数据）
          const hasData =
            data.name ||
            data.email ||
            data.summary ||
            data.skills.length > 0 ||
            (data.workExperience.length > 0 && data.workExperience[0].company) ||
            (data.education.length > 0 && data.education[0].school);
          if (hasData) {
            setDraftRestored(true);
            // 3秒后自动隐藏提示
            setTimeout(() => setDraftRestored(false), 3000);
          }
        } catch (error) {
          console.error('Failed to parse draft data:', error);
        }
      }
    }
    loadDraftData();
  }, [loadDraftData]);

  // 实时保存表单数据
  useEffect(() => {
    // 延迟保存，避免频繁写入localStorage
    const timeoutId = setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('resume-draft', JSON.stringify(formData));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData]);

  // 实时保存验证状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('resume-verification-status', JSON.stringify(verificationStatus));
    }
  }, [verificationStatus]);

  const inputClassName =
    'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500';
  const labelClassName = 'block text-sm font-medium text-gray-700 mb-1';

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove),
    });
  };

  const addWorkExperience = () => {
    setFormData({
      ...formData,
      workExperience: [
        ...formData.workExperience,
        { company: '', position: '', startDate: '', endDate: '', description: '' },
      ],
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        { school: '', degree: '', major: '', startDate: '', endDate: '' },
      ],
    });
  };

  const addEnglishLevel = () => {
    setFormData({
      ...formData,
      englishLevel: [...formData.englishLevel, { type: '', score: '', date: '' }],
    });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [
        ...formData.projects,
        { name: '', description: '', startDate: '', endDate: '', url: '' },
      ],
    });
  };

  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [...formData.certifications, { name: '', issuer: '', date: '', url: '' }],
    });
  };

  const clearDraft = () => {
    if (confirm('确定要清除所有草稿数据吗？此操作不可撤销。')) {
      // 重置为初始状态
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
        workExperience: [
          { company: '', position: '', startDate: '', endDate: '', description: '' },
        ],
        education: [{ school: '', degree: '', major: '', startDate: '', endDate: '' }],
        englishLevel: [{ type: '', score: '', date: '' }],
        skills: [],
        projects: [{ name: '', description: '', startDate: '', endDate: '', url: '' }],
        certifications: [{ name: '', issuer: '', date: '', url: '' }],
      });
      setVerificationStatus({
        degreeVerified: false,
        englishVerified: false,
      });
      // 清除错误信息
      setDegreeErrorMessage('');
      setEnglishErrorMessage('');
      // 清除localStorage
      localStorage.removeItem('resume-draft');
      localStorage.removeItem('resume-verification-status');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 生成简历ID
      const resumeId = `resume_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

      // 准备简历数据，包含验证状态
      const resumeData = {
        ...formData,
        id: resumeId,
        verificationStatus,
        createdAt: new Date().toISOString(),
      };

      // 保存到本地存储 (后续可以替换为API调用)
      localStorage.setItem(`resume-${resumeId}`, JSON.stringify(resumeData));

      // 清除草稿数据
      localStorage.removeItem('resume-draft');
      localStorage.removeItem('resume-verification-status');

      // 跳转到简历展示页面
      router.push(`/resume-zk/${resumeId}`);
    } catch (error) {
      console.error('生成简历失败:', error);
      alert('生成简历失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 草稿恢复提示 */}
        {draftRestored && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
            <span className="text-green-600">✅</span>
            <span className="text-green-700 text-sm font-medium">
              已自动恢复您之前填写的草稿数据
            </span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">创建简历</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 基本信息 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">基本信息</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className={labelClassName}>
                    姓名 *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    className={inputClassName}
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={labelClassName}>
                    邮箱 *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    className={inputClassName}
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className={labelClassName}>
                    电话
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className={inputClassName}
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="location" className={labelClassName}>
                    所在地
                  </label>
                  <input
                    id="location"
                    type="text"
                    className={inputClassName}
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* 个人简介 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">个人简介</h2>
              <div>
                <label htmlFor="summary" className={labelClassName}>
                  简介
                </label>
                <textarea
                  id="summary"
                  rows={4}
                  className={inputClassName}
                  value={formData.summary}
                  onChange={e => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="请简要介绍您的专业背景、工作经验和职业目标..."
                />
              </div>
            </div>

            {/* 教育背景 */}
            <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">教育背景 🎓</h2>
                <div className="flex items-center gap-2">
                  <DigreeZktls
                    isVerified={verificationStatus.degreeVerified}
                    onVerificationChange={verified =>
                      setVerificationStatus({ ...verificationStatus, degreeVerified: verified })
                    }
                    name={formData.name}
                    errorMessage={degreeErrorMessage}
                    onErrorMessageChange={setDegreeErrorMessage}
                  />
                </div>
              </div>
              {/* 错误信息显示 */}
              {degreeErrorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">⚠️</span>
                    <span className="text-red-700 text-sm">{degreeErrorMessage}</span>
                  </div>
                </div>
              )}
              {formData.education.map((edu, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-white rounded-lg"
                >
                  <div>
                    <label htmlFor={`school-${index}`} className={labelClassName}>
                      学校
                    </label>
                    <input
                      id={`school-${index}`}
                      type="text"
                      className={inputClassName}
                      value={edu.school}
                      onChange={e => {
                        const newEducation = [...formData.education];
                        newEducation[index].school = e.target.value;
                        setFormData({ ...formData, education: newEducation });
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor={`degree-${index}`} className={labelClassName}>
                      学位
                    </label>
                    <select
                      id={`degree-${index}`}
                      className={inputClassName}
                      value={edu.degree}
                      onChange={e => {
                        const newEducation = [...formData.education];
                        newEducation[index].degree = e.target.value;
                        setFormData({ ...formData, education: newEducation });
                      }}
                    >
                      <option value="">请选择学位</option>
                      <option value="高中">高中</option>
                      <option value="大专">大专</option>
                      <option value="本科">本科</option>
                      <option value="硕士">硕士</option>
                      <option value="博士">博士</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`major-${index}`} className={labelClassName}>
                      专业
                    </label>
                    <input
                      id={`major-${index}`}
                      type="text"
                      className={inputClassName}
                      value={edu.major}
                      onChange={e => {
                        const newEducation = [...formData.education];
                        newEducation[index].major = e.target.value;
                        setFormData({ ...formData, education: newEducation });
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor={`edu-start-${index}`} className={labelClassName}>
                        开始时间
                      </label>
                      <input
                        id={`edu-start-${index}`}
                        type="month"
                        className={inputClassName}
                        value={edu.startDate}
                        onChange={e => {
                          const newEducation = [...formData.education];
                          newEducation[index].startDate = e.target.value;
                          setFormData({ ...formData, education: newEducation });
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor={`edu-end-${index}`} className={labelClassName}>
                        结束时间
                      </label>
                      <input
                        id={`edu-end-${index}`}
                        type="month"
                        className={inputClassName}
                        value={edu.endDate}
                        onChange={e => {
                          const newEducation = [...formData.education];
                          newEducation[index].endDate = e.target.value;
                          setFormData({ ...formData, education: newEducation });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addEducation}
                className="mt-2"
              >
                + 添加教育经历
              </Button>
            </div>

            {/* 英语等级 */}
            <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">英语等级 🏆</h2>
                <div className="flex items-center gap-2">
                  <Cet4Zktls
                    isVerified={verificationStatus.englishVerified}
                    onVerificationChange={verified =>
                      setVerificationStatus({ ...verificationStatus, englishVerified: verified })
                    }
                    name={formData.name}
                    errorMessage={englishErrorMessage}
                    onErrorMessageChange={setEnglishErrorMessage}
                  />
                </div>
              </div>
              {/* 错误信息显示 */}
              {englishErrorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">⚠️</span>
                    <span className="text-red-700 text-sm">{englishErrorMessage}</span>
                  </div>
                </div>
              )}
              {formData.englishLevel.map((level, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-white rounded-lg"
                >
                  <div>
                    <label htmlFor={`english-type-${index}`} className={labelClassName}>
                      考试类型
                    </label>
                    <select
                      id={`english-type-${index}`}
                      className={inputClassName}
                      value={level.type}
                      onChange={e => {
                        const newEnglishLevel = [...formData.englishLevel];
                        newEnglishLevel[index].type = e.target.value;
                        setFormData({ ...formData, englishLevel: newEnglishLevel });
                      }}
                    >
                      <option value="">请选择考试类型</option>
                      <option value="CET4">英语四级 (CET4)</option>
                      <option value="CET6">英语六级 (CET6)</option>
                      <option value="IELTS">雅思 (IELTS)</option>
                      <option value="TOEFL">托福 (TOEFL)</option>
                      <option value="BEC">商务英语 (BEC)</option>
                      <option value="其他">其他</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`english-score-${index}`} className={labelClassName}>
                      成绩
                    </label>
                    <input
                      id={`english-score-${index}`}
                      type="text"
                      className={inputClassName}
                      value={level.score}
                      placeholder="如：425、6.5、85分等"
                      onChange={e => {
                        const newEnglishLevel = [...formData.englishLevel];
                        newEnglishLevel[index].score = e.target.value;
                        setFormData({ ...formData, englishLevel: newEnglishLevel });
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor={`english-date-${index}`} className={labelClassName}>
                      考试时间
                    </label>
                    <input
                      id={`english-date-${index}`}
                      type="month"
                      className={inputClassName}
                      value={level.date}
                      onChange={e => {
                        const newEnglishLevel = [...formData.englishLevel];
                        newEnglishLevel[index].date = e.target.value;
                        setFormData({ ...formData, englishLevel: newEnglishLevel });
                      }}
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addEnglishLevel}
                className="mt-2"
              >
                + 添加英语等级
              </Button>
            </div>

            {/* 工作经历 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">工作经历</h2>
              {formData.workExperience.map((work, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-white rounded-lg"
                >
                  <div>
                    <label htmlFor={`work-company-${index}`} className={labelClassName}>
                      公司名称
                    </label>
                    <input
                      id={`work-company-${index}`}
                      type="text"
                      className={inputClassName}
                      value={work.company}
                      onChange={e => {
                        const newWorkExperience = [...formData.workExperience];
                        newWorkExperience[index].company = e.target.value;
                        setFormData({ ...formData, workExperience: newWorkExperience });
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor={`work-position-${index}`} className={labelClassName}>
                      职位
                    </label>
                    <input
                      id={`work-position-${index}`}
                      type="text"
                      className={inputClassName}
                      value={work.position}
                      onChange={e => {
                        const newWorkExperience = [...formData.workExperience];
                        newWorkExperience[index].position = e.target.value;
                        setFormData({ ...formData, workExperience: newWorkExperience });
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor={`work-start-${index}`} className={labelClassName}>
                      开始时间
                    </label>
                    <input
                      id={`work-start-${index}`}
                      type="month"
                      className={inputClassName}
                      value={work.startDate}
                      onChange={e => {
                        const newWorkExperience = [...formData.workExperience];
                        newWorkExperience[index].startDate = e.target.value;
                        setFormData({ ...formData, workExperience: newWorkExperience });
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor={`work-end-${index}`} className={labelClassName}>
                      结束时间
                    </label>
                    <input
                      id={`work-end-${index}`}
                      type="month"
                      className={inputClassName}
                      value={work.endDate}
                      onChange={e => {
                        const newWorkExperience = [...formData.workExperience];
                        newWorkExperience[index].endDate = e.target.value;
                        setFormData({ ...formData, workExperience: newWorkExperience });
                      }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor={`work-description-${index}`} className={labelClassName}>
                      工作描述
                    </label>
                    <textarea
                      id={`work-description-${index}`}
                      rows={3}
                      className={inputClassName}
                      value={work.description}
                      onChange={e => {
                        const newWorkExperience = [...formData.workExperience];
                        newWorkExperience[index].description = e.target.value;
                        setFormData({ ...formData, workExperience: newWorkExperience });
                      }}
                      placeholder="描述您的工作内容、职责和成就..."
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addWorkExperience}
                className="mt-2"
              >
                + 添加工作经历
              </Button>
            </div>

            {/* 技能清单 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">技能清单</h2>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  placeholder="输入技能名称..."
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button type="button" variant="outline" onClick={addSkill}>
                  添加
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* 项目经历 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">项目经历</h2>
              {formData.projects.map((project, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-white rounded-lg"
                >
                  <div>
                    <label htmlFor={`project-name-${index}`} className={labelClassName}>
                      项目名称
                    </label>
                    <input
                      id={`project-name-${index}`}
                      type="text"
                      className={inputClassName}
                      value={project.name}
                      onChange={e => {
                        const newProjects = [...formData.projects];
                        newProjects[index].name = e.target.value;
                        setFormData({ ...formData, projects: newProjects });
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor={`project-url-${index}`} className={labelClassName}>
                      项目链接
                    </label>
                    <input
                      id={`project-url-${index}`}
                      type="url"
                      className={inputClassName}
                      value={project.url || ''}
                      onChange={e => {
                        const newProjects = [...formData.projects];
                        newProjects[index].url = e.target.value;
                        setFormData({ ...formData, projects: newProjects });
                      }}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label htmlFor={`project-start-${index}`} className={labelClassName}>
                      开始时间
                    </label>
                    <input
                      id={`project-start-${index}`}
                      type="month"
                      className={inputClassName}
                      value={project.startDate}
                      onChange={e => {
                        const newProjects = [...formData.projects];
                        newProjects[index].startDate = e.target.value;
                        setFormData({ ...formData, projects: newProjects });
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor={`project-end-${index}`} className={labelClassName}>
                      结束时间
                    </label>
                    <input
                      id={`project-end-${index}`}
                      type="month"
                      className={inputClassName}
                      value={project.endDate}
                      onChange={e => {
                        const newProjects = [...formData.projects];
                        newProjects[index].endDate = e.target.value;
                        setFormData({ ...formData, projects: newProjects });
                      }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor={`project-description-${index}`} className={labelClassName}>
                      项目描述
                    </label>
                    <textarea
                      id={`project-description-${index}`}
                      rows={3}
                      className={inputClassName}
                      value={project.description}
                      onChange={e => {
                        const newProjects = [...formData.projects];
                        newProjects[index].description = e.target.value;
                        setFormData({ ...formData, projects: newProjects });
                      }}
                      placeholder="描述项目内容、您的角色和取得的成果..."
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addProject}
                className="mt-2"
              >
                + 添加项目经历
              </Button>
            </div>

            {/* 证书 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">证书</h2>
              {formData.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-white rounded-lg"
                >
                  <div>
                    <label htmlFor={`cert-name-${index}`} className={labelClassName}>
                      证书名称
                    </label>
                    <input
                      id={`cert-name-${index}`}
                      type="text"
                      className={inputClassName}
                      value={cert.name}
                      onChange={e => {
                        const newCertifications = [...formData.certifications];
                        newCertifications[index].name = e.target.value;
                        setFormData({ ...formData, certifications: newCertifications });
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor={`cert-issuer-${index}`} className={labelClassName}>
                      颁发机构
                    </label>
                    <input
                      id={`cert-issuer-${index}`}
                      type="text"
                      className={inputClassName}
                      value={cert.issuer}
                      onChange={e => {
                        const newCertifications = [...formData.certifications];
                        newCertifications[index].issuer = e.target.value;
                        setFormData({ ...formData, certifications: newCertifications });
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor={`cert-date-${index}`} className={labelClassName}>
                      获得时间
                    </label>
                    <input
                      id={`cert-date-${index}`}
                      type="month"
                      className={inputClassName}
                      value={cert.date}
                      onChange={e => {
                        const newCertifications = [...formData.certifications];
                        newCertifications[index].date = e.target.value;
                        setFormData({ ...formData, certifications: newCertifications });
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor={`cert-url-${index}`} className={labelClassName}>
                      证书链接
                    </label>
                    <input
                      id={`cert-url-${index}`}
                      type="url"
                      className={inputClassName}
                      value={cert.url || ''}
                      onChange={e => {
                        const newCertifications = [...formData.certifications];
                        newCertifications[index].url = e.target.value;
                        setFormData({ ...formData, certifications: newCertifications });
                      }}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCertification}
                className="mt-2"
              >
                + 添加证书
              </Button>
            </div>

            {/* 提交按钮 */}
            <div className="flex justify-center gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={clearDraft}
                className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 px-8"
              >
                清除草稿
              </Button>

              <Button type="submit" size="md" disabled={isSubmitting} className="px-12">
                {isSubmitting ? '正在生成...' : '生成简历'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
