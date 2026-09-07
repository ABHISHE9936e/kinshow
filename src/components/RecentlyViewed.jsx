import { getRecents } from '../utils/cookies';
import { Link } from 'react-router-dom';
import { PosterImg } from '../utils/poster';

export default function RecentlyViewed() {
  const recents = getRecents();
  if (recents.length === 0) return null;

  return (
    <section className="detail-section">
      <h2 className="detail-section-title">Recently Viewed</h2>
      <div className="recently-scroll">
        {recents.map((item, i) => (
          <Link key={`${item.id}-${i}`} to={`/detail/${item.type}/${item.id}`} className="recently-card">
            <div className="recently-poster">
              <PosterImg src={item.poster} title={item.title} year="" rating="" idx={i} className="recently-poster-img" alt={item.title} />
            </div>
            <span className="recently-title">{item.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
