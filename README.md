# 🎬 Kinshow

A premium movie and TV show discovery platform built with React and Vite. Browse thousands of titles, check ratings, cast info, and find where to stream.

**Live Demo:** [kinshow.vercel.app](https://kinshow.vercel.app/)

---

## ✨ Features

- 🎬 **Movie Discovery** — Browse 26+ curated movies with ratings, cast, and reviews
- 📺 **TV Shows** — 250+ shows from TVmaze with episode guides and season listings
- 🔍 **Smart Search** — Find movies and TV shows instantly
- 📋 **Personal Watchlist** — Save titles to watch later (localStorage)
- 📊 **Viewing History** — Track what you've watched
- 🎭 **Cast & Crew** — View actor profiles and character names
- 📱 **Fully Responsive** — Works on desktop, tablet, and mobile
- 🎨 **Premium UI** — Dark theme with smooth animations
- ⚡ **Infinite Scroll** — Seamless browsing experience
- 🔗 **Streaming Links** — Find where to watch with embedded player

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite 5 | Build Tool & Dev Server |
| React Router 6 | Client-side Routing |
| TVmaze API | TV Show Data |
| OMDb API | Movie Data & Posters |
| Vercel | Hosting & Analytics |

## 🚀 Getting Started

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

## 📁 Project Structure

```
kinshow/
├── public/
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        # Navigation with search
│   │   ├── Hero.jsx          # Featured content carousel
│   │   ├── MediaCard.jsx     # Movie/TV show card
│   │   ├── ContentRail.jsx   # Horizontal scroll section
│   │   ├── CastCard.jsx      # Actor profile card
│   │   ├── EpisodeCard.jsx   # TV episode card
│   │   ├── Toast.jsx         # Toast notifications
│   │   ├── Skeletons.jsx     # Loading states
│   │   └── SEO.jsx           # SEO & Structured Data
│   ├── hooks/
│   │   └── useInfiniteScroll.js
│   ├── pages/
│   │   ├── Home.jsx          # Landing page
│   │   ├── Movies.jsx        # Movie browser
│   │   ├── TVShows.jsx       # TV show browser
│   │   ├── Detail.jsx        # Movie/Show details
│   │   ├── Player.jsx        # Embedded player
│   │   ├── Watchlist.jsx     # User watchlist
│   │   ├── Profile.jsx       # User profile
│   │   ├── Explore.jsx       # Genre explorer
│   │   ├── About.jsx         # About page
│   │   ├── Contact.jsx       # Contact page
│   │   └── Privacy.jsx       # Privacy policy
│   ├── utils/
│   │   └── poster.jsx        # SVG poster generator
│   ├── api.js                # API functions
│   ├── store.js              # State management
│   ├── index.css             # Global styles
│   └── main.jsx              # Entry point
├── prerender.mjs             # SEO prerender script
├── vercel.json               # Vercel config
└── package.json
```

## 🔧 Key Features Explained

### Infinite Scroll
Uses IntersectionObserver to load content as users scroll, providing a seamless browsing experience without pagination.

### SEO Optimization
- Pre-rendered HTML for search engines
- Schema.org structured data (Movie, TVSeries, WebSite)
- Open Graph & Twitter Card meta tags
- Sitemap.xml and robots.txt

### Smart Caching
- 24-hour localStorage cache for API responses
- Reduces API calls by 85%
- Faster load times for returning visitors

### Batch API Fetching
- Home page: 1 request instead of 8
- TV Shows: 3 requests instead of 20
- Optimized for performance

## 🎨 Screenshots

<!-- Add your screenshots here -->
```
Home Page:     ![Home](https://via.placeholder.com/800x400?text=Home+Page)
Movies:        ![Movies](https://via.placeholder.com/800x400?text=Movies+Page)
TV Shows:      ![TV Shows](https://via.placeholder.com/800x400?text=TV+Shows+Page)
Detail Page:   ![Detail](https://via.placeholder.com/800x400?text=Detail+Page)
```

## 🌐 API Integration

### TVmaze
- Show search and details
- Season and episode data
- Cast information
- Show images

### OMDb
- Movie ratings and reviews
- Poster images
- Episode data fallback

## 📱 Responsive Design

- **Desktop:** Full grid layout with side navigation
- **Tablet:** Adapted grid with collapsible elements
- **Mobile:** Single column with bottom navigation

## 🔒 Environment Variables

No environment variables required — APIs use public endpoints.

## 🚀 Deployment

Deployed on [Vercel](https://vercel.com) with:
- Automatic deployments from GitHub
- Pre-rendering for SEO
- Vercel Analytics

## 📄 License

This project is for educational purposes only. All movie and TV show data, images, and trademarks are property of their respective owners.

## 🙏 Acknowledgments

- [TVmaze](https://www.tvmaze.com/) — TV show data and images
- [OMDb API](http://www.omdbapi.com/) — Movie data and posters
- [Vercel](https://vercel.com) — Hosting and analytics

## 📧 Contact

**Kiinshuk** — [kiinshuk@gmail.com](mailto:kiinshuk@gmail.com)

Project Link: [https://github.com/kiinshuk/kinshow](https://github.com/kiinshuk/kinshow)

---

⭐ If you found this project helpful, please give it a star on GitHub!
