const TVMAZE = 'https://api.tvmaze.com';
const OMDB_KEY = 'b90dd268';
const OMDB = 'http://www.omdbapi.com';
const PRE = 'lg_';
const TTL = 30 * 60000;

const cache = (k) => { try { const d = JSON.parse(localStorage.getItem(PRE + k)); if (!d || Date.now() - d.t > TTL) { localStorage.removeItem(PRE + k); return null; } return d.v; } catch { return null; } };
const save = (k, v) => { try { localStorage.setItem(PRE + k, JSON.stringify({ v, t: Date.now() })); } catch {} };

async function fetchJSON(url, ms = 8000) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), ms);
  try { const r = await fetch(url, { signal: c.signal }); clearTimeout(t); if (!r.ok) throw 0; return await r.json(); } catch { clearTimeout(t); return null; }
}

function stripHtml(s) { return s ? s.replace(/<[^>]*>/g, '').trim() : ''; }

// OMDb API
async function omdbFetch(params) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), 8000);
  try {
    const url = new URL(OMDB);
    Object.entries({ ...params, apikey: OMDB_KEY }).forEach(([k, v]) => url.searchParams.set(k, v));
    const r = await fetch(url, { signal: c.signal });
    clearTimeout(t);
    if (!r.ok) throw 0;
    return await r.json();
  } catch { clearTimeout(t); return null; }
}

export async function omdbByImdb(imdbId) {
  const ck = 'omdb_' + imdbId;
  const hit = cache(ck);
  if (hit) return hit;
  const d = await omdbFetch({ i: imdbId });
  if (!d || d.Response === 'False') return null;
  save(ck, d);
  return d;
}

export async function omdbEpisodes(imdbId, season) {
  const ck = `omdb_ep_${imdbId}_${season}`;
  const hit = cache(ck);
  if (hit) return hit;
  const d = await omdbFetch({ i: imdbId, Season: season });
  if (!d || d.Response === 'False') return [];
  const eps = (d.Episodes || []).map(e => ({
    id: e.imdbID || '', number: parseInt(e.Episode) || 0, season,
    name: e.Title || `Episode ${e.Episode}`, airdate: e.Released || '',
    runtime: parseInt(e.Runtime) || 0, rating: parseFloat(e.imdbRating) || 0,
    overview: '', image: null
  }));
  save(ck, eps);
  return eps;
}

// TVmaze API
function _tvmazeToShow(d) {
  if (!d) return null;
  const s = d.show || d;
  return {
    id: s.id, imdbID: s.externals?.imdb || null,
    title: s.name, name: s.name,
    overview: stripHtml(s.summary),
    poster: s.image?.original || s.image?.medium || null,
    poster_path: s.image?.original || s.image?.medium || null,
    backdrop_path: null,
    vote_average: s.rating?.average || 0,
    rating: s.rating?.average || 0,
    release_date: s.premiered || '',
    first_air_date: s.premiered || '',
    year: (s.premiered || '').slice(0, 4),
    runtime: s.averageRuntime || s.runtime || 0,
    genres: (s.genres || []).map(g => ({ name: g })),
    genre_ids: [],
    media_type: 'tv', type: 'series',
    language: s.language || '',
    country: s.network?.country?.name || '',
    status: s.status || '',
    network: s.network?.name || s.webChannel?.name || '',
    totalSeasons: 0, ended: s.ended || '',
    tvmazeId: s.id, cast: [], crew: []
  };
}

export function tvmazeToShow(d) { return _tvmazeToShow(d); }

export async function tvmazeSearch(q) {
  if (!q?.trim()) return [];
  const ck = 'tv_s_' + q;
  const hit = cache(ck);
  if (hit) return hit;
  const d = await fetchJSON(`${TVMAZE}/search/shows?q=${encodeURIComponent(q)}`, 8000);
  if (!d) return [];
  const shows = d.map(r => _tvmazeToShow(r)).filter(Boolean);
  save(ck, shows);
  return shows;
}

