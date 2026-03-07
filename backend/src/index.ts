import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 20;

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());


app.get('/games', async (request, response) => {
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
      totalPages: Math.ceil(total / pageSize),
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
