/**
 * API客户端使用示例
 * 该文件展示如何使用自动生成的API客户端
 */

// 导入API客户端
import { BlockRecruitAPI } from '../services/api-client';

// 初始化API客户端
const apiClient = new BlockRecruitAPI({
  // 可以传入配置覆盖默认设置
  BASE: process.env.NEXT_PUBLIC_API_URL, // 如果在服务器端渲染，则使用环境变量
});

/**
 * 认证相关API调用示例
 */
export const authExamples = {
  // 获取登录挑战
  getChallenge: async (address: string) => {
    try {
      return await apiClient.auth.getAuthChallenge(address);
    } catch (error) {
      console.error('获取挑战失败:', error);
      throw error;
    }
  },
  
  // 用户登录
  login: async (address: string, signature: string, nonce: string) => {
    try {
      const response = await apiClient.auth.postAuthLogin({
        address,
        signature,
        nonce
      });
      
      // 保存token到localStorage
      if (typeof window !== 'undefined' && response.token) {
        localStorage.setItem('token', response.token);
      }
      
      return response;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  }
};

/**
 * 简历相关API调用示例
 */
export const resumeExamples = {
  // 上传简历
  uploadResume: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      // 注意：这里需要根据实际生成的API调整
      // 检查API具体函数名称和参数类型
      return await apiClient.resumes.postResumesUpload({ resume: file });
    } catch (error) {
      console.error('简历上传失败:', error);
      throw error;
    }
  },
  
  // 获取简历匹配的岗位
  getMatchingJobs: async (resumeId: string, filters?: {
    minMatchScore?: number;
    location?: string;
    industry?: string; 
    educationLevel?: string;
    experienceYears?: number;
  }) => {
    try {
      // 使用正确的函数名和参数格式
      return await apiClient.resumes.getResumesMatchingJobs(
        resumeId,
        filters?.minMatchScore,
        filters?.location,
        filters?.industry,
        filters?.educationLevel,
        filters?.experienceYears
      );
    } catch (error) {
      console.error('获取匹配岗位失败:', error);
      throw error;
    }
  }
};

/**
 * 岗位相关API调用示例
 */
export const jobExamples = {
  // 获取岗位列表
  getJobs: async (page?: number, pageSize?: number) => {
    try {
      // 注意：需要根据实际生成的API调整参数传递方式
      return await apiClient.jobs.getJobs(page, pageSize);
    } catch (error) {
      console.error('获取岗位列表失败:', error);
      throw error;
    }
  }
};

/**
 * 用户相关API调用示例
 */
export const userExamples = {
  // 获取当前用户信息
  getCurrentUser: async () => {
    try {
      return await apiClient.users.getUsersMe();
    } catch (error) {
      console.error('获取用户信息失败:', error);
      throw error;
    }
  }
};

/**
 * 投递记录相关API调用示例
 */
export const applicationExamples = {
  // 创建投递记录
  createApplication: async (userId: string, jobId: string) => {
    try {
      return await apiClient.applications.postApplicationsCreateApplication({
        userId,
        jobId
      });
    } catch (error) {
      console.error('创建投递记录失败:', error);
      throw error;
    }
  },
  
  // 获取用户的投递历史
  getUserApplications: async (userId: string) => {
    try {
      return await apiClient.applications.getApplicationsGetHistoryByUserId(userId);
    } catch (error) {
      console.error('获取用户投递历史失败:', error);
      throw error;
    }
  }
}; 