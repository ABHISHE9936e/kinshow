import { useState, useEffect } from 'react';
import MediaCard from '../components/MediaCard';
import { tvmazeSearch } from '../api';
import { SkeletonCards } from '../components/Skeletons';
import { SEO } from '../components/SEO';

const QUERIES = {
  popular: ['Breaking Bad', 'Game of Thrones', 'Stranger Things', 'The Witcher', 'The Mandalorian', 'Wednesday', 'House of the Dragon', 'The Last of Us', 'Severance', 'Squid Game'],
  top_rated: ['Chernobyl', 'Band of Brothers', 'The Wire', 'Planet Earth', 'Cosmos', 'True Detective', 'Fargo', 'The Sopranos', 'Avatar The Last Airbender', 'Sherlock'],
  on_the_air: ['Loki', 'The Boys', 'Foundation', 'Andor', 'Yellowjackets', 'The White Lotus', 'Rings of Power', 'Star Trek', 'Dark', 'Money Heist'],
  airing_today: ['South Park', 'The Simpsons', 'Family Guy', 'Bob Burgers', 'SNL', 'The Daily Show', 'Jimmy Fallon', 'Colbert', 'Last Week Tonight', 'Real Time'],
};

export default function TVShows() {
  const [tab, setTab] = useState('popular');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const queries = [...(QUERIES[tab] || QUERIES.popular)];
    const pick = queries.sort(() => Math.random() - 0.5).slice(0, 10);
    Promise.all(pick.map(q => tvmazeSearch(q).then(shows => shows[0] || null)))
      .then(results => { setItems(results.filter(Boolean).map(s => ({ ...s, media_type: 'tv' }))); setLoading(false); })
      .catch(() => { setItems([]); setLoading(false); });
  }, [tab]);

  return (
    <main className="page">
      <SEO title="TV Shows" description="Series worth your time. Browse popular, top rated, and currently airing TV shows." url="https://kinshow.vercel.app/tv" />
      <div className="page-header">
        <h1 className="page-title">TV Shows</h1>
        <p className="page-subtitle">Series worth your time</p>
      </div>
      <div className="page-tabs">
        {Object.keys(QUERIES).map(k => <button key={k} className={`tab ${tab === k ? 'tab--active' : ''}`} onClick={() => setTab(k)}>{k.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</button>)}
      </div>
      <div className="grid">
        {loading ? <SkeletonCards count={12} /> : items.map((item, i) => <MediaCard key={`${item.id}-${i}`} item={item} mediaType="tv" />)}
      </div>
      {!loading && items.length === 0 && <div className="empty-state"><h3>No shows found</h3><p>Try again later</p></div>}
    </main>
  );
}
