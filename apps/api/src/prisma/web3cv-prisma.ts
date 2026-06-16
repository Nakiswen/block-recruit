import { PrismaClient } from '../../generated/prisma/web3cv/index.js';

const globalForPrisma = globalThis as unknown as {
  web3cvPrisma?: PrismaClient;
};

const prisma =
  globalForPrisma.web3cvPrisma ??
  new PrismaClient({
    log: process.env.PRISMA_LOG_QUERIES === 'true' ? ['query', 'error', 'warn'] : ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.web3cvPrisma = prisma;
}

export default prisma;
