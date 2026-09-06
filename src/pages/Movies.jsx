import { useState, useEffect } from 'react';
import MediaCard from '../components/MediaCard';
import { MOVIES } from '../api';
import { SkeletonCards } from '../components/Skeletons';

const TABS = { popular: 'Popular', top_rated: 'Top Rated', new: 'New Releases (2023+)' };

export default function Movies() {
  const [tab, setTab] = useState('popular');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      let result = [...MOVIES];
      if (tab === 'top_rated') result.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
      else if (tab === 'new') result = result.filter(m => parseInt(m.year) >= 2023);
      else result.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
      setItems(result.map(m => ({ ...m, media_type: 'movie' })));
      setLoading(false);
    }, 300);
  }, [tab]);

  return (
    <main className="page">
      <div className="page-header">
        <h1 className="page-title">Movies</h1>
        <p className="page-subtitle">Discover films across every genre and era</p>
      </div>
      <div className="page-tabs">
        {Object.entries(TABS).map(([k, v]) => <button key={k} className={`tab ${tab === k ? 'tab--active' : ''}`} onClick={() => setTab(k)}>{v}</button>)}
      </div>
      <div className="grid">
        {loading ? <SkeletonCards count={12} /> : items.map((item, i) => <MediaCard key={`${item.id}-${i}`} item={item} mediaType="movie" />)}
      </div>
    </main>
  );
}
