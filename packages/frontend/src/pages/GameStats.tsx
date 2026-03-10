import { useEffect, useState } from "react";
import { fetchGameStats } from "../utils/api";
import { Pie } from 'react-chartjs-2';
import stringToColor from "../utils/stringToColor";

type ChartState = {
  data: number[];
  labels: string[];
};

const GameStats = () => {
  const [chart, setChart] = useState<ChartState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGameStats()
      .then((response) => {
        setChart({
          data: response.map(stat => stat.count),
          labels: response.map(stat => stat.type),
        });
      }).catch((error) => {
        console.error('Error fetching game stats:', error);
        setError('Failed to load game stats.');
      });
  }, []);

  if (error) return <div>{error}</div>;
  if (!chart) return <div>Loading...</div>;

  return (
    <div className="game-stats flex flex-col items-center px-16">
      <h1 className="py-8 text-3xl">Game Stats</h1>
      <div className="flex flex-col items-center w-1/2">
        <Pie data={{
          labels: chart.labels,
          datasets: [{
            label: ' Nr. of played games',
            data: chart.data,
            backgroundColor: chart.labels.map((label) => stringToColor(label, 50)),
          }]
        }} options={{ maintainAspectRatio: true, plugins: { legend: { position: 'right' } } }} />
        <label>Game type distribution</label>
      </div>
    </div>
  );
}

export default GameStats;
