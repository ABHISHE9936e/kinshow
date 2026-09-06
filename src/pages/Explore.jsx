import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tvmazeSearch, MOVIES } from '../api';
import MediaCard from '../components/MediaCard';
import { SkeletonCards } from '../components/Skeletons';

const GENRES = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Animation', 'Adventure', 'Crime', 'Fantasy', 'Mystery', 'War', 'Documentary'];

export default function Explore() {
  const [movieItems, setMovieItems] = useState({ items: [], loading: true });
  const [tvItems, setTvItems] = useState({ items: [], loading: true });

  useEffect(() => {
    setMovieItems({ items: MOVIES.slice(0, 12).map(m => ({ ...m, media_type: 'movie' })), loading: false });
    const tvQueries = ['Breaking Bad', 'Game of Thrones', 'Stranger Things', 'The Witcher', 'Chernobyl', 'Severance', 'Squid Game', 'The Mandalorian'];
    Promise.all(tvQueries.map(q => tvmazeSearch(q).then(shows => shows[0] || null)))
      .then(results => setTvItems({ items: results.filter(Boolean).map(s => ({ ...s, media_type: 'tv' })), loading: false }));
  }, []);

  return (
    <main className="page">
      <div className="page-header">
        <h1 className="page-title">Explore</h1>
        <p className="page-subtitle">Browse by genre and discover something new</p>
      </div>
      <section className="explore-section">
        <h2 className="explore-heading">Genres</h2>
        <div className="explore-grid">
          {GENRES.map(g => <Link key={g} to="/movies" className="genre-chip">{g}</Link>)}
        </div>
      </section>
      <section className="detail-section">
        <h2 className="detail-section-title">Popular Films</h2>
        <div className="grid">
          {movieItems.loading ? <SkeletonCards count={8} /> : movieItems.items.map((item, i) => <MediaCard key={i} item={item} mediaType="movie" />)}
        </div>
      </section>
      <section className="detail-section">
        <h2 className="detail-section-title">Popular Series</h2>
        <div className="grid">
          {tvItems.loading ? <SkeletonCards count={8} /> : tvItems.items.map((item, i) => <MediaCard key={i} item={item} mediaType="tv" />)}
        </div>
      </section>
    </main>
  );
}
