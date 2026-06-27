'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { tmdbApi, getImageUrl } from '@/api/tmdb';
import { Movie } from '@/types';

const GENRE_MAP: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
  53: 'Thriller', 10752: 'War', 37: 'Western',
};

interface Props {
  open: boolean;
  movie: Movie;
  triggerRect: DOMRect | null;
  onMouseEnter: () => void;
  onClose: () => void;
}

export function VideoHoverCard({ open, movie, triggerRect, onMouseEnter, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // always start muted
  const { enqueueSnackbar } = useSnackbar();
  const qc = useQueryClient();

  useEffect(() => { setMounted(true); }, []);

  // Reset state every time the card opens
  useEffect(() => {
    if (open) {
      setVideoReady(false);
      setIsMuted(true);
    }
  }, [open]);

  const { data: videos } = useQuery({
    queryKey: ['videos', movie.id],
    queryFn: () => tmdbApi.getVideos(movie.id),
    enabled: open,
    staleTime: Infinity,
  });

  const trailerKey =
    videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')?.key ??
    videos?.results?.find(v => v.site === 'YouTube')?.key;

  // Toggling mute changes the iframe key → forces a remount with the new mute param
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(prev => !prev);
    setVideoReady(false); // show backdrop while iframe reloads
  };

  const { mutate: addFav } = useMutation({
    mutationFn: () =>
      fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: movie.id, title: movie.title, overview: movie.overview, poster_path: movie.poster_path }),
      }).then(r => r.json()),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['favorites'] }); enqueueSnackbar('Added to Favorites!', { variant: 'success' }); onClose(); },
    onError: () => enqueueSnackbar('Sign in to save', { variant: 'error' }),
  });

  const { mutate: addWL } = useMutation({
    mutationFn: () =>
      fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: movie.id, title: movie.title, overview: movie.overview, poster_path: movie.poster_path }),
      }).then(r => r.json()),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['watchlist'] }); enqueueSnackbar('Added to Watchlist!', { variant: 'success' }); onClose(); },
    onError: () => enqueueSnackbar('Sign in to save', { variant: 'error' }),
  });

  if (!mounted || !triggerRect) return null;

  // ── Position calculation ─────────────────────────────────────
  const CARD_W = Math.max(triggerRect.width * 1.65, 290);
  const WIN_W = window.innerWidth;
  const WIN_H = window.innerHeight;

  let left = triggerRect.left + triggerRect.width / 2 - CARD_W / 2;
  left = Math.max(8, Math.min(left, WIN_W - CARD_W - 8));

  const VIDEO_H = CARD_W * (9 / 16);
  const TOTAL_H = VIDEO_H + 165;
  const spaceBelow = WIN_H - triggerRect.bottom;
  const top =
    spaceBelow >= TOTAL_H
      ? triggerRect.bottom - 12
      : triggerRect.top - TOTAL_H + 12;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key={`hover-${movie.id}`}
          initial={{ opacity: 0, scale: 0.88, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 10 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          style={{ position: 'fixed', top, left, width: CARD_W, zIndex: 9999 }}
          className="rounded-2xl overflow-hidden bg-[#1f1f1f] shadow-[0_30px_70px_rgba(0,0,0,0.85)] ring-1 ring-white/10"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onClose}
        >
          {/* ── Video area ───────────────────────────────── */}
          <div className="relative" style={{ paddingTop: '56.25%' }}>
            {/* Backdrop — visible until video is ready */}
            <Image
              src={getImageUrl(movie.backdrop_path ?? movie.poster_path, 'w780')}
              alt={movie.title}
              fill
              sizes={`${Math.round(CARD_W)}px`}
              className={`object-cover transition-opacity duration-700 ${videoReady ? 'opacity-0' : 'opacity-100'}`}
            />

            {/* YouTube iframe — key changes on mute toggle to force reload */}
            {trailerKey && (
              <iframe
                key={`yt-${trailerKey}-${isMuted}`}
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${trailerKey}&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1&playsinline=1`}
                allow="autoplay; encrypted-media"
                title={`${movie.title} trailer`}
                onLoad={() => setTimeout(() => setVideoReady(true), 1200)}
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#1f1f1f] via-transparent to-transparent pointer-events-none" />

            {/* Mute toggle button — only shown when video is playing */}
            {trailerKey && videoReady && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMute}
                className="absolute bottom-2 right-2 glass px-2 py-1 rounded-lg text-xs text-white flex items-center gap-1 cursor-pointer hover:bg-white/20 transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                <span className="text-sm">{isMuted ? '🔇' : '🔊'}</span>
                <span className="text-[9px] font-medium">{isMuted ? 'Muted' : 'Sound on'}</span>
              </motion.button>
            )}
          </div>

          {/* ── Info panel ───────────────────────────────── */}
          <div className="p-3">
            <div className="flex items-start gap-2 mb-1">
              <p className="font-bold text-sm text-white line-clamp-1 flex-1">{movie.title}</p>
              {movie.vote_average > 0 && (
                <span className="text-xs font-bold text-green-400 flex-shrink-0">
                  {movie.vote_average.toFixed(1)} ⭐
                </span>
              )}
            </div>

            <p className="text-gray-500 text-[10px] mb-2">
              {movie.release_date?.slice(0, 4)}
              {movie.original_language ? ` · ${movie.original_language.toUpperCase()}` : ''}
            </p>

            <p className="text-gray-400 text-[10px] leading-relaxed line-clamp-2 mb-3">
              {movie.overview}
            </p>

            {(movie.genre_ids?.length ?? 0) > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {movie.genre_ids?.slice(0, 3).map(id => (
                  <span key={id} className="text-[9px] px-1.5 py-0.5 glass rounded-full text-gray-300">
                    {GENRE_MAP[id] ?? 'Genre'}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Link href={`/movie/${movie.id}`} className="flex-1" onClick={onClose}>
                <button className="w-full py-1.5 bg-white hover:bg-gray-100 text-black text-xs font-bold rounded-lg transition-colors">
                  ▶ More Info
                </button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
                onClick={e => { e.stopPropagation(); addFav(); }}
                className="px-2.5 py-1.5 glass hover:bg-yellow-500/25 rounded-lg text-sm transition-colors"
                title="Add to Favorites"
              >★</motion.button>
              <motion.button
                whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
                onClick={e => { e.stopPropagation(); addWL(); }}
                className="px-2.5 py-1.5 glass hover:bg-blue-500/20 rounded-lg text-sm transition-colors"
                title="Add to Watchlist"
              >＋</motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
