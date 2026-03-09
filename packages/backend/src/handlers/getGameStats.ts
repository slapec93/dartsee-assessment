import { prisma } from "@/db";
import { Request, Response } from "express";

export const getGameStats = async (_request: Request, response: Response) => {
  prisma.game.groupBy({
    by: ['type'],
    _count: { id: true },
    orderBy: {
      _count: { id: 'desc' },
    }
  }).then(results => {
    const resultData = results.map(result => ({
      type: result.type || 'Unknown',
      count: result._count.id,
    }));
    response.json(resultData);
  }).catch(error => {
    console.error('Error fetching game stats:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  });
}
