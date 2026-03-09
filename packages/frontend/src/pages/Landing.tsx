import { useNavigate } from "react-router-dom";
import ArrowRight from "../components/Icons/ArrowRight";

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center px-16">
      <h1 className="py-8 text-3xl">Welcome to my solution for Dartsee tech assessment!</h1>
      <div className="landing flex flex-row justify-center items-center gap-4 px-16">
        <button className="border-1 border-gray-200 rounded-lg px-4 py-2 shadow-md hover:shadow-lg hover:cursor-pointer flex flex-row items-center" onClick={() => navigate('/games')}>
          <p>Recent games</p>
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
        <button className="border-1 border-gray-200 rounded-lg px-4 py-2 shadow-md hover:shadow-lg hover:cursor-pointer flex flex-row items-center" onClick={() => navigate('/games/stats')}>
          <p>Game stats</p>
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}

export default Landing;
