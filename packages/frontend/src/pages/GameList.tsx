import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchGames, PaginatedResponse } from '../utils/api';
import Game from '../types/Game';
import Paginator from '../components/Paginator';
import TypeTag from '../components/TypeTag';

const GameList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') ?? '1');
  const [data, setData] = useState<PaginatedResponse<Game> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchGames(page)
      .then(response => {
        if (page > response.pagination.totalPages) {
          setSearchParams({ page: String(response.pagination.totalPages) });
        } else {
          setData(response);
        }
      }).catch(error => {
        console.error('Error fetching games:', error);
        setError('Failed to load games.');
      }).finally(() => setLoading(false));
  }, [page, setSearchParams]);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: String(newPage) });
  };

  if (error) return <div>{error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className='px-16'>
      <h1 className='flex flex-col items-center py-8 font-black text-2xl'>Recent games</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {data.data.map((game) => {
          const gameType = game.type ?? 'Unknown';

          return (
            <div className='flex flex-col items-center border-1 rounded-lg border-gray-100 py-8 shadow-md hover:shadow-lg' key={game.id} onClick={() => navigate(`/games/${game.id}`)} style={{ cursor: 'pointer' }}>
              <p className='font-bold'>Game #{game.id}</p>
              <TypeTag type={gameType} />
            </div>
          )
        })}
      </div>
      <Paginator page={data.pagination.page} totalPages={data.pagination.totalPages} onPageChange={handlePageChange} disabled={loading} />
    </div>
  );
};

export default GameList;
