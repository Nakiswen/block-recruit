/**
 * 生成Swagger JSON文件的独立脚本
 */
import swaggerJSDoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Swagger 配置
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'BlockRecruit API',
    version: '1.0.0',
    description: '区块链招聘平台后端API文档',
    contact: {
      name: 'BlockRecruit团队',
      email: 'support@blockrecruit.example'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    { url: 'http://localhost:3001', description: '本地开发环境' },
    { url: 'https://api.blockrecruit.example', description: '生产环境' }
  ],
  tags: [
    { name: '认证', description: '用户认证相关接口' },
    { name: '简历', description: '简历上传与处理相关接口' },
    { name: '岗位', description: '区块链岗位相关接口' },
    { name: '用户', description: '用户个人信息相关接口' },
    { name: 'NFT', description: 'NFT证明相关接口' },
    { name: '投递记录', description: '岗位投递记录相关接口' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          address: { type: 'string' },
          nickname: { type: 'string' },
          email: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Job: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          company: { type: 'string' },
          description: { type: 'string' },
          requirements: { type: 'string' },
          location: { type: 'string' },
          salary: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Resume: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          content: { type: 'string' },
          skills: { type: 'array', items: { type: 'string' } },
          createdAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  },
  security: [{
    bearerAuth: []
  }]
};

const swaggerOptions = {
  swaggerDefinition,
  apis: [
    path.resolve(rootDir, 'src/routes/*.ts'),
    path.resolve(rootDir, 'src/routes/*.js')
  ],
};

try {
  console.log('✅ 正在生成Swagger文档...');
  const swaggerSpec = swaggerJSDoc(swaggerOptions);
  
  // 输出swagger.json文件
  const outputPath = path.resolve(rootDir, 'swagger.json');
  fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2), 'utf8');
  console.log(`✅ Swagger JSON 文件已成功生成: ${outputPath}`);
  
  // 方便查看的本地路径
  const urlPath = `http://localhost:3001/docs`;
  console.log(`🔍 本地运行服务后可访问: ${urlPath}`);
  
  process.exit(0);
} catch (error) {
  console.error('❌ 生成Swagger文档时发生错误:', error);
  process.exit(1);
} 