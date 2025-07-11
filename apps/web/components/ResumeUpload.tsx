'use client';

import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useState, useCallback } from 'react';
import { Button } from 'ui';

import { ResumeFormData } from './ResumeForm';

interface ResumeUploadProps {
  onUploadComplete: (data: ResumeFormData) => void;
}

interface FileWithPreview extends File {
  preview?: string;
}

export default function ResumeUpload({ onUploadComplete }: ResumeUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [parseResult, setParseResult] = useState<ResumeFormData | null>(null);
  const [error, setError] = useState<string>('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  }, []);

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
      ];
      return validTypes.includes(file.type);
    });

    if (validFiles.length !== newFiles.length) {
      setError('只支持 PDF、DOC、DOCX 和 TXT 格式的文件');
      return;
    }

    setError('');
    setFiles(validFiles);
  };

  const removeFile = (index: number) => {
    setFiles(files => files.filter((_, i) => i !== index));
  };

  const parseResume = async () => {
    if (files.length === 0) {
      setError('请选择要上传的文件');
      return;
    }

    const file = files[0];
    setUploading(true);
    setError('');

    try {
      // 读取文件内容
      const fileContent = await readFileContent(file);

      // 这里可以调用后端API进行简历解析
      // 目前模拟解析结果
      const mockParseResult = {
        personalInfo: {
          name: extractName(fileContent),
          email: extractEmail(fileContent),
          phone: extractPhone(fileContent),
          location: '',
          summary: '',
        },
        workExperiences: [],
        education: [],
        projects: [],
        skills: extractSkills(fileContent),
      };

      setParseResult(mockParseResult);

      // 可以在这里调用实际的解析API
      // const response = await fetch('/api/resume/parse', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     fileName: file.name,
      //     fileContent: fileContent,
      //     fileType: file.type
      //   })
      // })
      //
      // const result = await response.json()
      // if (result.success) {
      //   setParseResult(result.data)
      // } else {
      //   throw new Error(result.error || '解析失败')
      // }
    } catch (error) {
      console.error('解析失败:', error);
      setError('解析失败，请检查文件格式或稍后重试');
    } finally {
      setUploading(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = event => {
        resolve(event.target?.result as string);
      };
      reader.onerror = error => {
        reject(error);
      };
      reader.readAsText(file);
    });
  };

  // 简单的文本提取函数 - 在实际应用中应该使用更复杂的解析库
  const extractName = (content: string): string => {
    // 简单的姓名提取逻辑
    const nameMatch = content.match(/姓名[:\s]*([^\n\r]+)/i);
    return nameMatch ? nameMatch[1].trim() : '';
  };

  const extractEmail = (content: string): string => {
    const emailMatch = content.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
    return emailMatch ? emailMatch[1] : '';
  };

  const extractPhone = (content: string): string => {
    const phoneMatch = content.match(
      /(\+?86)?[\s-]*(1[3-9]\d{9}|\d{3}-\d{4}-\d{4}|\d{3}\s\d{4}\s\d{4})/i
    );
    return phoneMatch ? phoneMatch[0].replace(/\s+/g, '') : '';
  };

  const extractSkills = (content: string): string[] => {
    // 简单的技能提取逻辑
    const skillKeywords = [
      'JavaScript',
      'React',
      'Vue',
      'Node.js',
      'Python',
      'Java',
      'Go',
      'TypeScript',
      'HTML',
      'CSS',
      'Solidity',
      'Web3',
      'blockchain',
    ];
    const foundSkills = skillKeywords.filter(skill =>
      content.toLowerCase().includes(skill.toLowerCase())
    );
    return foundSkills.length > 0 ? foundSkills : [''];
  };

  const handleConfirmParse = () => {
    if (parseResult) {
      onUploadComplete(parseResult);
    }
  };

  const getFileIcon = (_fileType: string) => {
    return <DocumentTextIcon className="h-8 w-8 text-blue-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="w-full">
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="space-y-2">
            <p className="text-xl font-medium text-gray-900">拖拽文件到此处上传</p>
            <p className="text-sm text-gray-500">
              或者
              <label className="cursor-pointer text-blue-600 hover:text-blue-500 ml-1">
                点击选择文件
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleChange}
                />
              </label>
            </p>
            <p className="text-xs text-gray-400">支持 PDF、DOC、DOCX、TXT 格式，最大 10MB</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">已选择文件</h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button
                  onClick={() => removeFile(index)}
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-700 border-red-500"
                >
                  移除
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Parse Button */}
      {files.length > 0 && !parseResult && (
        <div className="flex justify-center">
          <Button onClick={parseResume} disabled={uploading} size="lg">
            {uploading ? '解析中...' : '开始解析简历'}
          </Button>
        </div>
      )}

      {/* Parse Result */}
      {parseResult && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">解析结果</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {parseResult.personalInfo.name && (
                <div>
                  <span className="text-sm font-medium text-gray-700">姓名:</span>
                  <span className="ml-2 text-sm text-gray-900">
                    {parseResult.personalInfo.name}
                  </span>
                </div>
              )}
              {parseResult.personalInfo.email && (
                <div>
                  <span className="text-sm font-medium text-gray-700">邮箱:</span>
                  <span className="ml-2 text-sm text-gray-900">
                    {parseResult.personalInfo.email}
                  </span>
                </div>
              )}
              {parseResult.personalInfo.phone && (
                <div>
                  <span className="text-sm font-medium text-gray-700">电话:</span>
                  <span className="ml-2 text-sm text-gray-900">
                    {parseResult.personalInfo.phone}
                  </span>
                </div>
              )}
            </div>

            {parseResult.skills.length > 0 && parseResult.skills[0] && (
              <div>
                <span className="text-sm font-medium text-gray-700">技能:</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {parseResult.skills.map(
                    (skill: string, index: number) =>
                      skill && (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {skill}
                        </span>
                      )
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-amber-400 mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">注意：</p>
                <p>这是基于简单文本匹配的初步解析结果。建议在下一步中仔细检查和完善信息。</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              onClick={() => {
                setParseResult(null);
                setFiles([]);
              }}
              variant="outline"
            >
              重新上传
            </Button>
            <Button onClick={handleConfirmParse}>确认并继续</Button>
          </div>
        </div>
      )}
    </div>
  );
}
