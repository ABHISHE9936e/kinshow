import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SERVERS = [
  { id: 'vidsrc', name: 'VidSrc', build: (type, imdbId, title, season, episode) => {
    if (type === 'tv') {
      if (imdbId && imdbId.startsWith('tt')) return `https://vidsrc.pm/embed/tv?imdb=${imdbId}&season=${season || 1}&episode=${episode || 1}`;
      return `https://vidsrc.pm/embed/tv?tmdb=${imdbId}&season=${season || 1}&episode=${episode || 1}`;
    }
    if (imdbId && imdbId.startsWith('tt')) return `https://vidsrc.pm/embed/movie?imdb=${imdbId}`;
    return `https://vidsrc.pm/embed/movie?tmdb=${imdbId}`;
  }},
  { id: 'vidsrc-sbs', name: 'VidSrc.sbs', build: (type, imdbId, title, season, episode) => {
    if (type === 'tv') {
      if (imdbId && imdbId.startsWith('tt')) return `https://vidsrc.sbs/embed/tv?imdb=${imdbId}&season=${season || 1}&episode=${episode || 1}`;
      return `https://vidsrc.sbs/embed/tv?tmdb=${imdbId}&season=${season || 1}&episode=${episode || 1}`;
    }
    if (imdbId && imdbId.startsWith('tt')) return `https://vidsrc.sbs/embed/movie?imdb=${imdbId}`;
    return `https://vidsrc.sbs/embed/movie?tmdb=${imdbId}`;
  }},
  { id: 'vidcore', name: 'VidCore', build: (type, imdbId, title, season, episode) => {
    if (type === 'tv') {
      if (imdbId && imdbId.startsWith('tt')) return `https://vidcore.org/embed/tv?imdb=${imdbId}&season=${season || 1}&episode=${episode || 1}`;
      return `https://vidcore.org/embed/tv?tmdb=${imdbId}&season=${season || 1}&episode=${episode || 1}`;
    }
    if (imdbId && imdbId.startsWith('tt')) return `https://vidcore.org/embed/movie?imdb=${imdbId}`;
    return `https://vidcore.org/embed/movie?tmdb=${imdbId}`;
  }},
  { id: 'multiembed', name: 'MultiEmbed', build: (type, imdbId, title, season, episode) => {
    if (imdbId && imdbId.startsWith('tt')) {
      if (type === 'tv') return `https://multiembed.mov/?video_id=${imdbId}&season=${season || 1}&episode=${episode || 1}`;
      return `https://multiembed.mov/?video_id=${imdbId}`;
    }
    return `https://multiembed.mov/?video_id=${imdbId}`;
  }},
];

export default function Player() {
  const location = useLocation();
  const navigate = useNavigate();
  const [server, setServer] = useState(0);
  const [loc, setLoc] = useState(null);

  useEffect(() => {
    if (location.state) { setLoc(location.state); localStorage.setItem('lg_lastViewed', JSON.stringify(location.state)); }
    else { const saved = localStorage.getItem('lg_lastViewed'); if (saved) setLoc(JSON.parse(saved)); }
  }, [location.state]);

  useEffect(() => { const h = (e) => { if (e.key === 'Escape') navigate(-1); }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h); }, [navigate]);

  if (!loc) return <main className="page player-page"><div className="empty-state"><h3>No content selected</h3><p>Go back and select something to watch.</p></div></main>;

  const { type = 'movie', id, title, imdbId, tvmazeId, season, episode } = loc;
  const effectiveId = (imdbId && imdbId.startsWith('tt')) ? imdbId : (id || imdbId || tvmazeId);
  const url = SERVERS[server].build(type, effectiveId, title, season, episode);

  return (
    <main className="page player-page">
      <div className="player-header">
        <button className="btn btn--ghost" onClick={() => navigate(-1)}>← Back</button>
        <h2 className="player-title">{title}{type === 'tv' && season ? ` — S${String(season).padStart(2, '0')}E${String(episode || 1).padStart(2, '0')}` : ''}</h2>
      </div>
      <div className="player-servers">
        {SERVERS.map((sv, i) => <button key={sv.id} className={`player-server-btn ${i === server ? 'player-server-btn--active' : ''}`} onClick={() => setServer(i)}>{sv.name}</button>)}
      </div>
      <div className="player-container">
        <iframe key={`${server}-${url}`} src={url} title={title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="player-iframe" sandbox="allow-scripts allow-same-origin allow-popups" />
      </div>
    </main>
  );
}
