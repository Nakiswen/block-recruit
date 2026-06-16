/**
 * 自定义API请求实现
 * 用于配置axios实例与拦截器
 */
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { getApiBaseUrl } from '../lib/api-url';

// 创建axios实例，配置基础URL
const instance: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 日志函数，只在开发环境下输出
const logRequest = (config: AxiosRequestConfig) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔷 请求: ${config.method?.toUpperCase()} ${config.baseURL || ''}${config.url}`, {
      headers: config.headers,
      params: config.params,
      data: config.data,
    });
  }
};

// 请求拦截器，用于添加认证令牌(从Google OAuth获取)
instance.interceptors.request.use(
  async config => {
    // 在浏览器环境中，尝试从 NextAuth session 获取 token
    if (typeof window !== 'undefined') {
      try {
        // 调用 NextAuth 的 session API 获取当前用户信息
        const sessionResponse = await fetch('/api/auth/session');
        if (sessionResponse.ok) {
          const session = await sessionResponse.json();
          // 如果有 session，使用 email 作为认证（优先级高于 id，因为 id 是 JWT sub）
          if (session?.user) {
            config.headers.Authorization = `Bearer ${session.user.email || session.user.id}`;
          }
        }
      } catch (error) {
        console.warn('Failed to get session:', error);
      }
    }

    // 记录请求日志
    logRequest(config);

    return config;
  },
  error => {
    console.error('❌ 请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器，用于统一处理错误
instance.interceptors.response.use(
  response => {
    // 记录成功响应
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ 响应: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  (error: AxiosError) => {
    // 处理错误响应
    const status = error.response?.status;

    // 处理 401 未授权错误
    if (status === 401 && typeof window !== 'undefined') {
      // Google OAuth 会自动处理 session 过期，这里不需要额外处理
      console.warn('Authentication failed - user may need to sign in again');
    }

    // 输出更详细的错误信息，方便调试
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ API请求错误:', {
        status,
        url: error.config?.url,
        method: error.config?.method,
        message: error.message,
        response: error.response?.data,
      });
    }

    return Promise.reject(error);
  }
);

/**
 * 通用请求函数
 */
export const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await instance.request(config);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export default request;
