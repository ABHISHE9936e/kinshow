# 🎬 Kinshow — Cinema Discovery Platform

A free, open-source movie and TV show discovery platform. Browse 80+ curated films, 250+ TV shows, check ratings, cast info, episode guides, and find where to stream — all in one place.

**Live:** [kinshow.vercel.app](https://kinshow.vercel.app/)  
**Blog:** [kinshow.vercel.app/blog](https://kinshow.vercel.app/blog)

---

## ✨ Features

### Discovery
- **80+ Curated Movies** — Top-rated films with ratings, cast, and streaming links
- **250+ TV Shows** — Full season and episode guides from TVmaze
- **Smart Search** — Instant search across movies and TV shows
- **Genre Explorer** — Browse by Action, Comedy, Drama, Horror, Sci-Fi, Thriller, and more

### Personalization
- **Watchlist** — Save titles to watch later (localStorage, no account needed)
- **Viewing History** — Track what you've watched
- **Recently Viewed** — Quick access to recently browsed titles

### Player
- **Multi-Server Streaming** — 4 servers (VidSrc, VidCore, Peachify, VidFast)
- **Episode Navigation** — Previous/next episode buttons for TV shows
- **Server Switching** — Change servers mid-session

### SEO & Performance
- **Schema.org** — Movie, TVSeries, WebSite, Organization, FAQPage, BreadcrumbList, Article, VideoObject
- **Open Graph & Twitter Cards** — Rich social previews
- **Pre-rendered HTML** — Search engine optimized
- **24hr Cache** — Reduced API calls, faster load times

### UX
- **Fully Responsive** — Desktop, tablet, and mobile
- **Dark Theme** — Premium UI with smooth animations
- **Cookie Consent** — GDPR compliant
- **Blog** — Movie guides, recommendations, and lists

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite 5 | Build Tool & Dev Server |
| React Router 6 | Client-side Routing |
| React Helmet Async | SEO Meta Tags |
| TVmaze API | TV Show Data & Images |
| OMDb API | Movie Data & Posters |
| Vercel | Hosting, Analytics & CI/CD |

---

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

### Prerender for SEO

```bash
npm run build && node prerender.mjs
```

---

## 📁 Project Structure

```
kinshow/
├── public/
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── Navbar.jsx         # Navigation with search
│   │   ├── Hero.jsx           # Featured content carousel
│   │   ├── MediaCard.jsx      # Movie/TV show card
│   │   ├── ContentRail.jsx    # Horizontal scroll section
│   │   ├── CastCard.jsx       # Actor profile card
│   │   ├── CookieConsent.jsx  # GDPR cookie consent
│   │   ├── RecentlyViewed.jsx # Recently viewed section
│   │   ├── Toast.jsx          # Toast notifications
│   │   ├── Skeletons.jsx      # Loading states
│   │   └── SEO.jsx            # SEO, Schema.org, breadcrumbs
│   ├── pages/
│   │   ├── Home.jsx           # Landing page with hero + rails
│   │   ├── Movies.jsx         # Movie browser with tabs
│   │   ├── TVShows.jsx        # TV show browser with tabs
│   │   ├── Detail.jsx         # Movie/TV details + episodes
│   │   ├── Player.jsx         # Multi-server video player
│   │   ├── Watchlist.jsx      # User watchlist
│   │   ├── Profile.jsx        # User profile + history
│   │   ├── Explore.jsx        # Genre explorer
│   │   ├── Blog.jsx           # Blog listing page
│   │   ├── BlogPost.jsx       # Blog article page
│   │   ├── About.jsx          # About page with FAQ
│   │   ├── Contact.jsx        # Contact page with FAQ
│   │   └── Privacy.jsx        # Privacy policy
│   ├── utils/
│   │   ├── poster.jsx         # SVG poster generator
│   │   └── cookies.js         # Cookie utilities
│   ├── api.js                 # API functions + caching
│   ├── blogData.js            # Blog articles
│   ├── store.js               # State management
│   ├── index.css              # Global styles
│   └── main.jsx               # Entry point
├── prerender.mjs              # SEO prerender script
├── vercel.json                # Vercel SPA config
├── CONTRIBUTING.md            # Contribution guidelines
├── LICENSE                    # MIT License
└── package.json
```

---

## 🤝 Contributing

We love contributions! Whether it's fixing a bug, adding a feature, or improving docs — all help is welcome.

**Quick start:**
1. Fork the repo
2. Create a branch: `git checkout -b fix/my-bug`
3. Make changes and run `npm run lint`
4. Commit: `git commit -m "fix: description"`
5. Push and open a PR

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

**Open issues:** Check [good first issues](https://github.com/kiinshuk/kinshow/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) to get started.

---

## 📝 Environment Variables

No environment variables required — APIs use public endpoints.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- [TVmaze](https://www.tvmaze.com/) — TV show data and images
- [OMDb API](http://www.omdbapi.com/) — Movie data and posters
- [Vercel](https://vercel.com) — Hosting and analytics

---

## 📬 Contact

**Kiinshuk** — [kinshuksharma2024@gmail.com](mailto:kinshuksharma2024@gmail.com)

Project Link: [https://github.com/kiinshuk/kinshow](https://github.com/kiinshuk/kinshow)

---

If you found this project helpful, please give it a ⭐ on GitHub!
