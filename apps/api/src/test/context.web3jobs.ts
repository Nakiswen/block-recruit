import { PrismaClient } from '@/prisma/web3jobs'; // 或实际生成的 client 路径
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

export type Context = { prisma: PrismaClient };
export type MockContext = { prisma: DeepMockProxy<PrismaClient> };

export const createMockContext = (): MockContext => ({
  prisma: mockDeep<PrismaClient>(),
});