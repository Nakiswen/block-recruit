declare module './custom-mocks' {
  import { PrismaClient } from '@prisma/client';
  const mockPrisma: any;
  export default mockPrisma;
} 