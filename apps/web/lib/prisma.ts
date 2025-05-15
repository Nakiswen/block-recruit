import { PrismaClient } from '@prisma/client'

// PrismaClient 是一个在应用中需要重用的单例
// 防止在开发环境下创建多个连接
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 