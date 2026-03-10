import { prisma } from "@/db";
import { GameSummary, PlayerSummary } from "@dartsee-assessment/shared";
import { Prisma } from "@prisma/client";
import { NotFoundError } from "./not_found_error";
import { InvalidParamError } from "./invalid_param_error";

type GameWithPlayers = Prisma.GameGetPayload<{
  include: {
    gamePlayers: { include: { player: { include: { throws: true } } } };
  }
}>

type GamePlayer = GameWithPlayers['gamePlayers'][number];
type GamePlayerWithPlayer = GamePlayer & { player: NonNullable<GamePlayer['player']> };

const hasPlayer = (gp: GamePlayer): gp is GamePlayerWithPlayer => gp.player !== null;

const THROWS_PER_ROUND = 3;

export const getGameSummary = async (id: string): Promise<GameSummary> => {
  const gameId = parseInt(id, 10);
  if (isNaN(gameId)) {
    throw new InvalidParamError(`Invalid game ID: ${id}`);
  }
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: {
      gamePlayers: {
        include: {
          player: { include: { throws: { where: { gameId } } } },
        },
      },
    },
  });

  if (!game) {
    throw new NotFoundError('Game not found');
  }

  return {
    id: game.id,
    type: game.type,
    players: extractPlayers(game),
  };
}

const extractPlayers = (game: GameWithPlayers): PlayerSummary[] => {
  return game.gamePlayers
    .filter(hasPlayer)
    .map(gp => {
      const player = gp.player;

      let roundCount = Math.ceil(player.throws.length / THROWS_PER_ROUND);
      let totalScore = 0;
      let missCount = 0;
      for (let i = 0; i < player.throws.length; i++) {
        if (player.throws[i].modifier === 0) {
          missCount++;
          continue;
        }
        totalScore += (player.throws[i].score || 0) * (player.throws[i].modifier || 1);
      }
      return {
        id: player.id,
        name: player.name,
        averageScorePerRound: roundCount > 0 ? totalScore / roundCount : 0,
        missCount: missCount,
        throws: player.throws.filter(t => t.x !== null && t.y !== null).map(t => ({ x: t.x, y: t.y })),
      };
    }).sort((a, b) => b.averageScorePerRound - a.averageScorePerRound);
}
