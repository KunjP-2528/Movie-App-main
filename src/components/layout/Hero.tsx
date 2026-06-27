'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { tmdbApi, getImageUrl } from '@/api/tmdb';
import { Movie } from '@/types';

export function HeroSection() {
  const [index, setIndex] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const qc = useQueryClient();

  const { data } = useQuery({ queryKey: ['trending'], queryFn: tmdbApi.getTrending });
  const movies: Movie[] = data?.results?.slice(0, 6) ?? [];
  const current = movies[index];

  useEffect(() => {
    if (!movies.length) return;
    const t = setInterval(() => setIndex(i => (i + 1) % movies.length), 7000);
    return () => clearInterval(t);
  }, [movies.length]);

  const { mutate: addToList } = useMutation({
    mutationFn: (movie: Movie) =>
      fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: movie.id, title: movie.title, overview: movie.overview, poster_path: movie.poster_path }),
      }).then(r => r.json()),
    onSuccess: (_, movie) => {
      qc.invalidateQueries({ queryKey: ['watchlist'] });
      enqueueSnackbar(`"${movie.title}" added to Watchlist!`, { variant: 'success' });
    },
    onError: () => enqueueSnackbar('Sign in to add to your list', { variant: 'error' }),
  });

  if (!current) {
    return <div className="h-[85vh] bg-gradient-to-b from-[#1a1a1a] to-[#141414] animate-pulse" />;
  }

  return (
    <div className="relative h-[85vh] overflow-hidden">
      {movies.map((m, i) => (
        <motion.div
          key={m.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          {m.backdrop_path && (
            <Image
              src={getImageUrl(m.backdrop_path, 'original')}
              alt={m.title}
              fill
              className="object-cover"
              priority={i === 0}
            />
          )}
        </motion.div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/20" />

      <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-[#E50914] rounded-full mb-4 uppercase tracking-wider">
              Trending Today
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-2xl">
              {current.title}
            </h1>
            <p className="text-gray-300 text-sm md:text-base mb-8 line-clamp-3 max-w-xl leading-relaxed">
              {current.overview}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/movie/${current.id}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-[#E50914] hover:bg-[#c40812] text-white font-bold rounded-lg transition-colors shadow-lg"
                >
                  ▶ More Info
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addToList(current)}
                className="px-8 py-3 glass hover:bg-white/15 text-white font-semibold rounded-lg transition-colors"
              >
                + My List
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-24 left-8 md:left-16 flex gap-2">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-[#E50914]' : 'w-3 bg-white/30'}`}
          />
        ))}
      </div>

      {current.vote_average > 0 && (
        <div className="absolute top-24 right-8 glass px-3 py-2 rounded-xl text-sm font-bold">
          ⭐ {current.vote_average.toFixed(1)}
        </div>
      )}
    </div>
  );
}
