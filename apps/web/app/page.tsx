'use client';

import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from 'ui';
import { useSession, signIn } from 'next-auth/react';

import api, { resumeServices } from '../lib/api';
import {
  matchedJobsAtom,
  currentResumeIdAtom,
  resumeProcessingStatusAtom,
} from '../store/matchedJobsAtom';
import { pollWithInterval, HybridProgressManager } from '../utils';

export default function Home() {
  const { data: session, status } = useSession();
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [matchedJobs, setMatchedJobsAtom] = useAtom(matchedJobsAtom);
  const [matchingStarted, setMatchingStarted] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [, setIsLoading] = useState(false);

  const fallbackCountRef = useRef(0);

  const [, setCurrentResumeId] = useAtom(currentResumeIdAtom);
  const [, setResumeProcessingStatus] = useAtom(resumeProcessingStatusAtom);

  const router = useRouter();

  const isLoading = status === 'loading';
  const isAuthenticated = !!session;

  function getRandomSlice<T>(arr: T[]): T[] {
    const randomNum = Math.floor(Math.random() * 10) + 1;
    const endIndex = Math.min(randomNum, arr.length);

    return arr.slice(0, endIndex);
  }

  // 轮询后端进度接口，混合进度条方案
  useEffect(() => {
    if (resumeUploaded && matchingStarted && resumeId) {
      setIsLoading(true);

      // 创建混合进度条管理器
      const progressManager = new HybridProgressManager(progress => setMatchingProgress(progress));

      // 开始伪进度增长
      progressManager.startFakeProgress(90, 200);

      // 轮询后端进度
      const pollProgress = async () => {
        try {
          const result = await pollWithInterval(
            () => api.get(`/resumes/${resumeId}/progress`),
            res => {
              return res.data.status === 'done';
            },
            2000,
            90000 // 1.5分钟超时
          );
          const { progress, status, jobs } = result.data;

          // 更新全局状态
          setResumeProcessingStatus({
            progress: progress || 0,
            status: status || 'processing',
          });

          // 更新真实进度
          if (typeof progress === 'number') {
            progressManager.updateRealProgress(progress);
          }

          if (status === 'done') {
            progressManager.complete(100);
            setIsLoading(false);

            // 获取岗位数据
            if (jobs && Array.isArray(jobs) && jobs.length > 0) {
              setMatchedJobsAtom(getRandomSlice(jobs)); // 存到全局
              setCurrentResumeId(resumeId); // 保存简历ID到全局
            } else {
              // 兜底再拉一次岗位
              if (fallbackCountRef.current < 2) {
                try {
                  const matchedJobsData = await resumeServices.getMatchingJobs(resumeId);
                  if (matchedJobsData && matchedJobsData.length > 0) {
                    progressManager.complete(100);
                    setIsLoading(false);
                    setMatchedJobsAtom(getRandomSlice(matchedJobsData));
                    setCurrentResumeId(resumeId);
                  }
                  fallbackCountRef.current += 1;
                } catch (e) {
                  setUploadError('岗位匹配结果获取失败，请稍后重试');
                  fallbackCountRef.current += 1;
                }
              }
            }
          } else if (status === 'failed') {
            setIsLoading(false);
            setUploadError('简历处理失败，请重试或联系客服');
          }
        } catch (err) {
          // 网络/接口异常时，继续用伪进度

          // 如果多次失败，尝试直接获取匹配结果
          if (fallbackCountRef.current < 2) {
            try {
              const matchedJobsData = await resumeServices.getMatchingJobs(resumeId);
              if (matchedJobsData && matchedJobsData.length > 0) {
                progressManager.complete(100);
                setIsLoading(false);
                setMatchedJobsAtom(getRandomSlice(matchedJobsData));
                setCurrentResumeId(resumeId);
              }
              fallbackCountRef.current += 1;
            } catch (e) {
              fallbackCountRef.current += 1;
            }
          }
        }
      };

      // 只调用一次pollProgress，pollWithInterval内部已经实现了轮询逻辑
      pollProgress();

      return () => {
        progressManager.cleanup();
      };
    }
  }, [
    resumeUploaded,
    matchingStarted,
    resumeId,
    setMatchedJobsAtom,
    setCurrentResumeId,
    setResumeProcessingStatus,
  ]);

  // 初始化数据
  useEffect(() => {
    // 检查是否有已上传简历的标志
    const hasUploadedResume = localStorage.getItem('resumeUploaded') === 'true';
    if (hasUploadedResume) {
      setResumeUploaded(true);

      // 获取resumeId
      const storedResumeId = localStorage.getItem('resumeId');
      if (storedResumeId) {
        setResumeId(storedResumeId);
      }
    }

    // 监听localStorage变化
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'resumeUploaded') {
        const resumeUploaded = e.newValue === 'true';
        setResumeUploaded(resumeUploaded);
      } else if (e.key === 'resumeId') {
        const resumeId = e.newValue;
        setResumeId(resumeId);
      }
    };

    const handleResumeEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.uploaded !== undefined) {
        setResumeUploaded(detail.uploaded);
        if (detail.resumeId) {
          setResumeId(detail.resumeId);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('resumeUploaded', handleResumeEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('resumeUploaded', handleResumeEvent);
    };
  }, []);

  // 处理简历文件选择
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      // 检查文件类型
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/markdown',
        'text/x-markdown',
      ];
      if (!validTypes.includes(file.type)) {
        setUploadError('请上传PDF或Word格式的简历');
        return;
      }

      // 检查文件大小 (限制为5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('文件大小不能超过5MB');
        return;
      }

      setResumeFile(file);
      setUploadError('');
    }
  };

  // 处理简历上传
  const handleResumeUpload = useCallback(async () => {
    if (!resumeFile) {
      setUploadError('请先选择简历文件');
      return;
    }

    setIsUploading(true);

    try {
      // 调用API上传简历
      const response = await resumeServices.uploadResume(resumeFile);

      // 上传成功
      if (response && response.resumeId) {
        setResumeId(response.resumeId);
        setResumeUploaded(true);
        setMatchingStarted(true);
      }

      // 上传成功
      setIsUploading(false);

      // 触发自定义事件
      const event = new CustomEvent('resumeUploaded', {
        detail: { uploaded: true, resumeId: response?.resumeId },
      });
      document.dispatchEvent(event);
    } catch (err) {
      setUploadError('上传失败，请重试');
      setIsUploading(false);
    }
  }, [resumeFile]);

  // 处理 Google 登录
  const handleGoogleSignIn = async () => {
    await signIn('google', { callbackUrl: '/' });
  };

  // 如果正在加载登录状态，显示加载中
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text block mt-2">BlockRecruit</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              你的专属简历分析师，AI 智能匹配 Web3 岗位
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full">
            <div className="text-center">
              <div className="text-gray-600">加载中...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 如果未登录，显示登录界面
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="max-w-md mx-auto px-4">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text block mt-2">BlockRecruit</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              你的专属简历分析师，AI 智能匹配 Web3 岗位
            </p>
          </div>

          {/* 登录卡片 */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">开始您的Web3求职之旅</h3>
              <p className="text-gray-600 mb-6">请先登录以使用简历匹配服务</p>
            </div>

            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 flex items-center justify-center"
              onClick={handleGoogleSignIn}
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              使用 Google 登录
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-10">
      <div className="max-w-md mx-auto px-4">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text block mt-2">BlockRecruit</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            你的专属简历分析师，AI 智能匹配 Web3 岗位
          </p>
        </div>

        {/* 核心流程卡片 */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">开始您的Web3求职之旅</h3>
            <p className="text-gray-600">上传简历，AI智能匹配最适合的岗位</p>
          </div>

          {!resumeUploaded ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-4">上传简历</div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="resume-upload-hero"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-all"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    {resumeFile ? (
                      <p className="mb-2 text-sm text-gray-600">
                        <span className="font-semibold">{resumeFile.name}</span>
                      </p>
                    ) : (
                      <p className="mb-2 text-sm text-gray-600">
                        <span className="font-semibold">点击上传简历</span> 或拖放文件
                      </p>
                    )}
                    <p className="text-xs text-gray-500">支持PDF、DOC、DOCX格式，大小不超过5MB</p>
                  </div>
                  <input
                    id="resume-upload-hero"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown,text/x-markdown"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {uploadError && <div className="text-red-500 text-sm mb-4">{uploadError}</div>}

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                onClick={handleResumeUpload}
                disabled={!resumeFile || isUploading}
              >
                {isUploading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    正在上传...
                  </div>
                ) : (
                  '上传简历并开始匹配'
                )}
              </Button>
            </div>
          ) : matchingProgress < 100 ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-4">正在匹配中...</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${matchingProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                正在分析您的简历并匹配最适合的岗位 ({Math.floor(matchingProgress)}%)
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600 mb-2">匹配完成！</div>
                <p className="text-sm text-gray-600 mb-6">
                  我们为您找到了 {matchedJobs.length} 个合适的Web3岗位
                </p>
              </div>
              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                  onClick={() => {
                    router.push('/jobs');
                  }}
                >
                  查看匹配岗位
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
