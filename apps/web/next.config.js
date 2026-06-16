const path = require('path');
const webpack = require('webpack');

// 配置 undici (fetch API) 使用代理
// NextAuth v5 使用 fetch，需要特殊配置
if (process.env.GLOBAL_AGENT_HTTP_PROXY) {
  // 设置 undici 的全局代理
  const { setGlobalDispatcher, ProxyAgent } = require('undici');
  const proxyAgent = new ProxyAgent(process.env.GLOBAL_AGENT_HTTP_PROXY);
  setGlobalDispatcher(proxyAgent);
}

const apiProxyTarget =
  process.env.API_PROXY_TARGET ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : undefined);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['ui', 'web3-utils'],
  images: {
    domains: ['images.unsplash.com', 'app.uniswap.org'],
  },
  // 添加API代理配置，解决本地开发环境的跨域问题
  async rewrites() {
    if (!apiProxyTarget) {
      return [];
    }

    console.log(`设置API代理: /api/business/* => ${apiProxyTarget}/*`);
    return [
      {
        source: '/api/business/:path*',
        destination: `${apiProxyTarget}/:path*`, // 代理到后端API服务 (排除 NextAuth 路由)
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
