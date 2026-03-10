import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Throw, Prisma } from '@prisma/client';
import { getGameSummary } from '../services/gameSummary';
import { NotFoundError } from '../services/not_found_error';

vi.mock('../db', () => ({
  prisma: {
    game: {
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from '../db';

type Game = Prisma.GameGetPayload<{
  include: {
    gamePlayers: { include: { player: { include: { throws: true } } } };
  }
}>;

type Player = Prisma.PlayerGetPayload<{
  include: {
    throws: true;
  }
}>;

const makeThrow = (score: number, modifier: number, x: number | null = 400, y: number | null = 300): Throw => ({
  id: Math.random(),
  gameId: 1,
  playerId: 'p1',
  score,
  modifier,
  x,
  y,
});

const makePlayer = (id: string, name: string, throws: Throw[]): Player => ({
  id,
  name,
  throws,
});

const makeGame = (players: (Player & { throws: Throw[] })[]): Game => ({
  id: 1,
  type: 'x01',
  gamePlayers: players.map((p, i) => ({
    id: `gp${i}`,
    gameId: 1,
    playerId: p.id,
    player: p,
  })),
});

describe('getGameSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws NotFoundError when game does not exist', async () => {
    vi.mocked(prisma.game.findUnique).mockResolvedValue(null);

    await expect(getGameSummary('999')).rejects.toThrow(NotFoundError);
  });

  it('returns correct game id and type', async () => {
    vi.mocked(prisma.game.findUnique).mockResolvedValue(makeGame([]) as any);

    const result = await getGameSummary('1');

    expect(result.id).toBe(1);
    expect(result.type).toBe('x01');
  });

  it('calculates average score per round correctly', async () => {
    const throws = [
      makeThrow(20, 1), // 20
      makeThrow(15, 2), // 30
      makeThrow(10, 3), // 30 → round 1 total: 80
    ];
    vi.mocked(prisma.game.findUnique).mockResolvedValue(
      makeGame([makePlayer('p1', 'Alice', throws)]) as any
    );

    const result = await getGameSummary('1');

    expect(result.players[0].averageScorePerRound).toBeCloseTo(80);
  });

  it('counts misses (modifier === 0) correctly', async () => {
    const throws = [
      makeThrow(0, 0),  // miss
      makeThrow(20, 1),
      makeThrow(0, 0),  // miss
    ];
    vi.mocked(prisma.game.findUnique).mockResolvedValue(
      makeGame([makePlayer('p1', 'Alice', throws)]) as any
    );

    const result = await getGameSummary('1');

    expect(result.players[0].missCount).toBe(2);
  });

  it('excludes players with no linked player record', async () => {
    const game: Game = {
      id: 1,
      type: 'x01',
      gamePlayers: [
        { id: 'gp0', gameId: 1, playerId: null, player: null },
        { id: 'gp1', gameId: 1, playerId: 'p1', player: makePlayer('p1', 'Alice', []) },
      ],
    };
    vi.mocked(prisma.game.findUnique).mockResolvedValue(game as any);

    const result = await getGameSummary('1');

    expect(result.players).toHaveLength(1);
    expect(result.players[0].name).toBe('Alice');
  });

  it('filters out throws with null x or y coordinates', async () => {
    const throws = [
      makeThrow(20, 1, null, null),
      makeThrow(15, 1, 400, 300),
    ];
    vi.mocked(prisma.game.findUnique).mockResolvedValue(
      makeGame([makePlayer('p1', 'Alice', throws)]) as any
    );

    const result = await getGameSummary('1');

    expect(result.players[0].throws).toHaveLength(1);
    expect(result.players[0].throws[0]).toEqual({ x: 400, y: 300 });
  });

  it('sorts players by average score per round descending', async () => {
    const game = makeGame([
      makePlayer('p1', 'Alice', [makeThrow(5, 1), makeThrow(5, 1), makeThrow(5, 1)]),   // avg 15
      makePlayer('p2', 'Bob', [makeThrow(20, 1), makeThrow(20, 1), makeThrow(20, 1)]), // avg 60
    ]);
    vi.mocked(prisma.game.findUnique).mockResolvedValue(game as any);

    const result = await getGameSummary('1');

    expect(result.players[0].name).toBe('Bob');
    expect(result.players[1].name).toBe('Alice');
  });

  it('returns 0 average when player has no throws', async () => {
    vi.mocked(prisma.game.findUnique).mockResolvedValue(
      makeGame([makePlayer('p1', 'Alice', [])]) as any
    );

    const result = await getGameSummary('1');

    expect(result.players[0].averageScorePerRound).toBe(0);
  });
});
