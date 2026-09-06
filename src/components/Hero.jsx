import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tvmazeToShow, MOVIES, title as t, year as y, rating as r } from '../api';

const TV_IDS = [2993, 44933, 38963, 53647];

export default function Hero() {
  const [items, setItems] = useState([]);
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const movieSlice = MOVIES.filter(m => m.vote_average >= 8.0).slice(0, 4);
    Promise.all(TV_IDS.map(id =>
      fetch(`https://api.tvmaze.com/shows/${id}`).then(r => r.ok ? r.json() : null).then(d => d ? tvmazeToShow(d) : null)
    )).then(tvShows => {
      const combined = [...movieSlice.map(m => ({ ...m, media_type: 'movie' })), ...tvShows.filter(Boolean).map(s => ({ ...s, media_type: 'tv' }))];
      setItems(combined.sort(() => Math.random() - 0.5).slice(0, 7));
    }).catch(() => setItems(movieSlice.map(m => ({ ...m, media_type: 'movie' }))));
  }, []);

  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => { setFading(true); setTimeout(() => { setIdx(p => (p + 1) % items.length); setFading(false); }, 400); }, 7000);
    return () => clearInterval(t);
  }, [items.length]);

  const item = items[idx];
  if (!item) return <div className="hero-skeleton"><div className="skeleton-pulse" /></div>;

  const title = t(item);
  const year = y(item);
  const rating = r(item);
  const overview = item.overview || '';
  const genres = item.genres?.map(g => g.name).join(' · ') || '';
  const type = item.media_type || 'movie';

  return (
    <section className={`hero ${fading ? 'hero--fading' : ''}`}>
      <div className="hero-bg" style={{ background: 'linear-gradient(135deg, #12141c 0%, #1a1a2e 50%, #0f3460 100%)' }} />
      <div className="hero-gradient" />
      <div className="hero-content">
        <div className="hero-info">
          <div className="hero-badges">
            <span className="hero-badge hero-badge--accent">Trending</span>
            <span className="hero-badge">{type === 'tv' ? 'Series' : 'Film'}</span>
            {year !== '—' && <span className="hero-badge">{year}</span>}
            {item.rated && <span className="hero-badge">{item.rated}</span>}
          </div>
          <h1 className="hero-title">{title}</h1>
          {genres && <p className="hero-genres">{genres}</p>}
          {overview && <p className="hero-desc">{overview.slice(0, 220)}{overview.length > 220 ? '...' : ''}</p>}
          <div className="hero-rating"><span className="hero-rating-star">★</span> {rating}<span className="hero-rating-out"> / 10</span></div>
          <div className="hero-actions">
            <button className="btn btn--primary" onClick={() => navigate(`/detail/${type}/${item.id}`)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              Watch Now
            </button>
            <button className="btn btn--ghost" onClick={() => navigate(`/detail/${type}/${item.id}`)}>
              More Info
            </button>
          </div>
        </div>
        {items.length > 1 && (
          <div className="hero-dots">
            {items.map((_, i) => (
              <button key={i} className={`hero-dot ${i === idx ? 'hero-dot--active' : ''}`} onClick={() => { setFading(true); setTimeout(() => { setIdx(i); setFading(false); }, 300); }} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
