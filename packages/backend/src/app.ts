import express from 'express';
import cors from 'cors';
import { getGames, getGame, getGameStats } from './handlers';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/games', getGames);
app.get('/games/stats', getGameStats);
app.get('/games/:id', getGame);

export default app;
