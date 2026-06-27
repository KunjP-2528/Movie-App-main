'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { tmdbApi } from '@/api/tmdb';
import { MovieCard } from '@/components/movie/MovieCard';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { SearchBar } from './SearchBar';

export function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') ?? '';

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => tmdbApi.search(query),
    enabled: query.length > 0,
  });

  return (
    <div className="min-h-screen pt-24 px-4 md:px-8 max-w-7xl mx-auto pb-16">
      {/* Search bar */}
      <div className="max-w-xl mb-8">
        <SearchBar large />
      </div>

      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6"
      >
        {query ? (
          <>
            Results for{' '}
            <span className="text-[#E50914]">"{query}"</span>
            {data && (
              <span className="text-gray-500 text-base font-normal ml-2">
                ({data.total_results} found)
              </span>
            )}
          </>
        ) : (
          'Search Movies'
        )}
      </motion.h1>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : !query ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-5xl mb-4">🔍</p>
          <p>Type something to search for movies</p>
        </div>
      ) : data?.results?.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🎬</p>
          <p className="text-xl">No movies found for "{query}"</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        >
          {data?.results?.map(movie => <MovieCard key={movie.id} movie={movie} />)}
        </motion.div>
      )}
    </div>
  );
}
