import { useEffect, useState } from "react";
import { fetchGameStats } from "../utils/api";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import stringToColor from "../utils/stringToColor";

ChartJS.register(ArcElement, Tooltip, Legend);

const GameStats = () => {
  const [chartData, setChartData] = useState<number[]>([]);
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  useEffect(() => {
    fetchGameStats().then((response) => {
      const data = response.map((stat) => stat.count);
      setChartData(data);
      const labels = response.map((stat) => stat.type);
      setChartLabels(labels);
    })
  }, []);

  return (
    <div className="game-stats flex flex-col items-center px-16">
      <h1 className="py-8 text-3xl">Game Stats</h1>
      <div className="flex flex-col items-center w-1/2">
        <Pie data={{
          labels: chartLabels,
          datasets: [{
            label: ' Nr. of played games',
            data: chartData,
            backgroundColor: chartLabels.map((label) => stringToColor(label)),
          }]
        }} options={{ maintainAspectRatio: true, plugins: { legend: { position: 'right' } } }} />
        <label>Game type distribution</label>
      </div>
    </div>
  );
}

export default GameStats;
