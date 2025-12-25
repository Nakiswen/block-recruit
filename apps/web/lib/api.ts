/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

// 确定是否使用代理
const shouldUseProxy = process.env.NODE_ENV === 'development';

// 创建axios实例，配置基础URL
const api = axios.create({
  // 如果是开发环境，使用代理路径；否则使用环境变量中的API URL
  baseURL: shouldUseProxy
    ? '/api/business'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器，用于添加认证令牌
api.interceptors.request.use(
  config => {
    // 在浏览器环境中获取token
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// API响应类型定义
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  similarity?: number;
  description: string;
  responsibilities: string;
  requirements: string;
  benefits?: string;
  companyIntroduction?: string;
  companyWebsite?: string;
  createdAt: string;
}

export interface NFTAchievement {
  id: string;
  title: string;
  description: string;
  image: string;
  type: string;
  verifiedBy: string;
  icon: string;
  bgColor?: string;
}

export interface User {
  id: string;
  address: string;
  nickname: string;
  email: string;
  createdAt: string;
}

export interface Resume {
  id: string;
  userId: string;
  content: string;
  skills: string[];
  createdAt: string;
}

export interface LoginRequest {
  address: string;
  signature: string;
  nonce: string;
}

export interface LoginResponse {
  token: string;
}

// API服务方法

// 认证相关
export const authServices = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },
};

// 岗位上传请求类型
export interface CreateJobRequest {
  positionName: string;
  company: string;
  description?: string;
  responsibilities?: string;
  requirements?: string;
  benefits?: string;
  minSalary?: number;
  maxSalary?: number;
  location?: string;
  workTypeName?: string;
  officeModeName?: string;
  leverName?: string;
  companyIntroduction?: string;
  companyWebsite?: string;
  companyLogo?: string;
  companySizeName?: string;
  email?: string;
  phone?: string;
  wechat?: string;
  telegram?: string;
  tags?: string[];
}

// 岗位上传响应类型
export interface UploadJobResponse {
  code: number;
  message: string;
  data: {
    jobId: string;
    vectorized: boolean;
  };
}

// 岗位相关
export const jobServices = {
  getJobs: async (params?: {
    page?: number;
    pageSize?: number;
  }): Promise<{
    jobs: Job[];
    total: number;
  }> => {
    const response = await api.get<{
      code: number;
      data: {
        jobs: Job[];
        total: number;
      };
      cache: boolean;
    }>('/jobs', { params });

    // 后端返回的是 { code: 0, data: jobs, cache } 格式，需要解包 data 字段
    return response.data.data;
  },

  uploadJob: async (jobData: CreateJobRequest): Promise<UploadJobResponse> => {
    const response = await api.post<UploadJobResponse>('/jobs/upload', jobData);
    return response.data;
  },
};

// 简历相关
export const resumeServices = {
  uploadResume: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await api.post('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  matchResume: async (): Promise<any> => {
    const response = await api.post('/resumes/match');
    return response.data;
  },

  getMatchingJobs: async (
    resumeId: string,
    params?: {
      minMatchScore?: number;
      location?: string;
      industry?: string;
      educationLevel?: string;
      experienceYears?: number;
    }
  ): Promise<Job[]> => {
    const response = await api.get<Job[]>(`/resumes/${resumeId}/matching-jobs`, { params });
    return response.data;
  },
};

// 投递记录相关
export const applicationServices = {
  createApplication: async (data: { userId: string; jobId: string }): Promise<any> => {
    const response = await api.post('/applications/createApplication', data);
    return response.data;
  },

  getUserApplications: async (userId: string): Promise<any> => {
    const response = await api.get('/applications/getHistoryByUserId', { params: { userId } });
    return response.data;
  },

  getJobApplications: async (jobId: string): Promise<any> => {
    const response = await api.get('/applications/getHistoryByJobId', { params: { jobId } });
    return response.data;
  },
};

// 用户相关
export const userServices = {
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },
};

// NFT相关
export const nftServices = {
  getUserNfts: async (userId: string): Promise<any> => {
    const response = await api.get('/nft/user', { params: { userId } });
    return response.data;
  },

  recordNftAchievement: async (data: {
    userId: string;
    type: string;
    data: string;
  }): Promise<any> => {
    const response = await api.post('/nft/achievement', data);
    return response.data;
  },
};
export default api;
