import Game from "../types/Game";

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
