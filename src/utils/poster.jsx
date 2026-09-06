import { useState, useMemo } from 'react';

const COLORS = [
  ['#1a1a2e', '#16213e', '#0f3460'], ['#1b1b2f', '#162447', '#1f4068'],
  ['#2d132c', '#801336', '#c72c41'], ['#0a1628', '#1b2838', '#2a4858'],
  ['#1c1427', '#33234e', '#4a3567'], ['#0d1117', '#161b22', '#21262d'],
  ['#1a1423', '#3d2c5e', '#5b3a8c'], ['#1e1e30', '#2e2e50', '#3e3e70'],
];

export function makePoster(title, year, rating, idx) {
  const [c1, c2, c3] = COLORS[Math.abs(idx || 0) % COLORS.length];
  const initial = (title || '?')[0].toUpperCase();
  const words = (title || '').split(' ');
  const lines = [];
  let line = '';
  for (const w of words) { if ((line + ' ' + w).length > 14) { if (line) lines.push(line); line = w; } else { line = line ? line + ' ' + w : w; } }
  if (line) lines.push(line);
  const safe = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const titleSvg = lines.slice(0, 3).map((l, i) => `<text x="150" y="${200 + i * 22}" text-anchor="middle" font-family="sans-serif" font-size="15" font-weight="600" fill="rgba(255,255,255,0.85)">${safe(l)}</text>`).join('');
  const yearSvg = year && year !== '—' ? `<text x="150" y="${200 + Math.min(lines.length, 3) * 22 + 18}" text-anchor="middle" font-family="sans-serif" font-size="12" fill="rgba(255,255,255,0.4)">${year}</text>` : '';
  const ratingSvg = rating && rating !== '—' ? `<circle cx="260" cy="35" r="18" fill="rgba(0,0,0,0.5)"/><text x="260" y="40" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="700" fill="#d4a843">★ ${rating}</text>` : '';
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c1}"/><stop offset="50%" stop-color="${c2}"/><stop offset="100%" stop-color="${c3}"/></linearGradient></defs><rect width="300" height="450" fill="url(#g)"/><text x="150" y="130" text-anchor="middle" font-family="Georgia,serif" font-size="72" font-weight="700" fill="rgba(255,255,255,0.07)">${initial}</text>${titleSvg}${yearSvg}${ratingSvg}</svg>`)}`;
}

export function PosterImg({ src, title, year, rating, idx, className, alt }) {
  const [failed, setFailed] = useState(false);
  const fallback = useMemo(() => makePoster(title, year, rating, idx), [title, year, rating, idx]);
  const showReal = src && !failed;
  return showReal
    ? <img src={src} alt={alt || title} className={className} loading="lazy" onError={() => setFailed(true)} />
    : <img src={fallback} alt={alt || title} className={className} />;
}
