/** @type {import('next').NextConfig} */
const webpack = require('webpack');
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['ui', 'web3-utils'],
  images: {
    domains: ['images.unsplash.com', 'app.uniswap.org'],
  },
  // 确保服务器端可以访问环境变量
  serverRuntimeConfig: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    UPSTASH_VECTOR_REST_URL: process.env.UPSTASH_VECTOR_REST_URL,
    UPSTASH_VECTOR_REST_TOKEN: process.env.UPSTASH_VECTOR_REST_TOKEN,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    // 添加API URL配置，用于客户端直接访问
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
  // 添加API代理配置，解决本地开发环境的跨域问题
  async rewrites() {
    console.log('设置API代理: /api/* => http://localhost:3001/*');
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/:path*', // 代理到后端API服务
      },
    ];
  },
  // 添加webpack配置以处理Node.js模块
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 客户端包不应该包含Node特定模块
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        child_process: false,
        net: false,
        tls: false,
        stream: false,
        path: false,
        // 确保这些服务器端模块不包含在客户端包中
        axios: false,
        openai: false,
      };
    }

    // 添加插件处理node:buffer等内置模块
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^node:/, resource => {
        resource.request = resource.request.replace(/^node:/, '');
      })
    );

    config.resolve.alias.canvas = false;

    // 设置 @ 别名指向项目根目录
    config.resolve.alias['@'] = path.resolve(__dirname, '../../');

    return config;
  },
};

module.exports = nextConfig;