export async function tvmazeShow(id) {
  const ck = 'tv_i_' + id;
  const hit = cache(ck);
  if (hit) return hit;
  const d = await fetchJSON(`${TVMAZE}/shows/${id}?embed[]=seasons&embed[]=cast`, 8000);
  if (!d) return null;
  const show = _tvmazeToShow(d);
  if (d._embedded?.seasons) show.totalSeasons = d._embedded.seasons.filter(s => s.number > 0).length;
  if (d._embedded?.cast) show.cast = d._embedded.cast.map(c => ({ name: c.person?.name || '', character: c.character?.name || '', profile_path: null }));
  save(ck, show);
  return show;
}

export async function tvmazeSeasons(showId) {
  const ck = 'tv_sea_' + showId;
  const hit = cache(ck);
  if (hit) return hit;
  const d = await fetchJSON(`${TVMAZE}/shows/${showId}/seasons`, 8000);
  if (!d) return [];
  const seasons = d.filter(s => s.number > 0).map(s => ({
    id: s.id, number: s.number, name: s.name,
    premiereDate: s.premiereDate, endDate: s.endDate,
    episodeOrder: s.episodeOrder,
    image: s.image?.medium || null,
    summary: stripHtml(s.summary)
  }));
  save(ck, seasons);
  return seasons;
}

export async function tvmazeEpisodes(showId, seasonNum) {
  const ck = `tv_ep_${showId}_${seasonNum}`;
  const hit = cache(ck);
  if (hit) return hit;
  const d = await fetchJSON(`${TVMAZE}/shows/${showId}/episodebyseasonnumber/${seasonNum}`, 8000);
  if (!d || !Array.isArray(d)) return [];
  const eps = d.map(e => ({
    id: e.id, number: e.number, season: e.season,
    name: e.name || `Episode ${e.number}`,
    airdate: e.airdate || '', runtime: e.runtime || 0,
    rating: e.rating?.average || 0,
    overview: stripHtml(e.summary),
    image: e.image?.medium || null
  }));
  save(ck, eps);
  return eps;
}

export async function searchMulti(q) {
  if (!q?.trim()) return { results: [] };
  const [tvResults] = await Promise.all([tvmazeSearch(q)]);
  const movieResults = MOVIES.filter(m => m.title.toLowerCase().includes(q.toLowerCase()));
  const items = [...movieResults.map(m => ({ ...m, media_type: 'movie' })), ...tvResults.map(s => ({ ...s, media_type: 'tv' }))];
  return { results: items };
}

export function getMovies(category = 'popular') {
  let items = [...MOVIES];
  if (category === 'top_rated') items.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
  else if (category === 'new') items = items.filter(m => parseInt(m.year) >= 2023);
  else items.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
  return items;
}

