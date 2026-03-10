import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

vi.mock('@/db', async () => {
  const { testPrisma } = await import('../../testDb');
  return { prisma: testPrisma };
});

import app from '../../app';

describe('GET /games', () => {
  it('returns paginated list of games', async () => {
    const res = await request(app).get('/games');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(3);
    expect(res.body.pagination).toMatchObject({
      page: 1,
      total: 3,
      totalPages: 1,
    });
  });

  it('paginates correctly', async () => {
    const res = await request(app).get('/games?page=1&pageSize=2');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.pagination.totalPages).toBe(2);
  });
});

describe('GET /games/stats', () => {
  it('returns game type counts ordered by count desc', async () => {
    const res = await request(app).get('/games/stats');

    expect(res.status).toBe(200);
    expect(res.body[0]).toMatchObject({ type: 'x01', count: 2 });
    expect(res.body[1]).toMatchObject({ type: 'cricket', count: 1 });
  });
});

describe('GET /games/:id', () => {
  it('returns game summary with players and stats', async () => {
    const res = await request(app).get('/games/1');

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.type).toBe('x01');
    expect(res.body.players).toHaveLength(2);
  });

  it('calculates average score per round correctly for Alice', async () => {
    const res = await request(app).get('/games/1');
    const alice = res.body.players.find((p: { name: string }) => p.name === 'Alice');

    expect(alice.averageScorePerRound).toBeCloseTo(60);
    expect(alice.missCount).toBe(0);
  });

  it('counts misses correctly for Bob', async () => {
    const res = await request(app).get('/games/1');
    const bob = res.body.players.find((p: { name: string }) => p.name === 'Bob');

    expect(bob.missCount).toBe(1);
  });

  it('returns 404 for non-existent game', async () => {
    const res = await request(app).get('/games/999');

    expect(res.status).toBe(404);
  });
});
