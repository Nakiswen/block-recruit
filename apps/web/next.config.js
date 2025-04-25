/** @type {import('next').NextConfig} */
const webpack = require('webpack');

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["ui", "resume-parser", "web3-utils", "web3-rag"],
  images: {
    domains: ['images.unsplash.com', 'app.uniswap.org'],
  },
  // 确保服务器端可以访问环境变量
  serverRuntimeConfig: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY
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
        'openai': false
      };
    }
    
    // 添加插件处理node:buffer等内置模块
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, "");
      })
    );

    config.resolve.alias.canvas = false;

    return config;
  },
}

module.exports = nextConfig 