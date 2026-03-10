import { PrismaClient } from '../src/generated/test-prisma';
import path from 'path';

const dbPath = path.resolve(__dirname, './test.db');

const prisma = new PrismaClient({
  datasources: { db: { url: `file:${dbPath}` } },
});

async function main() {
  await prisma.throw.deleteMany();
  await prisma.gamePlayer.deleteMany();
  await prisma.game.deleteMany();
  await prisma.player.deleteMany();

  await prisma.player.createMany({
    data: [
      { id: 'player-1', name: 'Alice' },
      { id: 'player-2', name: 'Bob' },
    ],
  });

  await prisma.game.createMany({
    data: [
      { id: 1, type: 'x01' },
      { id: 2, type: 'cricket' },
      { id: 3, type: 'x01' },
    ],
  });

  await prisma.gamePlayer.createMany({
    data: [
      { id: 'gp-1', gameId: 1, playerId: 'player-1' },
      { id: 'gp-2', gameId: 1, playerId: 'player-2' },
    ],
  });

  await prisma.throw.createMany({
    data: [
      // Game 1 - Alice: 3 throws, round avg = 20+20+20 = 60
      { id: 1, gameId: 1, playerId: 'player-1', score: 20, modifier: 1, x: 400, y: 300 },
      { id: 2, gameId: 1, playerId: 'player-1', score: 20, modifier: 1, x: 410, y: 310 },
      { id: 3, gameId: 1, playerId: 'player-1', score: 20, modifier: 1, x: 390, y: 290 },
      // Game 1 - Bob: miss + 2 throws
      { id: 4, gameId: 1, playerId: 'player-2', score: 0,  modifier: 0, x: 100, y: 100 },
      { id: 5, gameId: 1, playerId: 'player-2', score: 15, modifier: 1, x: 420, y: 320 },
      { id: 6, gameId: 1, playerId: 'player-2', score: 10, modifier: 2, x: 430, y: 330 },
    ],
  });
}

main()
  .then(() => console.log('Seeded test database'))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
