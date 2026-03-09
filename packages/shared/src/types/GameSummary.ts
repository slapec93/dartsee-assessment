import PlayerSummary from "./PlayerSummary";

type GameSummary = {
  id: number;
  type: string | null;
  players: PlayerSummary[];
};

export default GameSummary;
