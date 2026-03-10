import { PrismaClient } from './generated/test-prisma';
import path from 'path';

const dbPath = path.resolve(__dirname, '../prisma/test.db');

export const testPrisma = new PrismaClient({
  datasources: { db: { url: `file:${dbPath}` } },
});
