import ThrowSummary from "./ThrowSummary";

type PlayerSummary = {
  id: string;
  name: string | null;
  averageScorePerRound: number;
  missCount: number;
  throws: ThrowSummary[];
};

export default PlayerSummary;
