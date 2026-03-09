import { Request, Response } from "express";
import { prisma } from "@/db";

const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 20;

export const getGames = async (request: Request, response: Response) => {
  try {
    const page = parseInt(request.query.page as string) || 1;
    const pageSize = Math.min(MAX_PAGE_SIZE, parseInt(request.query.pageSize as string) || DEFAULT_PAGE_SIZE);

    const [games, total] = await Promise.all([
      prisma.game.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { id: 'asc' },
      }),
      prisma.game.count(),
    ]);

    response.json({
      data: games,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    });
  } catch (error) {
    response.status(500).json({ error: 'Internal Server Error' });
  }
}

