'use client';

import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Button } from 'ui';

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  url?: string;
  startDate: string;
  endDate: string;
}

interface ResumeFormData {
  personalInfo: PersonalInfo;
  workExperiences: WorkExperience[];
  education: Education[];
  projects: Project[];
  skills: string[];
}

interface ResumeFormProps {
  onSubmit: (data: ResumeFormData) => void;
}

export type { ResumeFormData, PersonalInfo, WorkExperience, Education, Project };

export default function ResumeForm({ onSubmit }: ResumeFormProps) {
  const [formData, setFormData] = useState<ResumeFormData>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
    },
    workExperiences: [
      {
        id: '1',
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
        current: false,
      },
    ],
    education: [
      {
        id: '1',
        school: '',
        degree: '',
        major: '',
        startDate: '',
        endDate: '',
        current: false,
      },
    ],
    projects: [
      {
        id: '1',
        name: '',
        description: '',
        technologies: '',
        url: '',
        startDate: '',
        endDate: '',
      },
    ],
    skills: [''],
  });

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const addWorkExperience = () => {
    const newExp: WorkExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      current: false,
    };
    setFormData(prev => ({
      ...prev,
      workExperiences: [...prev.workExperiences, newExp],
    }));
  };

  const removeWorkExperience = (id: string) => {
    setFormData(prev => ({
      ...prev,
      workExperiences: prev.workExperiences.filter(exp => exp.id !== id),
    }));
  };

  const updateWorkExperience = (
    id: string,
    field: keyof WorkExperience,
    value: string | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      workExperiences: prev.workExperiences.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      major: '',
      startDate: '',
      endDate: '',
      current: false,
    };
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, newEdu],
    }));
  };

  const removeEducation = (id: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map(edu => (edu.id === id ? { ...edu, [field]: value } : edu)),
    }));
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: '',
      url: '',
      startDate: '',
      endDate: '',
    };
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
  };

  const removeProject = (id: string) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id),
    }));
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map(project =>
        project.id === id ? { ...project, [field]: value } : project
      ),
    }));
  };

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, ''],
    }));
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const updateSkill = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => (i === index ? value : skill)),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">个人信息</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="personal-name" className="block text-sm font-medium text-gray-700 mb-1">
              姓名 *
            </label>
            <input
              id="personal-name"
              type="text"
              value={formData.personalInfo.name}
              onChange={e => updatePersonalInfo('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="personal-email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              邮箱 *
            </label>
            <input
              id="personal-email"
              type="email"
              value={formData.personalInfo.email}
              onChange={e => updatePersonalInfo('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="personal-phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              电话
            </label>
            <input
              id="personal-phone"
              type="tel"
              value={formData.personalInfo.phone}
              onChange={e => updatePersonalInfo('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="personal-location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              所在地
            </label>
            <input
              id="personal-location"
              type="text"
              value={formData.personalInfo.location}
              onChange={e => updatePersonalInfo('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <label
            htmlFor="personal-summary"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            个人简介
          </label>
          <textarea
            id="personal-summary"
            value={formData.personalInfo.summary}
            onChange={e => updatePersonalInfo('summary', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="简要介绍您的专业背景和技能特长..."
          />
        </div>
      </div>

      {/* Work Experience */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">工作经历</h3>
          <Button
            type="button"
            onClick={addWorkExperience}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            添加经历
          </Button>
        </div>
        {formData.workExperiences.map((exp, index) => (
          <div key={exp.id} className="border border-gray-200 rounded-md p-4 mb-4">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-md font-medium">工作经历 {index + 1}</h4>
              {formData.workExperiences.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeWorkExperience(exp.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor={`work-company-${exp.id}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  公司名称 *
                </label>
                <input
                  id={`work-company-${exp.id}`}
                  type="text"
                  value={exp.company}
                  onChange={e => updateWorkExperience(exp.id, 'company', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor={`work-position-${exp.id}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  职位 *
                </label>
                <input
                  id={`work-position-${exp.id}`}
                  type="text"
                  value={exp.position}
                  onChange={e => updateWorkExperience(exp.id, 'position', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor={`work-start-date-${exp.id}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  开始时间 *
                </label>
                <input
                  id={`work-start-date-${exp.id}`}
                  type="date"
                  value={exp.startDate}
                  onChange={e => updateWorkExperience(exp.id, 'startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor={`work-end-date-${exp.id}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  结束时间
                </label>
                <div className="space-y-2">
                  <input
                    id={`work-end-date-${exp.id}`}
                    type="date"
                    value={exp.endDate}
                    onChange={e => updateWorkExperience(exp.id, 'endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={exp.current}
                  />
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={e => updateWorkExperience(exp.id, 'current', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">目前在职</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor={`work-description-${exp.id}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                工作描述
              </label>
              <textarea
                id={`work-description-${exp.id}`}
                value={exp.description}
                onChange={e => updateWorkExperience(exp.id, 'description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="描述您的工作职责和成就..."
              />
            </div>
          </div>
        ))}
      </div>

      {/* Education */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">教育背景</h3>
          <Button
            type="button"
            onClick={addEducation}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            添加教育背景
          </Button>
        </div>
        {formData.education.map((edu, index) => (
          <div key={edu.id} className="border border-gray-200 rounded-md p-4 mb-4">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-md font-medium">教育背景 {index + 1}</h4>
              {formData.education.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEducation(edu.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor={`edu-school-${edu.id}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  学校名称 *
                </label>
                <input
                  id={`edu-school-${edu.id}`}
                  type="text"
                  value={edu.school}
                  onChange={e => updateEducation(edu.id, 'school', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor={`edu-degree-${edu.id}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  学位 *
                </label>
                <input
                  id={`edu-degree-${edu.id}`}
                  type="text"
                  value={edu.degree}
                  onChange={e => updateEducation(edu.id, 'degree', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor={`edu-major-${edu.id}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  专业
                </label>
                <input
                  id={`edu-major-${edu.id}`}
                  type="text"
                  value={edu.major}
                  onChange={e => updateEducation(edu.id, 'major', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor={`edu-start-date-${edu.id}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  入学时间
                </label>
                <input
                  id={`edu-start-date-${edu.id}`}
                  type="date"
                  value={edu.startDate}
                  onChange={e => updateEducation(edu.id, 'startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor={`edu-end-date-${edu.id}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  毕业时间
                </label>
                <div className="space-y-2">
                  <input
                    id={`edu-end-date-${edu.id}`}
                    type="date"
                    value={edu.endDate}
                    onChange={e => updateEducation(edu.id, 'endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={edu.current}
                  />
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={edu.current}
                      onChange={e => updateEducation(edu.id, 'current', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">在读</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">项目经历</h3>
          <Button
            type="button"
            onClick={addProject}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            添加项目
          </Button>
        </div>
        {formData.projects.map((project, index) => (
          <div key={project.id} className="border border-gray-200 rounded-md p-4 mb-4">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-md font-medium">项目 {index + 1}</h4>
              {formData.projects.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProject(project.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor={`project-name-${project.id}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  项目名称 *
                </label>
                <input
                  id={`project-name-${project.id}`}
                  type="text"
                  value={project.name}
                  onChange={e => updateProject(project.id, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor={`project-url-${project.id}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  项目链接
                </label>
                <input
                  id={`project-url-${project.id}`}
                  type="url"
                  value={project.url}
                  onChange={e => updateProject(project.id, 'url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label
                  htmlFor={`project-start-date-${project.id}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  开始时间
                </label>
                <input
                  id={`project-start-date-${project.id}`}
                  type="date"
                  value={project.startDate}
                  onChange={e => updateProject(project.id, 'startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor={`project-end-date-${project.id}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  结束时间
                </label>
                <input
                  id={`project-end-date-${project.id}`}
                  type="date"
                  value={project.endDate}
                  onChange={e => updateProject(project.id, 'endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor={`project-description-${project.id}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  项目描述
                </label>
                <textarea
                  id={`project-description-${project.id}`}
                  value={project.description}
                  onChange={e => updateProject(project.id, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="描述项目的目标、功能和您的贡献..."
                />
              </div>
              <div>
                <label
                  htmlFor={`project-technologies-${project.id}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  技术栈
                </label>
                <input
                  id={`project-technologies-${project.id}`}
                  type="text"
                  value={project.technologies}
                  onChange={e => updateProject(project.id, 'technologies', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="React, Node.js, MongoDB, AWS..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">技能</h3>
          <Button
            type="button"
            onClick={addSkill}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            添加技能
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.skills.map((skill, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                id={`skill-${index}`}
                type="text"
                value={skill}
                onChange={e => updateSkill(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="技能名称"
                aria-label={`技能 ${index + 1}`}
              />
              {formData.skills.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" className="px-6">
          保存并继续
        </Button>
      </div>
    </form>
  );
}
