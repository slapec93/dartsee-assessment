import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app';

vi.mock('../db', () => ({
  prisma: {
    game: {
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from '../db';

const mockGame = {
  id: 1,
  type: 'x01',
  gamePlayers: [
    {
      id: 'gp1',
      gameId: 1,
      playerId: 'p1',
      player: {
        id: 'p1',
        name: 'Alice',
        throws: [
          { id: 1, gameId: 1, playerId: 'p1', score: 20, modifier: 1, x: 400, y: 300 },
          { id: 2, gameId: 1, playerId: 'p1', score: 15, modifier: 2, x: 420, y: 310 },
          { id: 3, gameId: 1, playerId: 'p1', score: 10, modifier: 1, x: 390, y: 290 },
        ],
      },
    },
  ],
};

describe('GET /games/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns game summary with players and stats', async () => {
    vi.mocked(prisma.game.findUnique).mockResolvedValue(mockGame as any);

    const res = await request(app).get('/games/1');

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.type).toBe('x01');
    expect(res.body.players).toHaveLength(1);
    expect(res.body.players[0].name).toBe('Alice');
    expect(res.body.players[0].missCount).toBe(0);
    expect(res.body.players[0].averageScorePerRound).toBeCloseTo(60);
  });

  it('counts misses correctly', async () => {
    const gameWithMiss = {
      ...mockGame,
      gamePlayers: [{
        ...mockGame.gamePlayers[0],
        player: {
          ...mockGame.gamePlayers[0].player,
          throws: [
            { id: 1, gameId: 1, playerId: 'p1', score: 0, modifier: 0, x: 100, y: 100 },
            { id: 2, gameId: 1, playerId: 'p1', score: 20, modifier: 1, x: 400, y: 300 },
            { id: 3, gameId: 1, playerId: 'p1', score: 10, modifier: 1, x: 390, y: 290 },
          ],
        },
      }],
    };
    vi.mocked(prisma.game.findUnique).mockResolvedValue(gameWithMiss as any);

    const res = await request(app).get('/games/1');

    expect(res.status).toBe(200);
    expect(res.body.players[0].missCount).toBe(1);
  });

  it('returns 404 when game is not found', async () => {
    vi.mocked(prisma.game.findUnique).mockResolvedValue(null);

    const res = await request(app).get('/games/999');

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ error: 'Game not found' });
  });

  it('returns 500 on database error', async () => {
    vi.mocked(prisma.game.findUnique).mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/games/1');

    expect(res.status).toBe(500);
    expect(res.body).toMatchObject({ error: 'Internal Server Error' });
  });

  it('excludes players without a linked player record', async () => {
    const gameWithNullPlayer = {
      ...mockGame,
      gamePlayers: [
        { id: 'gp2', gameId: 1, playerId: null, player: null },
        ...mockGame.gamePlayers,
      ],
    };
    vi.mocked(prisma.game.findUnique).mockResolvedValue(gameWithNullPlayer as any);

    const res = await request(app).get('/games/1');

    expect(res.status).toBe(200);
    expect(res.body.players).toHaveLength(1);
  });
});
