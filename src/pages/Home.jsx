import Hero from '../components/Hero';
import ContentRail from '../components/ContentRail';
import { useState, useEffect } from 'react';
import { tvmazeToShow, MOVIES } from '../api';
import { SEO, websiteSchema, StructuredData } from '../components/SEO';

const TV_IDS = [2993, 44933, 38963, 53647, 43687, 17861, 28276, 46562];

function useTvShows(ids) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    Promise.all(ids.map(id =>
      fetch(`https://api.tvmaze.com/shows/${id}`).then(r => r.ok ? r.json() : null).then(d => d ? tvmazeToShow(d) : null)
    )).then(results => { setItems(results.filter(Boolean)); setLoading(false); })
      .catch(() => { setItems([]); setLoading(false); });
  }, [ids.join(',')]);
  return { items, loading };
}

export default function Home() {
  const trendingTv = useTvShows(TV_IDS);
  const [movieItems, setMovieItems] = useState({ items: [], loading: true });
  const [newMovies, setNewMovies] = useState({ items: [], loading: true });
  const [topMovies, setTopMovies] = useState({ items: [], loading: true });

  useEffect(() => {
    setMovieItems({ items: MOVIES.slice(0, 12).map(m => ({ ...m, media_type: 'movie' })), loading: false });
    setNewMovies({ items: MOVIES.filter(m => parseInt(m.year) >= 2023).map(m => ({ ...m, media_type: 'movie' })), loading: false });
    setTopMovies({ items: [...MOVIES].sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0)).slice(0, 12).map(m => ({ ...m, media_type: 'movie' })), loading: false });
  }, []);

  return (
    <main className="page">
      <SEO title="Kinshow" description="Discover movies and TV shows. Explore ratings, cast, reviews, and find where to stream." url="https://kinshow.vercel.app/" />
      <StructuredData data={websiteSchema()} />
      <Hero />
      <div className="rails">
        <ContentRail title="Popular Movies" items={movieItems.items} loading={movieItems.loading} />
        <ContentRail title="Trending TV Shows" items={trendingTv.items.map(s => ({ ...s, media_type: 'tv' }))} loading={trendingTv.loading} />
        <ContentRail title="New Releases" items={newMovies.items} loading={newMovies.loading} />
        <ContentRail title="Top Rated Films" items={topMovies.items} loading={topMovies.loading} />
      </div>
    </main>
  );
}
