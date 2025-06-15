/// <reference path="../../prisma/web3cv/index.d.ts" />
import { jest } from '@jest/globals';

/**
 * 用户最小聚合输出类型
 */
type UserMinAggregateOutputType = {
  id: string | null;
  address: string | null;
  nickname: string | null;
  email: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

/**
 * user.create 参数类型
 */
type UserCreateArgs = {
  data: {
    id: string;
    address: string;
    nickname: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
};

/**
 * deleteMany 参数类型
 */
type DeleteManyUserArgs = {
  where: { id: string };
};
type DeleteManyResumeArgs = {
  where: { userId: string };
};

/**
 * resume.create/findUnique 参数类型
 */
type ResumeCreateArgs = {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * MockPrisma 类型定义
 */
type MockPrisma = {
  user: {
    create: jest.Mock<(args: UserCreateArgs) => Promise<UserMinAggregateOutputType>>;
    findUnique: jest.Mock<(args: { where: { id: string } }) => Promise<UserMinAggregateOutputType | null>>;
    deleteMany: jest.Mock<(args: DeleteManyUserArgs) => Promise<{ count: number }>>;
  };
  resume: {
    create: jest.Mock<(args: ResumeCreateArgs) => Promise<ResumeCreateArgs>>;
    findUnique: jest.Mock<(args: { id: string }) => Promise<ResumeCreateArgs | null>>;
    deleteMany: jest.Mock<(args: { where: { userId: string } }) => Promise<{ count: number }>>;
  };
  jobPosting: {
    findUnique: jest.Mock<(args: { id: string }) => Promise<any>>; // 可根据实际需要细化
    findMany: jest.Mock<(args: { where: { id: string } }) => Promise<any[]>>;
  };
  $disconnect: jest.Mock<() => Promise<void>>;
};

// 创建 mock 对象
const mockPrisma: MockPrisma = {
  user: {
    create: jest.fn<(args: UserCreateArgs) => Promise<UserMinAggregateOutputType>>().mockResolvedValue({
      id: 'test-user-id',
      address: '0x1234567890abcdef',
      nickname: '简历测试用户',
      email: 'resume@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    findUnique: jest.fn<(args: { where: { id: string } }) => Promise<UserMinAggregateOutputType | null>>()
      .mockResolvedValue({
        id: 'test-user-id',
        address: '0x1234567890abcdef',
        nickname: '简历测试用户',
        email: 'resume@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    deleteMany: jest.fn<(args: DeleteManyUserArgs) => Promise<{ count: number }>>()
      .mockResolvedValue({ count: 1 })
  },
  resume: {
    create: jest.fn<(args: ResumeCreateArgs) => Promise<ResumeCreateArgs>>()
      .mockResolvedValue({
        id: 'resume1',
        userId: 'test-user-id',
        content: 'test resume content',
        createdAt: new Date(),
        updatedAt: new Date()
      }),
    findUnique: jest.fn<(args: { id: string }) => Promise<ResumeCreateArgs | null>>()
      .mockResolvedValue({
        id: 'resume1',
        userId: 'test-user-id',
        content: 'test resume content',
        createdAt: new Date(),
        updatedAt: new Date()
      }),
    deleteMany: jest.fn<(args: DeleteManyResumeArgs) => Promise<{ count: number }>>()
      .mockResolvedValue({ count: 1 })
  },
  jobPosting: {
    findUnique: jest.fn<(args: { id: string }) => Promise<any>>()
      .mockResolvedValue({
        topic_id: 1n,
        position_name: '测试岗位',
        company: '测试公司',
        createdAt: new Date(),
        updatedAt: new Date()
      }),
    // @ts-ignore
    findMany: jest.fn<(args: { where: { id: string } }) => Promise<any[]>>()
      .mockResolvedValue([
        { topic_id: 1n, position_name: '测试岗位1', company: '公司1', createdAt: new Date(), updatedAt: new Date() },
        { topic_id: 2n, position_name: '测试岗位2', company: '公司2', createdAt: new Date(), updatedAt: new Date() }
      ]),
  },
  $disconnect: jest.fn<() => Promise<void>>()
    .mockResolvedValue(undefined)
};

// Mock Prisma 模块
jest.mock('../../prisma/web3cv-prisma', () => ({
  __esModule: true,
  default: mockPrisma
}), { virtual: true });

// Mock Redis 模块
jest.mock('../../utils/redis', () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => Promise.resolve(null)),
    set: jest.fn(() => Promise.resolve('OK')),
    flushall: jest.fn(() => Promise.resolve('OK')),
    quit: jest.fn(() => Promise.resolve('OK')),
  }
}), { virtual: true });

export default mockPrisma; 