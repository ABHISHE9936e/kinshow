import { useState, useEffect, useRef } from 'react';
import MediaCard from '../components/MediaCard';
import { omdbSearch } from '../api';
import { SkeletonCards } from '../components/Skeletons';
import { SEO } from '../components/SEO';

const SEARCH_TERMS = [
  'Batman', 'Spider-Man', 'Avengers', 'Star Wars', 'Marvel', 'Disney',
  'Nolan', 'Spielberg', 'Scorsese', 'Kubrick', 'Tarantino', 'Cameron',
  'Matrix', 'Alien', 'Terminator', 'Predator', 'Rocky', 'Rambo',
  'Indiana Jones', 'Jurassic Park', 'Transformers', 'Fast Furious',
  'James Bond', 'Mission Impossible', 'John Wick', 'Die Hard',
  'Godfather', 'Scarface', 'Goodfellas', 'Casino', 'Heat',
  'Gladiator', 'Braveheart', 'Titanic', 'Avatar', 'Inception', 'Interstellar',
  'Superman', 'Iron Man', 'Captain America', 'Thor', 'X-Men', 'Deadpool',
  'Frozen', 'Toy Story', 'Shrek', 'Pixar',
  'Harry Potter', 'Lord of the Rings', 'Hobbit', 'Narnia', 'Twilight',
  'Hunger Games', 'Divergent',
  'Aliens', 'Total Recall', 'Back to Future', 'Ghostbusters', 'Top Gun',
  'Casino Royale', 'Skyfall', 'Spectre',
  'Joker', 'Logan', 'Venom',
  'Dune', 'Arrival', 'Blade Runner', 'Ex Machina', 'Her',
  'Parasite', 'Squid Game', 'Money Heist', 'Dark', 'Stranger Things',
  'Breaking Bad', 'Game of Thrones', 'Lost', '24',
  'Prison Break', 'Narcos', 'Ozark', 'Mindhunter',
  'Inglourious Basterds', 'Django Unchained', 'Wolf of Wall Street',
  'Pianist', 'Amadeus', 'Green Mile', 'Shawshank',
  'Departed', 'Léon', 'Se7en', 'Departed'
];

function getSearchBatch(page, batchSize = 8) {
  const start = (page - 1) * batchSize;
  return SEARCH_TERMS.slice(start, start + batchSize);
}

export default function Movies() {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const loadingRef = useRef(false);
  const pageRef = useRef(1);

  useEffect(() => {
    setLoading(true);
    const terms = getSearchBatch(1);
    Promise.all(terms.map(t => omdbSearch(t)))
      .then(results => {
        const movies = results.flat().filter(m => m.poster_path);
        const unique = [...new Map(movies.map(m => [m.id, m])).values()];
        setAllItems(unique);
        setLoading(false);
        setHasMore(SEARCH_TERMS.length > 8);
      })
      .catch(() => { setLoading(false); });
  }, []);

  useEffect(() => {
    if (page <= 1 || loadingRef.current) return;
    loadingRef.current = true;
    setLoadingMore(true);
    const terms = getSearchBatch(page);
    if (terms.length === 0) { setHasMore(false); setLoadingMore(false); loadingRef.current = false; return; }
    Promise.all(terms.map(t => omdbSearch(t)))
      .then(results => {
        const movies = results.flat().filter(m => m.poster_path);
        const unique = [...new Map(movies.map(m => [m.id, m])).values()];
        setAllItems(prev => {
          const existing = new Set(prev.map(m => m.id));
          return [...prev, ...unique.filter(m => !existing.has(m.id))];
        });
        setLoadingMore(false);
        loadingRef.current = false;
        setHasMore(page * 8 < SEARCH_TERMS.length);
      })
      .catch(() => { setLoadingMore(false); loadingRef.current = false; });
  }, [page]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !loading && !loadingRef.current) {
        pageRef.current += 1;
        setPage(pageRef.current);
      }
    }, { rootMargin: '600px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loading]);

  const visible = allItems.slice(0, page * 8 * (SEARCH_TERMS.length / 8));

  return (
    <main className="page">
      <SEO title="Movies" description="Discover films across every genre and era. Browse popular, top rated, and new releases." url="https://kinshow.vercel.app/movies" />
      <div className="page-header">
        <h1 className="page-title">Movies</h1>
        <p className="page-subtitle">Discover films across every genre and era</p>
      </div>
      <div className="grid">
        {loading ? <SkeletonCards count={12} /> : allItems.map((item, i) => <MediaCard key={`${item.id}-${i}`} item={item} mediaType="movie" />)}
      </div>
      <div ref={loaderRef} className="load-more">
        {loadingMore && <SkeletonCards count={8} />}
        {!hasMore && !loading && allItems.length > 0 && <p style={{textAlign:'center', color:'var(--text-muted)', padding:'20px'}}>You've seen all movies!</p>}
      </div>
      {!loading && allItems.length === 0 && <div className="empty-state"><h3>No movies found</h3><p>Check your connection</p></div>}
    </main>
  );
}
