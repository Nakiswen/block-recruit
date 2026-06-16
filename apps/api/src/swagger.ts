import path from 'path';

import swaggerJSDoc from 'swagger-jsdoc';

export function createSwaggerSpec() {
  const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'BlockRecruit API',
      version: '1.0.0',
      description: '区块链招聘平台后端API文档',
      contact: {
        name: 'BlockRecruit团队',
        email: 'support@blockrecruit.example',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      { url: process.env.API_PUBLIC_URL || 'http://localhost:3001', description: 'API服务' },
    ],
    tags: [
      { name: '认证', description: '用户认证相关接口' },
      { name: '简历', description: '简历上传与处理相关接口' },
      { name: '岗位', description: '区块链岗位相关接口' },
      { name: '用户', description: '用户个人信息相关接口' },
      { name: 'NFT', description: 'NFT证明相关接口' },
      { name: '投递记录', description: '岗位投递记录相关接口' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            address: { type: 'string' },
            nickname: { type: 'string' },
            email: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
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
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Resume: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            content: { type: 'string' },
            skills: { type: 'array', items: { type: 'string' } },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  };

  return swaggerJSDoc({
    swaggerDefinition,
    apis: [
      path.resolve(process.cwd(), 'src/routes/*.ts'),
      path.resolve(process.cwd(), 'src/routes/*.js'),
      path.resolve(process.cwd(), 'apps/api/src/routes/*.ts'),
      path.resolve(process.cwd(), 'apps/api/src/routes/*.js'),
    ],
  });
}
