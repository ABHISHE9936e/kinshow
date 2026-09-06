import { still } from '../api';

export default function EpisodeCard({ ep, onClick }) {
  return (
    <button className="ep-card" onClick={onClick} aria-label={`Episode ${ep.episode_number}: ${ep.name}`}>
      <div className="ep-card-thumb">
        {ep.still_path ? <img src={still(ep.still_path)} alt="" loading="lazy" /> : <div className="ep-card-thumb-empty"><span>E{ep.episode_number}</span></div>}
        <div className="ep-card-play">▶</div>
      </div>
      <div className="ep-card-info">
        <div className="ep-card-header">
          <span className="ep-card-num">E{ep.episode_number}</span>
          <span className="ep-card-title">{ep.name}</span>
        </div>
        {ep.air_date && <span className="ep-card-date">{ep.air_date}</span>}
        {ep.runtime && <span className="ep-card-runtime">{ep.runtime}m</span>}
        {ep.overview && <p className="ep-card-desc">{ep.overview}</p>}
      </div>
    </button>
  );
}
