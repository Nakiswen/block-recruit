/**
 * API 生成配置文件
 * 用于配置openapi-typescript-codegen的选项
 */
const path = require('path');

// 获取命令行参数
const args = process.argv.slice(2);
const inputFile = args.find(arg => arg.startsWith('--input='))?.split('=')[1] || './lib/swagger.json';
const outputDir = args.find(arg => arg.startsWith('--output='))?.split('=')[1] || './lib/api-client';

// 配置选项
module.exports = {
  input: path.resolve(inputFile),
  output: path.resolve(outputDir),
  client: 'axios', // 使用axios作为HTTP客户端
  name: 'BlockRecruitAPI', // API客户端类名
  useOptions: true, // 使用options对象作为参数
  useUnionTypes: true, // 使用联合类型
  exportSchemas: true, // 导出模型schemas
  exportServices: true, // 导出服务
  indent: 2, // 缩进空格数
  postfixServices: 'Service', // 服务类后缀
  postfixModels: '', // 模型类后缀
  request: './api-request.ts', // 自定义请求实现
  httpClient: 'axios', // 指定HTTP客户端
}; 