import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn'] // รัน node แบบ development
      : ['error'], // รัน node แบบ production
});
export default prisma;
