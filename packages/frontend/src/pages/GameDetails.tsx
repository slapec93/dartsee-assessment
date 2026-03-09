import { GameSummary } from "@dartsee-assessment/shared";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchGame } from "../utils/api";
import User from "../components/Icons/User";
import stringToColor from "../utils/stringToColor";
import ThrowMap from "../components/ThrowMap";

const GameDetails = () => {
  const params = useParams();
  const [game, setGame] = useState<GameSummary | null>(null);

  useEffect(() => {
    if (!params.id) {
      return;
    }
    fetchGame(params.id).then(setGame);
  }, [params.id]);

  if (!game) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center px-16">
      <h1 className="pt-8 pb-4 font-black text-3xl">Game #{game.id}</h1>
      <h2 className="pt-4 pb-8 font-bold text-xl"><b className="font-black">Type:</b> {game.type}</h2>
      <div className="flex flex-col gap-4 w-full">
        {game.players.map((player) => (
          <div className="flex flex-row items-center border-1 rounded-lg border-gray-100 p-8 shadow-md" key={player.id}>
            <User className="w-32 h-32" style={{ color: stringToColor(player.name) }} />
            <div className="flex flex-col gap-2 ml-8">
              <p><b>Name:</b> {player.name}</p>
              <p><b>Average score per round:</b> {player.averageScorePerRound.toFixed(2)}</p>
              <p><b>Missed throws:</b> {player.missCount}</p>
            </div>
            <ThrowMap customClassName="ml-auto" throws={player.throws} width={200} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default GameDetails;
