import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const DIST = join(process.cwd(), 'dist');
const indexHtml = readFileSync(join(DIST, 'index.html'), 'utf-8');

const routes = [
  {
    path: '/',
    title: 'Kinshow - Cinema Discovery',
    description: 'Discover movies and TV shows on Kinshow. Explore ratings, cast, reviews, and find where to stream.',
    canonical: 'https://kinshow.vercel.app/',
    type: 'website',
    content: `
      <h1 style="position:absolute;left:-9999px">Kinshow - Discover Movies & TV Shows</h1>
      <p style="position:absolute;left:-9999px">Browse popular movies, trending TV series, new releases, and top rated films. Find cast, ratings, reviews, and streaming links for thousands of titles.</p>
      <script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"Kinshow","url":"https://kinshow.vercel.app","description":"Discover movies and TV shows on Kinshow","potentialAction":{"@type":"SearchAction","target":"https://kinshow.vercel.app/explore?q={search_term_string}","query-input":"required name=search_term_string"}}</script>`
  },
  {
    path: '/movies',
    title: 'Movies - Kinshow',
    description: 'Discover films across every genre and era. Browse popular, top rated, and new movie releases on Kinshow.',
    canonical: 'https://kinshow.vercel.app/movies',
    type: 'website',
    content: `
      <h1 style="position:absolute;left:-9999px">Movies - Kinshow</h1>
      <p style="position:absolute;left:-9999px">Browse popular movies, top rated films, and new releases. Find your next favorite movie with ratings, cast info, and streaming links.</p>
      <script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://kinshow.vercel.app/"},{"@type":"ListItem","position":2,"name":"Movies","item":"https://kinshow.vercel.app/movies"}]}</script>`
  },
  {
    path: '/tv',
    title: 'TV Shows - Kinshow',
    description: 'Series worth your time. Browse popular, top rated, and currently airing TV shows on Kinshow.',
    canonical: 'https://kinshow.vercel.app/tv',
    type: 'website',
    content: `
      <h1 style="position:absolute;left:-9999px">TV Shows - Kinshow</h1>
      <p style="position:absolute;left:-9999px">Browse popular TV series, top rated shows, and currently airing episodes. Find cast, ratings, and streaming links for your favorite shows.</p>
      <script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://kinshow.vercel.app/"},{"@type":"ListItem","position":2,"name":"TV Shows","item":"https://kinshow.vercel.app/tv"}]}</script>`
  },
  {
    path: '/explore',
    title: 'Explore - Kinshow',
    description: 'Browse by genre and discover something new. Movies and TV shows for every taste.',
    canonical: 'https://kinshow.vercel.app/explore',
    type: 'website',
    content: `
      <h1 style="position:absolute;left:-9999px">Explore Movies & TV Shows</h1>
      <p style="position:absolute;left:-9999px">Explore movies and TV shows by genre. Find action, comedy, drama, horror, sci-fi, thriller, and more.</p>
      <script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://kinshow.vercel.app/"},{"@type":"ListItem","position":2,"name":"Explore","item":"https://kinshow.vercel.app/explore"}]}</script>`
  }
];

routes.forEach(route => {
  let html = indexHtml;

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${route.description}"`);
  html = html.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${route.canonical}"`);
  html = html.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${route.title}"`);
  html = html.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${route.description}"`);
  html = html.replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${route.canonical}"`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${route.title}"`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${route.description}"`);
  html = html.replace('<div id="root"></div>', `<div id="root">${route.content}</div>`);

  const dir = route.path === '/' ? DIST : join(DIST, route.path);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  console.log(`Prerendered: ${route.path}`);
});

console.log('Done prerendering static routes.');
