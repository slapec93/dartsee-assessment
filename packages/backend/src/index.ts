import express from 'express';
import cors from 'cors';
import { getGames, getGame, getGameStats } from './handlers';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.get('/games', getGames);
app.get('/games/stats', getGameStats);
app.get('/games/:id', getGame);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
