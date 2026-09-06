import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export default function About() {
  return (
    <main className="page">
      <SEO title="About" description="Learn about Kinshow — your go-to platform for discovering movies and TV shows." url="https://kinshow.vercel.app/about" />
      <div className="legal-page">
        <h1 className="legal-title">About Kinshow</h1>

        <section className="legal-section">
          <h2>What is Kinshow?</h2>
          <p>Kinshow is a free cinema discovery platform designed to help you find your next favorite movie or TV show. We aggregate data from multiple sources to give you ratings, cast information, reviews, and streaming availability — all in one clean, easy-to-use interface.</p>
          <p>Whether you're looking for the latest trending series or a hidden gem from the past, Kinshow helps you discover, track, and organize your watchlist.</p>
        </section>

        <section className="legal-section">
          <h2>Features</h2>
          <ul>
            <li><strong>Movie & TV Database</strong> — Browse thousands of movies and TV shows with ratings, cast details, and synopses</li>
            <li><strong>Smart Search</strong> — Find titles instantly with our fast, responsive search</li>
            <li><strong>Personal Watchlist</strong> — Save movies and shows you want to watch later</li>
            <li><strong>Viewing History</strong> — Keep track of what you've watched</li>
            <li><strong>Episode Guide</strong> — Full season and episode listings for TV series</li>
            <li><strong>Streaming Links</strong> — Find where to watch your favorite content</li>
            <li><strong>Responsive Design</strong> — Works beautifully on desktop, tablet, and mobile</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Data Sources</h2>
          <p>Kinshow uses the following APIs to provide you with accurate and up-to-date information:</p>
          <ul>
            <li><strong>TVmaze</strong> — TV show data, episode guides, cast information, and images</li>
            <li><strong>OMDb API</strong> — Movie ratings, posters, and supplementary data</li>
            <li><strong>IMDb</strong> — Movie and show identification and ratings</li>
          </ul>
          <p>All movie and TV show data, images, and trademarks are the property of their respective owners. Kinshow does not host any content directly.</p>
        </section>

        <section className="legal-section">
          <h2>Technology</h2>
          <p>Kinshow is built with modern web technologies:</p>
          <ul>
            <li>React 18 with Vite</li>
            <li>React Router for navigation</li>
            <li>Deployed on Vercel</li>
            <li>Vercel Analytics for performance monitoring</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Disclaimer</h2>
          <p>Kinshow is an educational project built for demonstration purposes. We do not host, stream, or distribute any copyrighted content. All streaming links redirect to third-party services that hold the rights to distribute content. Users are responsible for ensuring they access content through legal and authorized channels.</p>
        </section>

        <section className="legal-section">
          <h2>Get in Touch</h2>
          <p>Have questions, suggestions, or feedback? Visit our <Link to="/contact">Contact page</Link> to reach out.</p>
        </section>
      </div>
    </main>
  );
}
