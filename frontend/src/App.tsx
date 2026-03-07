import { Routes, Route } from 'react-router-dom';
import GameList from './pages/GameList';

function App() {
  return (
    <Routes>
      <Route path="/" element={<GameList />} />
      <Route path="/games/:id" element={<div>Game detail — coming soon</div>} />
      <Route path="/stats" element={<div>Statistics — coming soon</div>} />
    </Routes>
  );
}

export default App;
