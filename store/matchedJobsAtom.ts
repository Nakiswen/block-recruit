import { atom } from 'jotai';

import type { Job } from '../lib/api';

// 定义全局状态atom，用于存储匹配的岗位列表
export const matchedJobsAtom = atom<Job[]>([]);

// 定义当前简历ID的atom，用于在页面间传递简历ID
export const currentResumeIdAtom = atom<string | null>(null);

// 定义简历处理状态atom
export const resumeProcessingStatusAtom = atom<{
  progress: number;
  status: 'processing' | 'done' | 'failed';
}>({
  progress: 0,
  status: 'processing'
}); 