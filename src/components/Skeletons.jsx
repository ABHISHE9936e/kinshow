export function SkeletonCards({ count = 8 }) {
  return Array.from({ length: count }).map((_, i) => (
    <div key={i} className="card card--skeleton"><div className="card-poster skeleton-pulse" /><div className="card-meta"><div className="skeleton-line skeleton-line--w80" /><div className="skeleton-line skeleton-line--w40" /></div></div>
  ));
}

export function SkeletonHero() {
  return <div className="hero-skeleton"><div className="skeleton-pulse" /></div>;
}

export function SkeletonDetail() {
  return (
    <div className="detail-skeleton">
      <div className="detail-skeleton-backdrop skeleton-pulse" />
      <div className="detail-skeleton-content">
        <div className="detail-skeleton-poster skeleton-pulse" />
        <div className="detail-skeleton-info">
          <div className="skeleton-line skeleton-line--w60 skeleton-line--h32" />
          <div className="skeleton-line skeleton-line--w40" />
          <div className="skeleton-line skeleton-line--w100" />
          <div className="skeleton-line skeleton-line--w100" />
          <div className="skeleton-line skeleton-line--w80" />
        </div>
      </div>
    </div>
  );
}
