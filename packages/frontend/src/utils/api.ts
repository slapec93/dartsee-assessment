import { GameSummary } from "@dartsee-assessment/shared";
import Game from "../types/Game";
import GameStat from "../types/GameStat";

const API_BASE = 'http://localhost:3001';

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export const fetchGames = async (page: number | undefined): Promise<PaginatedResponse<Game>> => {
  const response = await fetch(`${API_BASE}/games${page !== undefined ? `?page=${page}` : ''}`);
  return response.json();
};

export const fetchGame = async (id: string): Promise<GameSummary> => {
  const response = await fetch(`${API_BASE}/games/${id}`);
  return response.json();
};

export const fetchGameStats = async (): Promise<GameStat[]> => {
  const response = await fetch(`${API_BASE}/games/stats`);
  return response.json();
};

