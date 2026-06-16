import { PrismaClient } from '../../generated/prisma/web3jobs/index.js';

const globalForPrisma = globalThis as unknown as {
  web3jobsPrisma?: PrismaClient;
};

const prisma =
  globalForPrisma.web3jobsPrisma ??
  new PrismaClient({
    log: process.env.PRISMA_LOG_QUERIES === 'true' ? ['query', 'error', 'warn'] : ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.web3jobsPrisma = prisma;
}

export default prisma;
