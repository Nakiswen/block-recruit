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
    ? '/api' 
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器，用于添加认证令牌
instance.interceptors.request.use(
  (config) => {
    // 在浏览器环境中获取token
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器，用于统一处理错误
instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // 处理错误响应
    const status = error.response?.status;
    
    // 处理 401 未授权错误，可以在这里执行登出操作
    if (status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      // 可以添加重定向到登录页面的逻辑
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