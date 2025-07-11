'use client';

import { ChevronLeftIcon, ChevronRightIcon , DocumentArrowUpIcon, DocumentTextIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Button } from 'ui';

import ResumeForm, { ResumeFormData } from '../../../components/ResumeForm';
import ResumeGenerate from '../../../components/ResumeGenerate';
import ResumeUpload from '../../../components/ResumeUpload';

type Step = 'form' | 'upload' | 'generate';

interface StepConfig {
  id: Step;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const steps: StepConfig[] = [
  {
    id: 'form',
    title: '填写简历',
    description: '填写个人信息和工作经历',
    icon: DocumentTextIcon,
  },
  {
    id: 'upload',
    title: '上传简历',
    description: '上传已有简历文件',
    icon: DocumentArrowUpIcon,
  },
  {
    id: 'generate',
    title: '生成简历',
    description: '生成PDF简历并添加二维码',
    icon: QrCodeIcon,
  },
];

export default function ResumeCreatePage() {
  const [currentStep, setCurrentStep] = useState<Step>('form');
  const [resumeData, setResumeData] = useState<ResumeFormData | null>(null);

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  const goToNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const goToPrevious = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handleFormSubmit = (data: ResumeFormData) => {
    setResumeData(data);
    goToNext();
  };

  const handleUploadComplete = (data: ResumeFormData) => {
    setResumeData(data);
    goToNext();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">创建简历</h1>
          <p className="text-gray-600">选择填写、上传或生成简历的方式</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <nav aria-label="Progress">
            <ol className="flex items-center">
              {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = index < currentStepIndex;
                const Icon = step.icon;

                return (
                  <li
                    key={step.id}
                    className={`relative ${index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`
                        relative flex h-10 w-10 items-center justify-center rounded-full
                        ${isActive ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : isCompleted ? 'bg-green-600' : 'bg-gray-300'}
                      `}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-4 min-w-0">
                        <span
                          className={`
                          text-sm font-medium
                          ${isActive ? 'text-indigo-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}
                        `}
                        >
                          {step.title}
                        </span>
                        <p className="text-sm text-gray-500">{step.description}</p>
                      </div>
                    </div>
                    {index !== steps.length - 1 && (
                      <div
                        className={`
                        absolute left-5 top-10 -ml-px h-6 w-0.5
                        ${isCompleted ? 'bg-green-600' : 'bg-gray-300'}
                      `}
                      />
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {currentStep === 'form' && <ResumeForm onSubmit={handleFormSubmit} />}
          {currentStep === 'upload' && <ResumeUpload onUploadComplete={handleUploadComplete} />}
          {currentStep === 'generate' && <ResumeGenerate resumeData={resumeData} />}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            onClick={goToPrevious}
            disabled={currentStepIndex === 0}
            variant="outline"
            className="flex items-center"
          >
            <ChevronLeftIcon className="h-4 w-4 mr-2" />
            上一步
          </Button>

          <Button
            onClick={goToNext}
            disabled={currentStepIndex === steps.length - 1}
            className="flex items-center"
          >
            下一步
            <ChevronRightIcon className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
