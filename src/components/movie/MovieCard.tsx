'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { Movie, WatchlistItem, FavoriteItem } from '@/types';
import { getImageUrl, tmdbApi } from '@/api/tmdb';
import { VideoHoverCard } from './VideoHoverCard';
import { shimmerBlurUrl } from '@/utils';

type CardMovie = Movie | WatchlistItem | FavoriteItem;

function isDashboard(m: CardMovie): m is WatchlistItem | FavoriteItem {
  return 'movie_app_id' in m;
}

function isFullMovie(m: CardMovie): m is Movie {
  return 'vote_average' in m && 'backdrop_path' in m;
}

interface Props {
  movie: CardMovie;
  mode?: 'favorites' | 'watchlist';
}

const del = (url: string) => fetch(url, { method: 'DELETE' }).then(r => r.json());

export function MovieCard({ movie, mode }: Props) {
  const movieId = isDashboard(movie) ? movie.movie_app_id : movie.id;
  const cardRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>();
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();
  const [simpleHovered, setSimpleHovered] = useState(false);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: remove } = useMutation({
    mutationFn: () =>
      mode === 'watchlist'
        ? del(`/api/watchlist?id=${movieId}`)
        : del(`/api/favorites?id=${movieId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [mode === 'watchlist' ? 'watchlist' : 'favorites'] });
      enqueueSnackbar('Removed', { variant: 'info' });
    },
  });

  const scheduleClose = useCallback(() => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      clearTimeout(hoverTimer.current);
      setTriggerRect(null);
    }, 250);
  }, []);

  const cancelClose = useCallback(() => {
    clearTimeout(closeTimer.current);
  }, []);

  const handleMouseEnter = useCallback(() => {
    cancelClose();
    if (mode) { setSimpleHovered(true); return; }

    // Prefetch movie details immediately on hover
    qc.prefetchQuery({
      queryKey: ['movie', movieId],
      queryFn: () => tmdbApi.getMovieDetails(movieId),
      staleTime: 1000 * 60 * 5,
    });

    // Open video card after 700 ms hold
    if (isFullMovie(movie)) {
      hoverTimer.current = setTimeout(() => {
        if (cardRef.current) setTriggerRect(cardRef.current.getBoundingClientRect());
      }, 700);
    }
  }, [mode, movieId, movie, qc, cancelClose]);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(hoverTimer.current);
    setSimpleHovered(false);
    scheduleClose();
  }, [scheduleClose]);

  return (
    <>
      <Link href={`/movie/${movieId}`}>
        <motion.div
          ref={cardRef}
          className="relative rounded-xl overflow-hidden cursor-pointer bg-[#1a1a1a] select-none"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          whileHover={{ scale: mode ? 1.03 : 1.04 }}
          transition={{ duration: 0.18 }}
          style={{ aspectRatio: '2/3' }}
        >
          {/* Poster */}
          {movie.poster_path ? (
            <Image
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 150px, 185px"
              placeholder="blur"
              blurDataURL={shimmerBlurUrl()}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#2d2d2d] to-[#1a1a1a] flex items-center justify-center text-4xl">
              🎬
            </div>
          )}

          {/* Rating badge */}
          {'vote_average' in movie && (movie as Movie).vote_average > 0 && (
            <div className="absolute top-2 left-2 glass rounded px-1.5 py-0.5 text-[10px] font-bold">
              ⭐ {(movie as Movie).vote_average.toFixed(1)}
            </div>
          )}

          {/* Dashboard mode: simple remove overlay */}
          <AnimatePresence>
            {simpleHovered && mode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/10 flex flex-col justify-end p-3"
              >
                <p className="text-white text-xs font-bold mb-2 line-clamp-2 leading-tight">
                  {movie.title}
                </p>
                <button
                  onClick={e => { e.preventDefault(); e.stopPropagation(); remove(); }}
                  className="w-full py-1.5 text-xs bg-red-600/80 hover:bg-red-600 rounded-lg text-white transition-colors font-medium"
                >
                  Remove
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Link>

      {/* Video hover card (portal) — full Movie objects, non-dashboard only */}
      {isFullMovie(movie) && !mode && (
        <VideoHoverCard
          open={!!triggerRect}
          movie={movie}
          triggerRect={triggerRect}
          onMouseEnter={cancelClose}
          onClose={scheduleClose}
        />
      )}
    </>
  );
}
