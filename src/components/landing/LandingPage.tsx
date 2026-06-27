'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi, getImageUrl } from '@/api/tmdb';
import type { Movie } from '@/types';

/* ------------------------------------------------------------------ */
/*  Feature data (SVG icons — no emoji, per design guidelines)         */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    title: 'Thousands of titles',
    desc: 'Browse trending, top-rated, and upcoming movies updated daily from a live catalog.',
    icon: (
      <path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm3 0v18M17 3v18M3 8h4M3 16h4M17 8h4M17 16h4" />
    ),
  },
  {
    title: 'Your personal list',
    desc: 'Save favorites, build a watchlist, and rate what you watch — synced to your account.',
    icon: <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />,
  },
  {
    title: 'Smart & voice search',
    desc: 'Find any movie instantly with fast search and hands-free voice input.',
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </>
    ),
  },
  {
    title: 'Watch anywhere',
    desc: 'A responsive, fast experience that works beautifully on desktop, tablet, and mobile.',
    icon: (
      <>
        <rect x="2" y="4" width="20" height="13" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </>
    ),
  },
];

const STATS = [
  { value: '10,000+', label: 'Movies & growing' },
  { value: 'Daily', label: 'Fresh updates' },
  { value: 'Free', label: 'To explore' },
];

/* ------------------------------------------------------------------ */
/*  Reusable icon-only nav/link styles share these focus rings         */
/* ------------------------------------------------------------------ */

export function LandingPage() {
  // Public TMDB data powers the cinematic backdrop + preview marquee.
  const { data: trending } = useQuery({
    queryKey: ['landing-trending'],
    queryFn: tmdbApi.getTrending,
  });
  const { data: popular } = useQuery({
    queryKey: ['landing-popular'],
    queryFn: () => tmdbApi.getPopular(),
  });

  const posters = useMemo(() => {
    const all = [...(trending?.results ?? []), ...(popular?.results ?? [])];
    return all.map(m => m.poster_path).filter((p): p is string => Boolean(p));
  }, [trending, popular]);

  // 5 vertical columns for the backdrop collage.
  const columns = useMemo(() => {
    const cols: string[][] = [[], [], [], [], []];
    posters.forEach((p, i) => cols[i % 5].push(p));
    return cols;
  }, [posters]);

  const previewMovies: Movie[] = (trending?.results ?? []).slice(0, 12);

  return (
    <div className="bg-black text-[#F8FAFC] min-h-screen overflow-x-hidden">
      {/* ============================ NAV ============================ */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-2xl font-extrabold tracking-tight select-none">
            PK<span className="text-[#E50914]">FLIX</span>
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-1.5 text-sm font-medium text-gray-200 rounded-lg hover:bg-white/10 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              Sign In
            </Link>
            <Link
              href="/login?mode=signup"
              className="px-4 py-1.5 text-sm font-bold bg-[#E50914] hover:bg-[#c40812] text-white rounded-lg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E50914]/70"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ============================ HERO ============================ */}
      <section className="relative min-h-[100svh] flex items-center justify-center px-4">
        {/* Cinematic poster backdrop */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute inset-0 flex gap-2 sm:gap-3 justify-center opacity-40 blur-[1px] scale-110">
            {columns.map((col, ci) => (
              <div
                key={ci}
                className={`flex flex-col gap-2 sm:gap-3 w-[28%] sm:w-[20%] md:w-[16%] ${
                  ci % 2 === 0 ? 'animate-scroll-up' : 'animate-scroll-down'
                }`}
              >
                {/* Duplicate the column so the vertical loop is seamless */}
                {[...col, ...col].map((path, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={getImageUrl(path, 'w342')}
                    alt=""
                    loading="lazy"
                    className="w-full aspect-[2/3] object-cover rounded-lg"
                  />
                ))}
              </div>
            ))}
          </div>
          {/* Dark gradient overlays for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-black/90" />
        </div>

        {/* Hero content */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 max-w-3xl text-center"
        >
          <span className="inline-block mb-5 px-3 py-1 text-xs font-semibold tracking-wide uppercase rounded-full border border-white/15 bg-white/5 text-gray-300">
            Your movie universe
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
            Unlimited movies,
            <br />
            <span className="gradient-text">all in one place.</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">
            Discover what to watch next. Track favorites, build your watchlist,
            and explore trending films — beautifully, on any device.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login?mode=signup"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#E50914] hover:bg-[#c40812] text-white font-bold rounded-xl transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E50914]/70 shadow-[0_0_30px_-8px_rgba(229,9,20,0.7)]"
            >
              Get Started — it&apos;s free
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 backdrop-blur-sm"
            >
              I already have an account
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            Try the demo instantly: demo@pkflix.com / demo123
          </p>
        </motion.div>

        {/* Scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10" aria-hidden="true">
          <svg className="w-6 h-6 text-gray-500 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </section>

      {/* ========================== STATS ========================== */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-3 gap-4">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl sm:text-4xl font-extrabold text-white">{s.value}</div>
              <div className="mt-1 text-xs sm:text-sm text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================= FEATURES ========================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Everything you need to find your next favorite
          </h2>
          <p className="mt-4 text-gray-400">
            Built for movie lovers — fast, focused, and personal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group rounded-2xl p-6 bg-white/[0.03] border border-white/10 hover:border-[#E50914]/40 hover:bg-white/[0.05] transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-[#E50914]/10 flex items-center justify-center mb-4 text-[#E50914]">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  {f.icon}
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-1.5">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===================== TRENDING PREVIEW ===================== */}
      {previewMovies.length > 0 && (
        <section className="py-12 border-y border-white/10 bg-gradient-to-b from-transparent via-[#0F0F23]/40 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold">
              Trending right now
            </h2>
            <span className="text-xs text-gray-500">Sign in to explore them all</span>
          </div>
          <div className="relative overflow-hidden">
            {/* edge fades */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
            <div className="flex gap-4 w-max animate-marquee">
              {[...previewMovies, ...previewMovies].map((m, i) => (
                <div key={i} className="w-32 sm:w-40 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getImageUrl(m.poster_path, 'w342')}
                    alt={m.title}
                    loading="lazy"
                    className="w-full aspect-[2/3] object-cover rounded-xl border border-white/10"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================== CTA BAND ========================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1E1B4B] via-[#0F0F23] to-black px-6 py-16 sm:py-20 text-center">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#E50914]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Ready to start watching?
            </h2>
            <p className="mt-4 text-gray-300">
              Create your free account and build your personal movie collection in seconds.
            </p>
            <Link
              href="/login?mode=signup"
              className="inline-block mt-8 px-9 py-3.5 bg-[#E50914] hover:bg-[#c40812] text-white font-bold rounded-xl transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E50914]/70 shadow-[0_0_30px_-8px_rgba(229,9,20,0.7)]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* ========================== FOOTER ========================== */}
      <footer className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-lg font-extrabold tracking-tight">
            PK<span className="text-[#E50914]">FLIX</span>
          </span>
          <p className="text-xs text-gray-500 text-center">
            Movie data provided by TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <Link href="/login" className="hover:text-white transition-colors cursor-pointer">Sign In</Link>
            <Link href="/login?mode=signup" className="hover:text-white transition-colors cursor-pointer">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
