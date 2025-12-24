'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ResumeAnalysis {
  job: {
    title: string;
    jobType: string;
  };
  createdAt: string;
  recommended: boolean;
  totalScore: number;
  skillScore: number;
  experienceScore: number;
  matchingPoints: string[];
  suggestions: string[];
}

export default function ResumeAnalysisPage() {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch(`/api/business/resume/${id}`);
        const { data } = await response.json();
        setAnalysis(data);
      } catch (error) {
        setError('获取分析结果失败');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  if (loading) {
    return <div className="p-8">加载中...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!analysis) {
    return <div className="p-8">未找到分析结果</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">简历分析结果</h1>

      {/* 基本信息 */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">基本信息</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">岗位</p>
            <p className="font-medium">{analysis.job.title}</p>
          </div>
          <div>
            <p className="text-gray-600">岗位类型</p>
            <p className="font-medium">{analysis.job.jobType}</p>
          </div>
          <div>
            <p className="text-gray-600">分析时间</p>
            <p className="font-medium">{new Date(analysis.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-600">推荐结果</p>
            <p
              className={`font-medium ${analysis.recommended ? 'text-green-600' : 'text-red-600'}`}
            >
              {analysis.recommended ? '推荐面试' : '不推荐面试'}
            </p>
          </div>
        </div>
      </div>

      {/* 评分详情 */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">评分详情</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">总评分</span>
              <span className="font-medium">{analysis.totalScore.toFixed(1)}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${analysis.totalScore * 10}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">技能匹配</span>
              <span className="font-medium">{analysis.skillScore.toFixed(1)}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${analysis.skillScore * 10}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">经验匹配</span>
              <span className="font-medium">{analysis.experienceScore.toFixed(1)}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-600 h-2 rounded-full"
                style={{ width: `${analysis.experienceScore * 10}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 匹配要点 */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">匹配要点</h2>
        <ul className="list-disc list-inside space-y-2">
          {analysis.matchingPoints.map((point: string, index: number) => (
            <li key={index} className="text-gray-700">
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* 改进建议 */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">改进建议</h2>
        <ul className="list-disc list-inside space-y-2">
          {analysis.suggestions.map((suggestion: string, index: number) => (
            <li key={index} className="text-gray-700">
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
