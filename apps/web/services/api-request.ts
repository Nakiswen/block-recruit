/**
 * 自定义API请求实现
 * 用于配置axios实例与拦截器
 */
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// 确定是否使用代理
const shouldUseProxy = process.env.NODE_ENV === 'development';

// 创建axios实例，配置基础URL
const instance: AxiosInstance = axios.create({
  // 如果是开发环境，使用代理路径；否则使用环境变量中的API URL
  baseURL: shouldUseProxy 
    ? '' // 空字符串，因为我们会在Next.js配置中处理代理
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
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

// 请求拦截器，用于添加认证令牌
instance.interceptors.request.use(
  (config) => {
    // 在浏览器环境中获取token
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 修改API请求路径，确保正确处理
    if (shouldUseProxy && config.url) {
      // 确保URL以/api开头
      if (!config.url.startsWith('/api') && !config.url.startsWith('http')) {
        config.url = `/api${config.url.startsWith('/') ? '' : '/'}${config.url}`;
      }
    }
    
    // 记录请求日志
    logRequest(config);
    
    return config;
  },
  (error) => {
    console.error('❌ 请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器，用于统一处理错误
instance.interceptors.response.use(
  (response) => {
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
    
    // 处理 401 未授权错误，可以在这里执行登出操作
    if (status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      // 可以添加重定向到登录页面的逻辑
    }
    
    // 输出更详细的错误信息，方便调试
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ API请求错误:', {
        status,
        url: error.config?.url,
        method: error.config?.method,
        message: error.message,
        response: error.response?.data
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
}

export default request; 