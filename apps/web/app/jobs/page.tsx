"use client";

import { useState, useEffect } from "react";
import { Button } from "ui";
import { jobServices, applicationServices, userServices, Job } from '../../lib/api';

/**
 * 岗位列表页面
 * 展示所有匹配到的岗位，支持展开详情和申请操作
 */
export default function JobsPage() {
  // 展开状态，记录每个岗位是否展开
  const [expandedState, setExpandedState] = useState<Record<string, boolean>>({});
  // 记录已申请的岗位ID
  const [appliedJobId, setAppliedJobId] = useState<string | null>(null);
  // 岗位数据
  const [jobs, setJobs] = useState<Job[]>([]);
  // 当前用户
  const [currentUser, setCurrentUser] = useState<any>(null);
  // 加载状态
  const [isLoading, setIsLoading] = useState(true);
  // 错误信息
  const [error, setError] = useState<string | null>(null);
  // 简历ID
  const [resumeId, setResumeId] = useState<string | null>(null);

  // 获取用户信息和岗位数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // 获取当前用户信息
        try {
          const userData = await userServices.getCurrentUser();
          setCurrentUser(userData);
        } catch (error) {
          console.error('获取用户信息失败:', error);
        }
        
        // 获取简历ID
        const storedResumeId = localStorage.getItem('resumeId');
        if (storedResumeId) {
          setResumeId(storedResumeId);
          
          // 如果有简历ID，尝试获取匹配的岗位
          try {
            const matchedJobs = await jobServices.getJobs();
            setJobs(matchedJobs);
          } catch (error) {
            console.error('获取匹配岗位失败:', error);
            setError('获取岗位数据失败，请稍后重试');
            
            // 获取所有岗位作为备选
            try {
              const allJobs = await jobServices.getJobs();
              setJobs(allJobs);
            } catch (jobsError) {
              setError('获取岗位数据失败，请稍后重试');
            }
          }
        } else {
          // 如果没有简历ID，获取所有岗位
          const allJobs = await jobServices.getJobs();
          setJobs(allJobs);
        }
      } catch (error) {
        console.error('加载数据失败:', error);
        setError('加载数据失败，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // 切换岗位详情展开/收起
  const toggleJobExpanded = (jobId: string) => {
    setExpandedState(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  // 处理岗位申请
  const handleApplyJob = async (jobId: string) => {
    if (!currentUser || !currentUser.id) {
      setError('请先登录后再申请岗位');
      return;
    }
    
    try {
      // 调用API创建投递记录
      await applicationServices.createApplication({
        userId: currentUser.id,
        jobId: jobId
      });
      
      // 设置申请成功状态
      setAppliedJobId(jobId);
      
      // 2秒后清除提示
      setTimeout(() => {
        setAppliedJobId(null);
      }, 3000);
    } catch (error) {
      console.error('岗位申请失败:', error);
      setError('岗位申请失败，请重试');
    }
  };

  // 加载中状态
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto py-10">
      {/* 顶部栏 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">匹配岗位 ({jobs.length})</h2>
        <Button variant="outline" onClick={() => window.location.href = "/"}>
          返回主页
        </Button>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* 岗位列表 */}
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {jobs.map(job => {
            const isExpanded = expandedState[job.id] || false;
            const isApplied = appliedJobId === job.id;
            return (
              <div key={job.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold">{job.title} <span className="text-blue-600 font-medium ml-2">{job.salary}</span></h3>
                    </div>
                    <p className="text-gray-600">{job.company} · {job.location}</p>
                  </div>
                  {job.matchScore && (
                    <div className="bg-purple-100 text-purple-800 font-medium px-3 py-1 rounded-full text-sm ml-4">
                      匹配度 {job.matchScore}%
                    </div>
                  )}
                </div>

                {/* 岗位要求 */}
                <div className="mt-4 border border-gray-100 rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium text-gray-900 mb-2">岗位要求</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {typeof job.requirements === 'string' 
                      ? job.requirements.split(',').map((req, index) => (
                          <li key={index}>{req.trim()}</li>
                        ))
                      : job.requirements.map((req: string, index: number) => (
                          <li key={index}>{req}</li>
                        ))}
                  </ul>
                </div>

                {/* 展开后显示详细描述 */}
                {isExpanded && (
                  <div className="mt-4 animate-fadeIn">
                    <h4 className="font-medium text-gray-900 mb-2">职位描述</h4>
                    <p className="text-gray-700">{job.description}</p>
                  </div>
                )}

                <div className="mt-6 flex justify-between items-center">
                  <button
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                    onClick={() => toggleJobExpanded(job.id)}
                  >
                    {isExpanded ? '收起详情' : '查看详情'}
                    <svg
                      className={`ml-1 w-4 h-4 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  <div className="flex items-center">
                    {isApplied && (
                      <div className="animate-fadeIn mr-4 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        申请成功
                      </div>
                    )}
                    <Button
                      onClick={() => handleApplyJob(job.id)}
                      disabled={isApplied}
                    >
                      {isApplied ? '已申请' : '申请并发送证明'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">暂无匹配岗位，请先上传简历或稍后再试</p>
        </div>
      )}

      {/* 动画样式 */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
} 