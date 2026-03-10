import { prisma } from "@/db";
import { GameStat } from "@dartsee-assessment/shared";
import { Request, Response } from "express";

export const getGameStats = async (_request: Request, response: Response) => {
  try {
    const results = await prisma.game.groupBy({
      by: ['type'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });
    response.json(results.map((result): GameStat => ({
      type: result.type || 'unknown',
      count: result._count.id,
    })));
  } catch (error) {
    response.status(500).json({ error: 'Internal Server Error' });
  }
}
