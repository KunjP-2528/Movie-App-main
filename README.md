# PKFLIX — Netflix-Level Movie App

A full-stack movie discovery platform built with **Next.js 14**, **TypeScript**, **TanStack Query**, **NextAuth.js**, and **Hasura GraphQL**.

---

## Features

### Core
- **Home** — auto-rotating hero banner, 4 movie sliders (Trending, Popular, Top Rated, Coming Soon)
- **Movie Details** — backdrop, cast, trailer link, budget/revenue, genres
- **Search** — real-time suggestions dropdown (debounced), full results page
- **Voice Search** — browser Speech Recognition API (Chrome/Edge)

### Personalization
- **Favorites** — add/remove movies, persisted in Hasura DB
- **Watchlist** — same
- **Continue Watching** — tracks visited movies with progress bar
- **User Dashboard** — stats + all 3 lists in one place

### Smart Features
- **Infinite Scroll** — TanStack `useInfiniteQuery` loads pages automatically
- **Smart Recommendations** — same-genre picks on every movie detail page
- **Similar Movies** — TMDB `/similar` endpoint
- **TMDB Recommendations** — `/recommendations` endpoint

### Authentication
- **NextAuth.js** — Google OAuth + Email/Password credentials
- **Protected Routes** — `/dashboard` requires login (Next.js middleware)
- **Session-aware UI** — header shows user avatar + sign-out menu

### UX
- Dark/Light **theme toggle** (persisted in localStorage)
- **Skeleton loaders** with shimmer animation on every section
- **Framer Motion** — page transitions, hover effects, card animations
- **Glassmorphism** cards and modals
- Error boundary page + 404 page

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Auth | NextAuth.js v4 |
| Data Fetching | TanStack Query v5 |
| State | Redux Toolkit |
| Movie Data | TMDB REST API |
| Database | Hasura GraphQL (PostgreSQL) |
| Deployment | Vercel |

---

## Architecture

```
Browser
  │
  ├─ Next.js App Router (SSR + CSR)
  │    ├─ /                  → Home (trending, sliders)
  │    ├─ /movie/[id]        → Details + cast + recs
  │    ├─ /search            → Infinite results
  │    ├─ /dashboard         → Protected user collection
  │    └─ /login             → NextAuth sign-in
  │
  ├─ Next.js API Routes (your backend)
  │    ├─ /api/auth          → NextAuth handler
  │    ├─ /api/favorites     → GET / POST / DELETE
  │    ├─ /api/watchlist     → GET / POST / DELETE
  │    ├─ /api/ratings       → GET / POST / DELETE
  │    └─ /api/continue-watching → GET / POST / DELETE
  │
  └─ External Services
       ├─ TMDB API           → Movie data, images, search
       └─ Hasura GraphQL     → Favorites & Watchlist DB
```

---

## Setup

### 1. Install dependencies
```bash
cd movie-app-nextjs
npm install
```

### 2. Configure environment variables
Edit `.env.local`:

```env
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=run_openssl_rand_-base64_32

# Google OAuth (optional)
GOOGLE_CLIENT_ID=from_console.cloud.google.com
GOOGLE_CLIENT_SECRET=from_console.cloud.google.com

# Hasura
HASURA_URL=https://your-project.hasura.app/v1/graphql
HASURA_ADMIN_SECRET=your_admin_secret
```

### 3. Run Hasura migration (for user-based data)
Open Hasura console → SQL tab → paste contents of `src/db/migration.sql`

### 4. Start dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Demo login
```
Email:    demo@pkflix.com
Password: demo123
```

---

## Deployment (Vercel)

1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Add all `.env.local` variables in Vercel dashboard → Settings → Environment Variables
4. Deploy — Vercel auto-builds on every push

---

## API Documentation

### `GET /api/favorites`
Returns all favorites for the authenticated user.  
**Auth required** — returns 401 if not signed in.

### `POST /api/favorites`
```json
{ "id": 12345, "title": "Movie Name", "overview": "...", "poster_path": "/abc.jpg" }
```

### `DELETE /api/favorites?id=12345`
Removes movie from favorites.

Same pattern applies to `/api/watchlist` and `/api/ratings`.

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_TMDB_API_KEY` | ✅ | TMDB API key |
| `NEXTAUTH_URL` | ✅ | App URL (http://localhost:3000 in dev) |
| `NEXTAUTH_SECRET` | ✅ | Random string for JWT signing |
| `HASURA_URL` | ✅ | Hasura GraphQL endpoint |
| `HASURA_ADMIN_SECRET` | ✅ | Hasura admin secret (server-only) |
| `GOOGLE_CLIENT_ID` | Optional | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Optional | Google OAuth client secret |

---

Built by **KunjP** · Powered by TMDB
