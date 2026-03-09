import { Routes, Route } from 'react-router-dom';
import GameList from './pages/GameList';
import GameDetails from './pages/GameDetails';
import GameStats from './pages/GameStats';

function App() {
  return (
    <Routes>
      <Route path="/" element={<GameList />} />
      <Route path="/games/:id" element={<GameDetails />} />
      <Route path="/games/stats" element={<GameStats />} />
    </Routes>
  );
}

export default App;
