import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app';

vi.mock('../db', () => ({
  prisma: {
    game: {
      groupBy: vi.fn(),
    },
  },
}));

import { prisma } from '../db';

describe('GET /games/stats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns game type counts ordered by count desc', async () => {
    vi.mocked(prisma.game.groupBy).mockResolvedValue([
      { type: 'x01', _count: { id: 10 } },
      { type: 'golf', _count: { id: 5 } },
    ] as any);

    const res = await request(app).get('/games/stats');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { type: 'x01', count: 10 },
      { type: 'golf', count: 5 },
    ]);
  });

  it('replaces null type with "unknown"', async () => {
    vi.mocked(prisma.game.groupBy).mockResolvedValue([
      { type: null, _count: { id: 3 } },
    ] as any);

    const res = await request(app).get('/games/stats');

    expect(res.status).toBe(200);
    expect(res.body[0].type).toBe('unknown');
  });

  it('returns 500 on database error', async () => {
    vi.mocked(prisma.game.groupBy).mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/games/stats');

    expect(res.status).toBe(500);
    expect(res.body).toMatchObject({ error: 'Internal Server Error' });
  });
});
