import jobsPrismaClient from './web3jobs-prisma';
import resumePrismaClient from './web3cv-prisma';
 
// 导出两个不同的Prisma客户端实例
export const jobsPrisma = jobsPrismaClient;
export const resumePrisma = resumePrismaClient; 