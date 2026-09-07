import Hero from '../components/Hero';
import ContentRail from '../components/ContentRail';
import { useState, useEffect } from 'react';
import { tvmazeMultipleShows, MOVIES, getMoviePoster } from '../api';
import { SEO, websiteSchema, StructuredData } from '../components/SEO';

const TV_IDS = [2993, 44933, 38963, 53647, 43687, 17861, 28276, 46562];

function useTvShows(ids) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    tvmazeMultipleShows(ids)
      .then(results => { setItems(results); setLoading(false); })
      .catch(() => { setItems([]); setLoading(false); });
  }, [ids.join(',')]);
  return { items, loading };
}

function useMoviesWithPosters(movies) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const movieList = movies.map(m => ({ ...m, media_type: 'movie' }));
    Promise.all(movieList.map(async (m) => {
      const poster = await getMoviePoster(m.id);
      return { ...m, poster_path: poster };
    })).then(results => { setItems(results); setLoading(false); })
      .catch(() => { setItems(movieList); setLoading(false); });
  }, [movies.length]);
  return { items, loading };
}

export default function Home() {
  const trendingTv = useTvShows(TV_IDS);
  const popularMovies = useMoviesWithPosters(MOVIES.slice(0, 12));
  const newMovies = useMoviesWithPosters(MOVIES.filter(m => parseInt(m.year) >= 2023));
  const topMovies = useMoviesWithPosters([...MOVIES].sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0)).slice(0, 12));

  return (
    <main className="page">
      <SEO title="Kinshow" description="Discover movies and TV shows. Explore ratings, cast, reviews, and find where to stream." url="https://kinshow.vercel.app/" />
      <StructuredData data={websiteSchema()} />
      <Hero />
      <div className="rails">
        <ContentRail title="Popular Movies" items={popularMovies.items} loading={popularMovies.loading} />
        <ContentRail title="Trending TV Shows" items={trendingTv.items.map(s => ({ ...s, media_type: 'tv' }))} loading={trendingTv.loading} />
        <ContentRail title="New Releases" items={newMovies.items} loading={newMovies.loading} />
        <ContentRail title="Top Rated Films" items={topMovies.items} loading={topMovies.loading} />
      </div>
    </main>
  );
}
