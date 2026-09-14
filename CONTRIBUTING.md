# Contributing to Kinshow

Thanks for your interest in contributing! Here's how to get started.

## Getting Started

1. ⭐ Star the repo first — it helps others find the project
2. Fork the repository
3. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/kinshow.git
   cd kinshow
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the dev server:
   ```bash
   npm run dev
   ```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## Tech Stack

- React 18
- Vite 5
- React Router 6
- Plain CSS (no framework)

## Project Structure

```
src/
├── api.js          # API functions (TVmaze, OMDb)
├── store.js        # localStorage hooks
├── blogData.js     # Blog articles data
├── components/     # Reusable components
├── pages/          # Route pages
├── hooks/          # Custom hooks
├── utils/          # Utility functions
└── index.css       # Global styles
```

## How to Contribute

### Pick an Issue
- Check [open issues](https://github.com/kiinshuk/kinshow/issues) for bugs or features
- Issues tagged `good first issue` are great for newcomers

### Submit a PR
1. Create a branch: `git checkout -b fix/issue-123`
2. Make your changes
3. Run `npm run lint` to check for errors
4. Commit: `git commit -m "fix: description"`
5. Push: `git push origin fix/issue-123`
6. Open a Pull Request

### PR Guidelines
- Keep PRs focused on one change
- Reference the issue: `Fixes #123`
- Follow existing code style
- Test your changes locally

## Code Style

- Use functional components with hooks
- Prefer `const` over `let`
- Use CSS variables from `index.css`
- Keep components small and focused

## Questions?

Open a [discussion](https://github.com/kiinshuk/kinshow/discussions) or comment on an issue.
