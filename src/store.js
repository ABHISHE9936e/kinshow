import { useState, useCallback, useEffect } from 'react';

function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try { const d = localStorage.getItem('lg_' + key); return d ? JSON.parse(d) : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem('lg_' + key, JSON.stringify(val)); } catch {} }, [key, val]);
  return [val, setVal];
}

export function useWatchlist() {
  const [list, setList] = useLocalStorage('watchlist', []);
  const add = useCallback((item) => setList(p => p.some(i => i.id === item.id) ? p : [...p, { id: item.id, type: item.media_type || (item.title ? 'movie' : 'tv'), title: item.title || item.name, poster_path: item.poster_path, added: Date.now() }]), [setList]);
  const remove = useCallback((id) => setList(p => p.filter(i => i.id !== id)), [setList]);
  const has = useCallback((id) => list.some(i => i.id === id), [list]);
  return { list, add, remove, has };
}

export function useHistory() {
  const [list, setList] = useLocalStorage('history', []);
  const add = useCallback((item, progress = 0) => {
    setList(p => {
      const filtered = p.filter(i => !(i.id === item.id && i.type === (item.media_type || (item.title ? 'movie' : 'tv'))));
      return [{ id: item.id, type: item.media_type || (item.title ? 'movie' : 'tv'), title: item.title || item.name, poster_path: item.poster_path, backdrop_path: item.backdrop_path, progress, season: item.season, episode: item.episode, watched: Date.now() }, ...filtered].slice(0, 50);
    });
  }, [setList]);
  const remove = useCallback((id, type) => setList(p => p.filter(i => !(i.id === id && i.type === type))), [setList]);
  return { list, add, remove };
}

export function useRatings() {
  const [map, setMap] = useLocalStorage('ratings', {});
  const rate = useCallback((id, score) => setMap(p => ({ ...p, [id]: score })), [setMap]);
  const get = useCallback((id) => map[id] || 0, [map]);
  return { rate, get };
}
