import { vi } from 'vitest';
import { testPrisma } from '../../testDb';

vi.mock('@/db', () => ({ prisma: testPrisma }));
