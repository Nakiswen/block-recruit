// Jest 测试环境设置
import { jest } from '@jest/globals';

// 全局 mock 设置
jest.mock('./src/prisma/web3cv', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn().mockResolvedValue({
        id: 'user1',
        address: '0x123456789',
        nickname: '测试用户',
        email: 'test@example.com',
        applications: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    },
    resume: {
      create: jest.fn().mockResolvedValue({ 
        id: 'resume1', 
        content: 'test content',
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      findUnique: jest.fn().mockResolvedValue({ 
        id: 'resume1', 
        content: 'test content',
        createdAt: new Date(),
        updatedAt: new Date()
      }),
    },
    job: {
      findUnique: jest.fn().mockResolvedValue({
        id: 'job1',
        title: '测试岗位',
        description: '测试岗位描述',
        jobType: '全职',
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      findMany: jest.fn().mockResolvedValue([
        { id: 'job1', title: '测试岗位1', description: '描述1', jobType: '全职', createdAt: new Date() },
        { id: 'job2', title: '测试岗位2', description: '描述2', jobType: '兼职', createdAt: new Date() }
      ]),
    }
  }
}), { virtual: true });

// Mock Redis
jest.mock('./src/utils/redis', () => {
  return {
    __esModule: true,
    default: {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue('OK'),
      flushall: jest.fn().mockResolvedValue('OK'),
      quit: jest.fn().mockResolvedValue('OK')
    }
  };
}, { virtual: true });

// 如果你需要模拟一些全局对象，可以在这里设置
// 例如：
// global.console = {
//   ...console,
//   // 在测试中禁用某些日志
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };

// 设置测试超时时间
jest.setTimeout(30000);

export {};