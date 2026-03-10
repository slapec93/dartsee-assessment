import { Request, Response } from 'express';
import { getGameSummary } from '@/services/gameSummary';
import { NotFoundError } from '@/services/not_found_error';
import { InvalidParamError } from '@/services/invalid_param_error';

export const getGame = async (request: Request, response: Response) => {
  try {
    const gameSummary = await getGameSummary(request.params.id);
    response.json(gameSummary);
  } catch (error) {
    if (error instanceof NotFoundError) {
      response.status(404).json({ error: error.message });
    } else if (error instanceof InvalidParamError) {
      response.status(400).json({ error: error.message });
    } else {
      response.status(500).json({ error: 'Internal Server Error' });
    }
  }
};
