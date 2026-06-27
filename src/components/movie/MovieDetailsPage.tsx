'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { tmdbApi, getImageUrl } from '@/api/tmdb';
import { MovieSlider } from './MovieSlider';
import { TrailerModal } from './TrailerModal';
import { SkeletonSlider } from '@/components/ui/SkeletonSlider';
import { formatRuntime, formatDate, formatCurrency, getRatingColor } from '@/utils';
import { useContinueWatching } from '@/hooks/useContinueWatching';

const post = (url: string, body: unknown) =>
  fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json());

export function MovieDetailsPage({ movieId }: { movieId: number }) {
  const { enqueueSnackbar } = useSnackbar();
  const qc = useQueryClient();
  const [trailerOpen, setTrailerOpen] = useState(false);

  const { data: movie, isLoading } = useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => tmdbApi.getMovieDetails(movieId),
  });

  const { data: similar, isLoading: simLoad } = useQuery({
    queryKey: ['similar', movieId],
    queryFn: () => tmdbApi.getSimilar(movieId),
  });

  const { data: recs, isLoading: recLoad } = useQuery({
    queryKey: ['recs', movieId],
    queryFn: () => tmdbApi.getRecommendations(movieId),
  });

  // Smart recommendations: movies of the same primary genre
  const primaryGenreId = movie?.genres?.[0]?.id;
  const { data: genreMovies } = useQuery({
    queryKey: ['genre', primaryGenreId],
    queryFn: () => tmdbApi.getByGenre(primaryGenreId!),
    enabled: !!primaryGenreId,
  });

  // Track this movie in "Continue Watching"
  useContinueWatching(movieId, movie?.title ?? '', movie?.poster_path ?? null);

  const { mutate: addFav } = useMutation({
    mutationFn: () => post('/api/favorites', { id: movie!.id, title: movie!.title, overview: movie!.overview, poster_path: movie!.poster_path }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['favorites'] }); enqueueSnackbar('Added to Favorites!', { variant: 'success' }); },
    onError: () => enqueueSnackbar('Sign in to save favorites', { variant: 'error' }),
  });

  const { mutate: addWL } = useMutation({
    mutationFn: () => post('/api/watchlist', { id: movie!.id, title: movie!.title, overview: movie!.overview, poster_path: movie!.poster_path }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['watchlist'] }); enqueueSnackbar('Added to Watchlist!', { variant: 'success' }); },
    onError: () => enqueueSnackbar('Sign in to save watchlist', { variant: 'error' }),
  });

  const trailer = movie?.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16">
        <div className="h-[55vh] bg-[#1a1a1a] animate-shimmer bg-gradient-to-r from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a] bg-[length:200%_100%]" />
        <div className="max-w-7xl mx-auto px-6 mt-8 space-y-4">
          {[64, 256, 192].map(w => (
            <div key={w} className={`h-5 bg-[#2d2d2d] rounded animate-pulse`} style={{ width: w }} />
          ))}
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="pt-32 text-center text-gray-400">
        <p className="text-5xl mb-4">😕</p>
        <p>Movie not found.</p>
        <Link href="/" className="text-[#E50914] mt-4 inline-block hover:underline">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Backdrop */}
      <div className="relative h-[55vh] md:h-[65vh]">
        {movie.backdrop_path ? (
          <Image
            src={getImageUrl(movie.backdrop_path, 'original')}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-[#1a1a1a]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/70 via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden md:block flex-shrink-0 w-56 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
          >
            {movie.poster_path ? (
              <Image
                src={getImageUrl(movie.poster_path, 'w500')}
                alt={movie.title}
                width={224}
                height={336}
                className="object-cover w-full"
              />
            ) : (
              <div className="bg-[#2d2d2d] h-[336px] flex items-center justify-center text-5xl">🎬</div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 pt-4"
          >
            <h1 className="text-3xl md:text-5xl font-extrabold mb-2 leading-tight">{movie.title}</h1>
            {movie.tagline && <p className="text-gray-400 italic mb-3 text-sm">"{movie.tagline}"</p>}

            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-300">
              <span className={`text-xl font-bold ${getRatingColor(movie.vote_average)}`}>
                ⭐ {movie.vote_average.toFixed(1)}
              </span>
              <span>{formatDate(movie.release_date)}</span>
              {movie.runtime > 0 && <span>{formatRuntime(movie.runtime)}</span>}
              <span className="border border-gray-600 px-1.5 py-0.5 rounded text-xs uppercase">{movie.original_language}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              {movie.genres?.map(g => (
                <span key={g.id} className="px-3 py-1 glass rounded-full text-xs text-gray-200">{g.name}</span>
              ))}
            </div>

            <p className="text-gray-300 mb-6 max-w-2xl leading-relaxed text-sm md:text-base">{movie.overview}</p>

            <div className="flex flex-wrap gap-3 mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTrailerOpen(true)}
                className={`px-6 py-2.5 font-bold rounded-xl transition-colors ${
                  trailer
                    ? 'bg-[#E50914] hover:bg-[#c40812] text-white'
                    : 'glass text-gray-500 cursor-default'
                }`}
              >
                ▶ {trailer ? 'Watch Trailer' : 'No Trailer'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => addFav()}
                className="px-6 py-2.5 glass hover:bg-yellow-500/20 text-white font-semibold rounded-xl transition-colors"
              >★ Favorite</motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => addWL()}
                className="px-6 py-2.5 glass hover:bg-white/10 text-white font-semibold rounded-xl transition-colors"
              >+ Watchlist</motion.button>
            </div>

            {(movie.budget > 0 || movie.revenue > 0) && (
              <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                {movie.budget > 0 && <p><span className="text-gray-500">Budget: </span><span className="text-white">{formatCurrency(movie.budget)}</span></p>}
                {movie.revenue > 0 && <p><span className="text-gray-500">Revenue: </span><span className="text-white">{formatCurrency(movie.revenue)}</span></p>}
              </div>
            )}
          </motion.div>
        </div>

        {/* Cast */}
        {(movie.credits?.cast?.length ?? 0) > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-5">Cast</h2>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
              {movie.credits!.cast.slice(0, 14).map(actor => (
                <div key={actor.id} className="flex-shrink-0 w-20 text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-2 bg-[#2d2d2d] ring-1 ring-white/10">
                    {actor.profile_path ? (
                      <Image src={getImageUrl(actor.profile_path, 'w185')} alt={actor.name} width={80} height={80} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                    )}
                  </div>
                  <p className="text-[11px] font-medium text-white line-clamp-1">{actor.name}</p>
                  <p className="text-[10px] text-gray-500 line-clamp-1">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Movie sections */}
        <div className="mt-12 space-y-10 pb-16">
          {simLoad ? <SkeletonSlider title="Similar Movies" /> : (
            (similar?.results?.length ?? 0) > 0 && <MovieSlider title="Similar Movies" movies={similar!.results} />
          )}
          {recLoad ? <SkeletonSlider title="Recommended For You" /> : (
            (recs?.results?.length ?? 0) > 0 && <MovieSlider title="Recommended For You" movies={recs!.results} />
          )}
          {/* Smart: same-genre recommendations */}
          {primaryGenreId && (genreMovies?.results?.length ?? 0) > 0 && (
            <MovieSlider
              title={`More ${movie.genres?.[0]?.name ?? 'Genre'} Movies`}
              movies={genreMovies!.results.filter(m => m.id !== movieId)}
              badge="Smart Pick"
            />
          )}
        </div>
      </div>

      {/* Trailer modal — rendered outside the scroll container so z-index works correctly */}
      <TrailerModal
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        videoKey={trailer?.key ?? null}
        title={movie.title}
      />
    </div>
  );
}
