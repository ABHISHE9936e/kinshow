import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import { useWatchlist } from './store';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import Detail from './pages/Detail';
import Player from './pages/Player';
import Watchlist from './pages/Watchlist';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';

function AppInner() {
  const { list } = useWatchlist();
  return (
    <>
      <Navbar watchlistCount={list.length} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/tv" element={<TVShows />} />
        <Route path="/detail/:type/:id" element={<Detail />} />
        <Route path="/player" element={<Player />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
      <div className="ad-container">
        <div id="container-962da97bc81437bf9bb4384db35f6192"></div>
      </div>
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="footer-brand"><span className="nav-logo-mark">KS</span> Kinshow</div>
              <p className="footer-desc">Your premium cinema discovery platform. Explore movies and TV shows, track your watchlist, and find where to stream.</p>
            </div>
            <div className="footer-col">
              <h4 className="footer-heading">Browse</h4>
              <ul className="footer-links">
                <li><a href="/movies">Movies</a></li>
                <li><a href="/tv">TV Shows</a></li>
                <li><a href="/explore">Explore</a></li>
                <li><a href="/watchlist">My List</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4 className="footer-heading">Company</h4>
              <ul className="footer-links">
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4 className="footer-heading">Powered By</h4>
              <ul className="footer-links footer-links--muted">
                <li><a href="https://www.tvmaze.com/" target="_blank" rel="noopener noreferrer">TVmaze API</a></li>
                <li><a href="https://www.omdbapi.com/" target="_blank" rel="noopener noreferrer">OMDb API</a></li>
                <li><a href="https://www.imdb.com/" target="_blank" rel="noopener noreferrer">IMDb</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-copy">© 2026 Kinshow. For educational purposes only. All product names, logos, and brands are property of their respective owners.</p>
            <p className="footer-copy" style={{marginTop: '8px'}}><a href="https://www.profitableratecpmnetwork.com/u8ys3gam?key=6df6fc40cf7a63bafcab24a531e17840" target="_blank" rel="noopener noreferrer" style={{color: 'var(--text-muted)', fontSize: '11px'}}>Sponsored</a></p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppInner />
      </ToastProvider>
    </BrowserRouter>
  );
}