// Movie data - posters from OMDb
export const MOVIES = [
  { id: 'tt1160419', title: 'Dune: Part Two', overview: 'Paul Atreides unites with the Fremen while on a warpath of revenge against the conspirators who destroyed his family.', poster_path: 'https://m.media-amazon.com/images/M/MV5BNWIyNmU5MGYtZDZmNi00ZjAwLWJlYjgtZTc0ZGIxMDE4ZGYwXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg', vote_average: 8.3, year: '2024', runtime: 166, genres: [{ name: 'Sci-Fi' }, { name: 'Adventure' }], director: 'Denis Villeneuve', actors: 'Timothée Chalamet, Zendaya, Austin Butler', language: 'English', country: 'USA', rated: 'PG-13', boxOffice: '$282M' },
  { id: 'tt6718170', title: 'Oppenheimer', overview: 'The story of American physicist J. Robert Oppenheimer and his role in the development of the atomic bomb.', poster_path: 'https://m.media-amazon.com/images/M/MV5BOGZlN2EzOTYtMzUzOS00NTM3LTg0MTQtZDVjZGM4YmJlNWNhXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg', vote_average: 8.3, year: '2023', runtime: 180, genres: [{ name: 'Drama' }, { name: 'History' }], director: 'Christopher Nolan', actors: 'Cillian Murphy, Emily Blunt, Matt Damon', language: 'English', country: 'USA', rated: 'R', boxOffice: '$325M' },
  { id: 'tt1185834', title: 'Guardians of the Galaxy Vol. 3', overview: 'The Guardians must protect one of their own from a mysterious new opponent.', poster_path: 'https://m.media-amazon.com/images/M/MV5BYjExN2YwZmYtODlkNy00MTMzLWIwOTMtNDZlYWEzNjMxODBmXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg', vote_average: 7.9, year: '2023', runtime: 150, genres: [{ name: 'Action' }, { name: 'Sci-Fi' }], director: 'James Gunn', actors: 'Chris Pratt, Zoe Saldaña, Dave Bautista', language: 'English', country: 'USA', rated: 'PG-13', boxOffice: '$358M' },
  { id: 'tt15239678', title: 'Poor Things', overview: 'Bella Baxter is brought back to life by an unorthodox scientist, eager to learn about the world.', poster_path: 'https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NjFiLTlkMWUtOGQ5NjFmYWUyZGJhXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg', vote_average: 7.9, year: '2023', runtime: 141, genres: [{ name: 'Sci-Fi' }, { name: 'Comedy' }], director: 'Yorgos Lanthimos', actors: 'Emma Stone, Mark Ruffalo, Willem Dafoe', language: 'English', country: 'UK/Ireland', rated: 'R', boxOffice: '$64M' },
  { id: 'tt15398776', title: 'The Brutalist', overview: 'A visionary architect and his wife flee post-war Europe for a new life in America.', poster_path: 'https://m.media-amazon.com/images/M/MV5BN2JkMDc5MGQtZjg3YS00NmFiLWIyZmQtZTJmNTM5MjVmYTQ4XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg', vote_average: 7.5, year: '2024', runtime: 215, genres: [{ name: 'Drama' }], director: 'Brady Corbet', actors: 'Adrien Brody, Felicity Jones, Guy Pearce', language: 'English', country: 'USA', rated: 'R', boxOffice: '$12M' },
  { id: 'tt9362722', title: 'Spider-Man: Across the Spider-Verse', overview: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People.', poster_path: 'https://m.media-amazon.com/images/M/MV5BNThiZjA3MjItZGY5Ni00ZmJhLWEwN2EtOTBlYTA4Y2E0M2ZmXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg', vote_average: 8.4, year: '2023', runtime: 140, genres: [{ name: 'Animation' }, { name: 'Action' }], director: 'Joaquim Dos Santos', actors: 'Shameik Moore, Hailee Steinfeld, Oscar Isaac', language: 'English', country: 'USA', rated: 'PG', boxOffice: '$381M' },
  { id: 'tt14539740', title: 'Godzilla x Kong: The New Empire', overview: 'Two ancient titans, Godzilla and Kong, team up against a colossal undiscovered threat.', poster_path: 'https://m.media-amazon.com/images/M/MV5BMTY0N2MzODctY2ExYy00OWYxLTkyNDItMTVhZGIxZjliZjU5XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg', vote_average: 7.0, year: '2024', runtime: 115, genres: [{ name: 'Action' }, { name: 'Sci-Fi' }], director: 'Adam Wingard', actors: 'Rebecca Hall, Brian Tyree Henry, Dan Stevens', language: 'English', country: 'USA', rated: 'PG-13', boxOffice: '$196M' },
  { id: 'tt10648342', title: 'Inside Out 2', overview: 'Riley enters puberty and experiences brand new, more complex emotions.', poster_path: 'https://m.media-amazon.com/images/M/MV5BZjRiMDhiZjQtNjk5Yi00ZDcwLTkyYTEtMDc1NjdmNjFhNGIzXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg', vote_average: 7.6, year: '2024', runtime: 100, genres: [{ name: 'Animation' }, { name: 'Comedy' }], director: 'Kelsey Mann', actors: 'Amy Poehler, Maya Hawke, Ayo Edebiri', language: 'English', country: 'USA', rated: 'PG', boxOffice: '$653M' },
  { id: 'tt0111161', title: 'The Shawshank Redemption', overview: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption.', poster_path: 'https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg', vote_average: 8.7, year: '1994', runtime: 142, genres: [{ name: 'Drama' }], director: 'Frank Darabont', actors: 'Tim Robbins, Morgan Freeman', language: 'English', country: 'USA', rated: 'R' },
  { id: 'tt0068646', title: 'The Godfather', overview: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', poster_path: 'https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg', vote_average: 8.7, year: '1972', runtime: 175, genres: [{ name: 'Drama' }, { name: 'Crime' }], director: 'Francis Ford Coppola', actors: 'Marlon Brando, Al Pacino, James Caan', language: 'English', country: 'USA', rated: 'R' },
  { id: 'tt0468569', title: 'The Dark Knight', overview: 'Batman faces the Joker, a criminal mastermind who wants to plunge Gotham City into anarchy.', poster_path: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_QL75_UX380_CR0,2,380,562_.jpg', vote_average: 8.5, year: '2008', runtime: 152, genres: [{ name: 'Action' }, { name: 'Crime' }], director: 'Christopher Nolan', actors: 'Christian Bale, Heath Ledger, Aaron Eckhart', language: 'English', country: 'USA', rated: 'PG-13', boxOffice: '$534M' },
  { id: 'tt1375666', title: 'Inception', overview: 'A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea.', poster_path: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_QL75_UX380_CR0,2,380,562_.jpg', vote_average: 8.4, year: '2010', runtime: 148, genres: [{ name: 'Sci-Fi' }, { name: 'Action' }], director: 'Christopher Nolan', actors: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page', language: 'English', country: 'USA', rated: 'PG-13', boxOffice: '$293M' },
  { id: 'tt0816692', title: 'Interstellar', overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', poster_path: 'https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg', vote_average: 8.4, year: '2014', runtime: 169, genres: [{ name: 'Sci-Fi' }, { name: 'Drama' }], director: 'Christopher Nolan', actors: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain', language: 'English', country: 'USA/UK', rated: 'PG-13', boxOffice: '$188M' },
  { id: 'tt0167260', title: 'The Lord of the Rings: The Return of the King', overview: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam.', poster_path: 'https://m.media-amazon.com/images/M/MV5BMTZkMjBjNWMtZGI5OC00MGU0LTk4ZTItODg2NWM3NTVmNWQ4XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg', vote_average: 8.5, year: '2003', runtime: 201, genres: [{ name: 'Fantasy' }, { name: 'Adventure' }], director: 'Peter Jackson', actors: 'Elijah Wood, Viggo Mortensen, Ian McKellen', language: 'English', country: 'New Zealand', rated: 'PG-13', boxOffice: '$377M' },
  { id: 'tt0120737', title: 'The Lord of the Rings: The Fellowship of the Ring', overview: 'A young hobbit sets out on a journey to destroy the One Ring and save Middle-earth.', poster_path: 'https://m.media-amazon.com/images/M/MV5BNzIxMDQ2YTctNDY4MC00ZTRhLTk4ODQtMTVlOWY4NTdiYmMwXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg', vote_average: 8.4, year: '2001', runtime: 178, genres: [{ name: 'Fantasy' }, { name: 'Adventure' }], director: 'Peter Jackson', actors: 'Elijah Wood, Ian McKellen, Orlando Bloom', language: 'English', country: 'New Zealand', rated: 'PG-13' },
  { id: 'tt1675434', title: 'The Intouchables', overview: 'A wealthy quadriplegic hires a young man from the projects to be his caregiver.', poster_path: 'https://m.media-amazon.com/images/M/MV5BMTYxNDA3MDQwNl5BMl5BanBnXkFtZTcwNTU4Mzc1Nw@@._V1_QL75_UX380_CR0,2,380,562_.jpg', vote_average: 8.5, year: '2011', runtime: 112, genres: [{ name: 'Drama' }, { name: 'Comedy' }], director: 'Olivier Nakache', actors: 'François Cluzet, Omar Sy', language: 'French', country: 'France', rated: 'R' },
  { id: 'tt0137523', title: 'Fight Club', overview: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club.', poster_path: 'https://m.media-amazon.com/images/M/MV5BOTgyOGQ1NDItNGU3Ny00MjU3LTg2YWEtNmEyYjBiMjI1Y2M5XkEyXkFqcGc@._V1_QL75_UX380_CR0,2,380,562_.jpg', vote_average: 8.4, year: '1999', runtime: 139, genres: [{ name: 'Drama' }, { name: 'Thriller' }], director: 'David Fincher', actors: 'Brad Pitt, Edward Norton, Helena Bonham Carter', language: 'English', country: 'USA/Germany', rated: 'R' },
  { id: 'tt0109830', title: 'Forrest Gump', overview: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events from the perspective of an Alabama man.', poster_path: 'https://m.media-amazon.com/images/M/MV5BNDYwNzVjMTItZmU5YS00YjQ5LTljYjgtMjY2NDVmYWMyNWFmXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg', vote_average: 8.5, year: '1994', runtime: 142, genres: [{ name: 'Drama' }, { name: 'Romance' }], director: 'Robert Zemeckis', actors: 'Tom Hanks, Robin Wright, Gary Sinise', language: 'English', country: 'USA', rated: 'PG-13', boxOffice: '$677M' },
  { id: 'tt0110912', title: 'Pulp Fiction', overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.', poster_path: 'https://m.media-amazon.com/images/M/MV5BYTViYTE3ZGQtNDBlMC00ZTAyLTkyODMtZGRiZDg0MjA2YThkXkEyXkFqcGc@._V1_QL75_UX380_CR0,2,380,562_.jpg', vote_average: 8.5, year: '1994', runtime: 154, genres: [{ name: 'Crime' }, { name: 'Drama' }], director: 'Quentin Tarantino', actors: 'John Travolta, Uma Thurman, Samuel L. Jackson', language: 'English', country: 'USA', rated: 'R' },
  { id: 'tt0167261', title: 'The Lord of the Rings: The Two Towers', overview: 'The Fellowship splinters as Frodo and Sam continue the quest to destroy the One Ring.', poster_path: 'https://m.media-amazon.com/images/M/MV5BMGQxMDdiOWUtYjc1Ni00YzM1LWE2NjMtZTg3Y2JkMjEzMTJjXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg', vote_average: 8.4, year: '2002', runtime: 179, genres: [{ name: 'Fantasy' }, { name: 'Adventure' }], director: 'Peter Jackson', actors: 'Elijah Wood, Viggo Mortensen, Ian McKellen', language: 'English', country: 'New Zealand', rated: 'PG-13' },
  { id: 'tt1201607', title: 'Harry Potter and the Deathly Hallows: Part 2', overview: 'Harry, Ron, and Hermione search for Voldemort\'s remaining Horcruxes in their final battle.', poster_path: 'https://m.media-amazon.com/images/M/MV5BOTA1Mzc2N2ItZWRiNS00MjQzLTlmZDQtMjU0NmY1YWRkMGQ4XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg', vote_average: 8.1, year: '2011', runtime: 130, genres: [{ name: 'Fantasy' }, { name: 'Adventure' }], director: 'David Yates', actors: 'Daniel Radcliffe, Emma Watson, Rupert Grint', language: 'English', country: 'UK/USA', rated: 'PG-13', boxOffice: '$1.34B' },
  { id: 'tt0114709', title: 'Toy Story', overview: 'A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy.', poster_path: 'https://m.media-amazon.com/images/M/MV5BZTA3OWVjOWItNjE1NS00NzZiLWE1MjgtZDZhMWI1ZTlkNzYwXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg', vote_average: 8.1, year: '1995', runtime: 81, genres: [{ name: 'Animation' }, { name: 'Comedy' }], director: 'John Lasseter', actors: 'Tom Hanks, Tim Allen', language: 'English', country: 'USA', rated: 'G', boxOffice: '$373M' },
  { id: 'tt0102926', title: 'The Silence of the Lambs', overview: 'A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer.', poster_path: 'https://m.media-amazon.com/images/M/MV5BNDdhOGJhYzctYzYwZC00YmI2LWI0MjctYjg4ODdlMDExYjBlXkEyXkFqcGc@._V1_QL75_UX380_CR0,2,380,562_.jpg', vote_average: 8.3, year: '1991', runtime: 118, genres: [{ name: 'Crime' }, { name: 'Thriller' }], director: 'Jonathan Demme', actors: 'Jodie Foster, Anthony Hopkins', language: 'English', country: 'USA', rated: 'R' },
  { id: 'tt0120815', title: 'Saving Private Ryan', overview: 'Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper.', poster_path: 'https://m.media-amazon.com/images/M/MV5BZGZhZGQ1ZWUtZTZjYS00MDJhLWFkYjctN2ZlYjE5NWYwZDM2XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg', vote_average: 8.2, year: '1998', runtime: 169, genres: [{ name: 'Drama' }, { name: 'War' }], director: 'Steven Spielberg', actors: 'Tom Hanks, Matt Damon, Tom Sizemore', language: 'English', country: 'USA', rated: 'R', boxOffice: '$482M' },
  { id: 'tt1285016', title: 'The Social Network', overview: 'As Harvard student Mark Zuckerberg creates the social networking site that would become known as Facebook.', poster_path: 'https://m.media-amazon.com/images/M/MV5BMjlkNTE5ZTUtNGEwNy00MGVhLThmZjMtZjU1NDE5Zjk1NDZkXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg', vote_average: 7.4, year: '2010', runtime: 120, genres: [{ name: 'Drama' }, { name: 'Biography' }], director: 'David Fincher', actors: 'Jesse Eisenberg, Andrew Garfield, Justin Timberlake', language: 'English', country: 'USA', rated: 'PG-13' },
  { id: 'tt1049413', title: 'Up', overview: 'An unlikely elderly hero sets out to fulfill his lifelong dream of adventure by lifting his house with balloons.', poster_path: 'https://m.media-amazon.com/images/M/MV5BNmI1ZTc5MWMtMDYyOS00ZDc2LTkzOTAtNjQ4NWIxNjYyNDgzXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg', vote_average: 8.0, year: '2009', runtime: 96, genres: [{ name: 'Animation' }, { name: 'Comedy' }], director: 'Pete Docter', actors: 'Edward Asner, Jordan Nagai, John Ratzenberger', language: 'English', country: 'USA', rated: 'PG', boxOffice: '$293M' },
  { id: 'tt0245429', title: 'Spirited Away', overview: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods and witches.', poster_path: 'https://m.media-amazon.com/images/M/MV5BNTEyNmEwOWUtYzkyOC00ZTQ4LTllZmUtMjk0Y2YwOGUzYjRiXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg', vote_average: 8.6, year: '2001', runtime: 125, genres: [{ name: 'Animation' }, { name: 'Fantasy' }], director: 'Hayao Miyazaki', actors: 'Rumi Hiiragi, Miyu Irino', language: 'Japanese', country: 'Japan', rated: 'PG' },
  { id: 'tt0114814', title: 'The Usual Suspects', overview: 'A sole survivor tells of the twisty events leading up to a horrific gun battle on a boat.', poster_path: 'https://m.media-amazon.com/images/M/MV5BOTE5MDUxZDUtZWZmZC00NDVmLWFhOGQtNWI2YTc4NzY3MGQ0XkEyXkFqcGc@._V1_QL75_UX380_CR0,2,380,562_.jpg', vote_average: 8.2, year: '1995', runtime: 106, genres: [{ name: 'Crime' }, { name: 'Mystery' }], director: 'Bryan Singer', actors: 'Kevin Spacey, Gabriel Byrne, Chazz Palminteri', language: 'English', country: 'USA', rated: 'R' },
  { id: 'tt0266697', title: 'Parasite', overview: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.', poster_path: 'https://m.media-amazon.com/images/M/MV5BZmMyYzJlZmYtY2I3NC00NjAyLTkyZWItZjdjZDI1YTYyYTEwXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg', vote_average: 8.5, year: '2019', runtime: 132, genres: [{ name: 'Thriller' }, { name: 'Drama' }], director: 'Bong Joon-ho', actors: 'Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong', language: 'Korean', country: 'South Korea', rated: 'R', boxOffice: '$53M' },
];

export function year(item) { return item.year || (item.release_date || item.first_air_date || '').slice(0, 4) || '—'; }
export function rating(item) { const v = item.vote_average || item.rating; return v ? (typeof v === 'number' ? v.toFixed(1) : String(v)) : '—'; }
export function title(item) { return item.title || item.name || 'Untitled'; }
export function runtime(min) { if (!min) return ''; const n = typeof min === 'string' ? parseInt(min) : min; if (isNaN(n)) return ''; const h = ~~(n / 60), m = n % 60; return h ? `${h}h ${m}m` : `${m}m`; }
