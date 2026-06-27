'use client';

import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { tmdbApi } from '@/api/tmdb';
import { MovieCard } from './MovieCard';
import { SkeletonCard } from '@/components/ui/SkeletonCard';

type Endpoint = 'popular' | 'topRated' | 'upcoming';

const API: Record<Endpoint, (page: number) => ReturnType<typeof tmdbApi.getPopular>> = {
  popular: tmdbApi.getPopular,
  topRated: tmdbApi.getTopRated,
  upcoming: tmdbApi.getUpcoming,
};

export function InfiniteMovieGrid({ endpoint, title }: { endpoint: Endpoint; title: string }) {
  const { ref, inView } = useInView({ threshold: 0.1 });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: [endpoint, 'infinite'],
    queryFn: ({ pageParam }) => API[endpoint](pageParam as number),
    initialPageParam: 1,
    getNextPageParam: last => (last.page < Math.min(last.total_pages, 10) ? last.page + 1 : undefined),
  });

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  const movies = data?.pages.flatMap(p => p.results) ?? [];

  return (
    <div className="min-h-screen pt-24 px-4 md:px-8 max-w-7xl mx-auto pb-16">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-8">
        {title}
      </motion.h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {isLoading
          ? Array.from({ length: 18 }).map((_, i) => <SkeletonCard key={i} />)
          : movies.map((m, i) => (
              <motion.div
                key={`${m.id}-${i}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (i % 18) * 0.03 }}
              >
                <MovieCard movie={m} />
              </motion.div>
            ))}

        {/* Skeleton placeholders while fetching next page */}
        {isFetchingNextPage && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)}
      </div>

      {/* Intersection sentinel */}
      <div ref={ref} className="h-10 mt-4" />

      {!hasNextPage && movies.length > 0 && (
        <p className="text-center text-gray-600 text-sm mt-4">You've reached the end</p>
      )}
    </div>
  );
}
