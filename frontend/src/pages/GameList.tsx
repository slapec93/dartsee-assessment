import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchGames, PaginatedResponse } from '../utils/api';
import Game from '../types/Game';
import Paginator from '../components/Paginator';

const GameList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<PaginatedResponse<Game> | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchGames(page).then(setData);
  }, [page]);

  if (!data) return <div>Loading...</div>;

  return (
    <div className='px-16'>
      <h1 className='flex flex-col items-center py-8 font-black text-2xl'>Recent games</h1>
      <div className='grid grid-cols-4 gap-4'>
        {data.data.map((game) => (
          <div className='flex flex-col items-center border-1 rounded-lg border-gray-100 py-8 shadow-md hover:shadow-lg' key={game.id} onClick={() => navigate(`/games/${game.id}`)} style={{ cursor: 'pointer' }}>
            <p className='font-bold'>Game #{game.id}</p>
            <p>{game.type ?? 'Unknown'}</p>
          </div>
        ))}
      </div>
      <Paginator page={data.pagination.page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
    </div>
  );
};

export default GameList;
