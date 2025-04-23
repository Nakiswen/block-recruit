'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { DocumentTextIcon, ArrowUpTrayIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface ResumeUploadProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: string[];
  maxSizeMB?: number;
  className?: string;
  label?: string;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({
  onFileSelect,
  acceptedFileTypes = ['.pdf', '.docx', '.doc'],
  maxSizeMB = 5,
  className = '',
  label = '上传简历',
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = useCallback((fileToValidate: File) => {
    setError(null);
    
    // 检查文件类型
    const fileExtension = '.' + fileToValidate.name.split('.').pop()?.toLowerCase();
    if (!acceptedFileTypes.includes(fileExtension)) {
      setError(`文件类型不被支持。请上传 ${acceptedFileTypes.join(', ')} 格式的文件。`);
      return;
    }
    
    // 检查文件大小
    const fileSizeMB = fileToValidate.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`文件过大。最大支持 ${maxSizeMB}MB。`);
      return;
    }
    
    setFile(fileToValidate);
    onFileSelect(fileToValidate);
  }, [acceptedFileTypes, maxSizeMB, onFileSelect]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  }, [validateAndSetFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  }, [validateAndSetFile]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const removeFile = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      // 释放文件引用以避免内存泄露
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
  }, []);

  return (
    <div className={className}>
      <div 
        className={`relative rounded-2xl p-8 transition-all duration-300 ${
          isDragging 
            ? 'border-2 border-dashed border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-md' 
            : file 
              ? 'border-2 border-dashed border-indigo-400 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-md' 
              : 'border-2 border-dashed border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-white hover:shadow-md'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={file ? undefined : handleClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={acceptedFileTypes.join(',')}
          className="hidden"
        />
        
        {!file ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-md transform transition-transform hover:scale-105">
              <ArrowUpTrayIcon className="h-8 w-8 text-white" />
            </div>
            <div className="text-sm">
              <label className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 hover:text-indigo-700 cursor-pointer">
                {label}
              </label>
              <p className="mt-1 text-gray-500">或拖放文件到此处</p>
            </div>
            <p className="text-xs text-gray-500 bg-white bg-opacity-70 backdrop-blur-sm rounded-lg py-1.5 px-3 inline-block shadow-sm">
              支持 {acceptedFileTypes.join(', ')} 格式，最大 {maxSizeMB}MB
            </p>
          </div>
        ) : (
          <div className="flex items-center p-4 bg-white rounded-xl shadow-md border border-gray-100">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-sm">
              <DocumentTextIcon className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1 min-w-0 ml-4">
              <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <button 
              type="button" 
              onClick={removeFile}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 px-4 py-2 bg-red-50 text-sm text-red-600 rounded-lg border border-red-200 shadow-sm">
          <p className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
            {error}
          </p>
        </div>
      )}
    </div>
  );
};

// 使用React.memo减少不必要的重渲染
export default React.memo(ResumeUpload); 