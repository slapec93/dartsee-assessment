import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app';

vi.mock('../db', () => ({
  prisma: {
    game: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

import { prisma } from '../db';

describe('GET /games', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns paginated games with default page and pageSize', async () => {
    vi.mocked(prisma.game.findMany).mockResolvedValue([
      { id: 1, type: 'x01' },
      { id: 2, type: 'golf' },
    ]);
    vi.mocked(prisma.game.count).mockResolvedValue(2);

    const res = await request(app).get('/games');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.pagination).toMatchObject({
      page: 1,
      pageSize: 20,
      total: 2,
      totalPages: 1,
    });
  });

  it('respects page query param', async () => {
    vi.mocked(prisma.game.findMany).mockResolvedValue([]);
    vi.mocked(prisma.game.count).mockResolvedValue(100);

    const res = await request(app).get('/games?page=3');

    expect(res.status).toBe(200);
    expect(res.body.pagination.page).toBe(3);
  });

  it('returns 500 on database error', async () => {
    vi.mocked(prisma.game.findMany).mockRejectedValue(new Error('DB error'));
    vi.mocked(prisma.game.count).mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/games');

    expect(res.status).toBe(500);
    expect(res.body).toMatchObject({ error: 'Internal Server Error' });
  });
});
