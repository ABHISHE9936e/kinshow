import { Helmet } from 'react-helmet-async';

const SITE = 'https://kinshow.vercel.app';
const DEFAULT_DESC = 'Discover movies and TV shows on Kinshow. Explore ratings, cast, reviews, and find where to stream.';

export function SEO({ title, description, image, url, type = 'website' }) {
  const t = title ? `${title} | Kinshow` : 'Kinshow - Cinema Discovery';
  const d = description || DEFAULT_DESC;
  const u = url || SITE;
  const img = image || `${SITE}/og-default.png`;

  return (
    <Helmet>
      <title>{t}</title>
      <meta name="description" content={d} />
      <link rel="canonical" href={u} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={t} />
      <meta property="og:description" content={d} />
      <meta property="og:image" content={img} />
      <meta property="og:url" content={u} />
      <meta property="og:site_name" content="Kinshow" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t} />
      <meta name="twitter:description" content={d} />
      <meta name="twitter:image" content={img} />
    </Helmet>
  );
}

export function StructuredData({ data }) {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
}

export function movieSchema(movie) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    description: movie.overview,
    image: movie.poster_path || movie.poster,
    datePublished: movie.release_date || movie.year,
    aggregateRating: movie.vote_average ? {
      '@type': 'AggregateRating',
      ratingValue: movie.vote_average,
      bestRating: 10,
      ratingCount: movie.vote_count || 100
    } : undefined,
    genre: movie.genres?.map(g => typeof g === 'string' ? g : g.name),
    director: movie.director !== 'N/A' ? movie.director : undefined,
    actor: movie.actors !== 'N/A' ? movie.actors?.split(',').map(n => ({ '@type': 'Person', name: n.trim() })) : undefined,
    duration: movie.runtime > 0 ? `PT${movie.runtime}M` : undefined,
    url: `${SITE}/detail/movie/${movie.imdbID || movie.id}`
  };
}

export function tvSchema(show) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: show.title,
    description: show.overview,
    image: show.poster_path || show.poster,
    datePublished: show.year,
    aggregateRating: show.rating > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: show.rating,
      bestRating: 10
    } : undefined,
    genre: show.genres?.map(g => typeof g === 'string' ? g : g.name),
    numberOfSeasons: show.totalSeasons,
    url: `${SITE}/detail/tv/${show.id}`
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Kinshow',
    url: SITE,
    description: DEFAULT_DESC,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE}/explore?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url
    }))
  };
}
