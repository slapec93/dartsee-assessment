import { prisma } from "@/db";
import { GameSummary, PlayerSummary } from "@dartsee-assessment/shared";
import { Prisma } from "@prisma/client";
import { NotFoundError } from "./not_found_error";

type GameWithPlayers = Prisma.GameGetPayload<{
  include: {
    gamePlayers: { include: { player: { include: { throws: true } } } };
  }
}>

const THROWS_PER_ROUND = 3;

export const getGameSummary = async (id: string): Promise<GameSummary> => {
  const gameId = parseInt(id);
  return prisma.game.findUnique({
    where: { id: gameId },
    include: {
      gamePlayers: {
        include: {
          player: {
            include: {
              throws: {
                where: { gameId },
              },
            },
          },
        },
      },
    },
  }).then(game => {
    if (!game) {
      throw new NotFoundError('Game not found');
    }
    return {
      id: game.id,
      type: game.type,
      players: extractPlayers(game),
    };
  });
}

const extractPlayers = (game: GameWithPlayers): PlayerSummary[] => {
  return game.gamePlayers
    .filter((gp): gp is typeof gp & { player: NonNullable<typeof gp.player> } => gp.player !== null)
    .map(gp => {
      const player = gp.player;

      let roundCount = 0;
      let totalScore = 0;
      let missCount = 0;
      for (let i = 0; i < player.throws.length; i++) {
        if (i % THROWS_PER_ROUND == 0) roundCount++;
        if (player.throws[i].modifier === 0) {
          missCount++;
          continue;
        }
        totalScore += (player.throws[i].score || 0) * (player.throws[i].modifier || 1);
      }
      return {
        id: player.id,
        name: player.name,
        averageScorePerRound: (totalScore / roundCount) || 0,
        missCount: missCount,
        throws: player.throws.map(t => ({ x: t.x || -999, y: t.y || -999 })),
      };
    }).sort((a, b) => b.averageScorePerRound - a.averageScorePerRound);
}
