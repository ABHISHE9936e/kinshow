# Kinshow — Cinema Discovery Platform

A free movie and TV show discovery platform built with React. Browse 80+ curated films, 250+ TV shows, check ratings, cast info, episode guides, and find where to stream — all in one place.

**Live:** [kinshow.vercel.app](https://kinshow.vercel.app/)  
**Blog:** [kinshow.vercel.app/blog](https://kinshow.vercel.app/blog)

---

## Features

- **Movie Discovery** — 80+ curated movies with ratings, cast, reviews, and streaming links
- **TV Shows** — 250+ shows from TVmaze with full season and episode guides
- **Smart Search** — Instant search across movies and TV shows
- **Personal Watchlist** — Save titles to watch later (localStorage, no account needed)
- **Viewing History** — Track what you've watched
- **Genre Explorer** — Browse by Action, Comedy, Drama, Horror, Sci-Fi, Thriller, and more
- **Multi-Server Player** — 4 streaming servers (VidSrc, VidCore, Peachify, VidFast)
- **Episode Navigation** — Previous/next episode buttons for TV shows
- **Blog** — Movie guides, recommendations, and lists for SEO
- **Fully Responsive** — Works on desktop, tablet, and mobile
- **Dark Theme** — Premium UI with smooth animations
- **SEO Optimized** — Schema.org, Open Graph, sitemap, prerendered HTML
- **GDPR Compliant** — Cookie consent banner

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite 5 | Build Tool & Dev Server |
| React Router 6 | Client-side Routing |
| React Helmet Async | SEO Meta Tags |
| TVmaze API | TV Show Data & Images |
| OMDb API | Movie Data & Posters |
| Vercel | Hosting, Analytics & CI/CD |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/kiinshuk/kinshow.git

# Navigate to project directory
cd kinshow

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Prerender for SEO

```bash
npm run build && node prerender.mjs
```

## Project Structure

```
kinshow/
├── public/
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── Navbar.jsx         # Navigation with search
│   │   ├── Hero.jsx           # Featured content carousel with poster backgrounds
│   │   ├── MediaCard.jsx      # Movie/TV show card
│   │   ├── ContentRail.jsx    # Horizontal scroll section
│   │   ├── CastCard.jsx       # Actor profile card
│   │   ├── CookieConsent.jsx  # GDPR cookie consent
│   │   ├── RecentlyViewed.jsx # Recently viewed section
│   │   ├── Toast.jsx          # Toast notifications
│   │   ├── Skeletons.jsx      # Loading states
│   │   └── SEO.jsx            # SEO, Schema.org, breadcrumbs
│   ├── pages/
│   │   ├── Home.jsx           # Landing page with hero + content rails
│   │   ├── Movies.jsx         # Movie browser with tabs
│   │   ├── TVShows.jsx        # TV show browser with tabs
│   │   ├── Detail.jsx         # Movie/TV show details + episodes
│   │   ├── Player.jsx         # Multi-server video player
│   │   ├── Watchlist.jsx      # User watchlist
│   │   ├── Profile.jsx        # User profile + viewing history
│   │   ├── Explore.jsx        # Genre explorer
│   │   ├── Blog.jsx           # Blog listing page
│   │   ├── BlogPost.jsx       # Blog article page
│   │   ├── About.jsx          # About page with FAQ
│   │   ├── Contact.jsx        # Contact page with FAQ
│   │   └── Privacy.jsx        # Privacy policy
│   ├── utils/
│   │   ├── poster.jsx         # SVG poster generator fallback
│   │   └── cookies.js         # Cookie utilities
│   ├── api.js                 # API functions (TVmaze, OMDb, caching)
│   ├── blogData.js            # Blog articles content
│   ├── store.js               # State management (watchlist, history)
│   ├── index.css              # Global styles
│   └── main.jsx               # Entry point
├── prerender.mjs              # SEO prerender script
├── vercel.json                # Vercel SPA config
└── package.json
```

## API Integration

### TVmaze
- TV show search and details
- Season and episode data
- Cast information
- Show images

### OMDb
- Movie ratings and reviews
- Poster images (Amazon CDN)
- Episode data fallback

### Caching
- 24-hour localStorage cache for API responses
- Reduces API calls significantly
- Auto-clears stale OMDb search cache on load

## SEO & GEO Features

- Schema.org structured data (Movie, TVSeries, WebSite, Organization, FAQPage, BreadcrumbList, Article, VideoObject)
- Open Graph & Twitter Card meta tags
- Canonical URLs and hreflang tags
- Pre-rendered HTML for search engines
- Sitemap.xml with 50+ URLs
- Blog section with movie-related articles
- Internal linking via breadcrumbs and related content

## Deployment

Deployed on [Vercel](https://vercel.com) with:
- Automatic deployments from GitHub (main branch)
- Pre-rendering for SEO
- Vercel Analytics
- SPA routing via vercel.json

## Environment Variables

No environment variables required — APIs use public endpoints.

## License

This project is for educational purposes only. All movie and TV show data, images, and trademarks are property of their respective owners.

## Acknowledgments

- [TVmaze](https://www.tvmaze.com/) — TV show data and images
- [OMDb API](http://www.omdbapi.com/) — Movie data and posters
- [Vercel](https://vercel.com) — Hosting and analytics

## Contact

**Kiinshuk** — [kinshuksharma2024@gmail.com](mailto:kinshuksharma2024@gmail.com)

Project Link: [https://github.com/kiinshuk/kinshow](https://github.com/kiinshuk/kinshow)

---

If you found this project helpful, please give it a star on GitHub!
