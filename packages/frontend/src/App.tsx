import { Routes, Route } from 'react-router-dom';
import GameList from './pages/GameList';
import GameDetails from './pages/GameDetails';
import GameStats from './pages/GameStats';
import Landing from './pages/Landing';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/games" element={<GameList />} />
      <Route path="/games/:id" element={<GameDetails />} />
      <Route path="/games/stats" element={<GameStats />} />
    </Routes>
  );
}

export default App;
