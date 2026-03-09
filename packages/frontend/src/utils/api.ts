import { GameSummary } from "@dartsee-assessment/shared";
import Game from "../types/Game";
import GameStat from "../types/GameStat";

const API_BASE = import.meta.env.VITE_API_BASE;

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
  if (!response.ok) {
    throw new Error(`Failed to fetch games: ${response.statusText}`);
  }
  return response.json();
};

export const fetchGame = async (id: string): Promise<GameSummary> => {
  const response = await fetch(`${API_BASE}/games/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch game with id ${id}: ${response.statusText}`);
  }
  return response.json();
};

export const fetchGameStats = async (): Promise<GameStat[]> => {
  const response = await fetch(`${API_BASE}/games/stats`);
  if (!response.ok) {
    throw new Error(`Failed to fetch game stats: ${response.statusText}`);
  }
  return response.json();
};

