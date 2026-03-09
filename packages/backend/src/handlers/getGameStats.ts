import { prisma } from "@/db";
import { Request, Response } from "express";

export const getGameStats = async (_request: Request, response: Response) => {
  try {
    const results = await prisma.game.groupBy({
      by: ['type'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });
    response.json(results.map(result => ({
      type: result.type || 'Unknown',
      count: result._count.id,
    })));
  } catch (error) {
    console.error('Error fetching game stats:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
}
