import { useState, useEffect, useRef, useCallback } from 'react';

export function useInfiniteScroll(allItems, batchSize = 12) {
  const [visible, setVisible] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  useEffect(() => {
    const next = allItems.slice(0, batchSize);
    setVisible(next);
    setHasMore(allItems.length > batchSize);
    setPage(1);
  }, [allItems, batchSize]);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    const end = nextPage * batchSize;
    const next = allItems.slice(0, end);
    setVisible(next);
    setPage(nextPage);
    setHasMore(end < allItems.length);
  }, [allItems, page, batchSize]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el || !hasMore) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore) loadMore();
    }, { rootMargin: '400px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loadMore]);

  return { visible, hasMore, loaderRef };
}
