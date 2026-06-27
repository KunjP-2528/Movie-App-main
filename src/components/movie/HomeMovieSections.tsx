'use client';

import { useQuery } from '@tanstack/react-query';
import { tmdbApi } from '@/api/tmdb';
import { MovieSlider } from './MovieSlider';
import { SkeletonSlider } from '@/components/ui/SkeletonSlider';

export function HomeMovieSections() {
  const { data: trending, isLoading: tL } = useQuery({ queryKey: ['trending'], queryFn: tmdbApi.getTrending });
  const { data: popular, isLoading: pL } = useQuery({ queryKey: ['popular'], queryFn: () => tmdbApi.getPopular() });
  const { data: topRated, isLoading: trL } = useQuery({ queryKey: ['topRated'], queryFn: () => tmdbApi.getTopRated() });
  const { data: upcoming, isLoading: uL } = useQuery({ queryKey: ['upcoming'], queryFn: () => tmdbApi.getUpcoming() });

  return (
    <div className="px-4 md:px-8 pb-16 space-y-10 -mt-10 relative z-10">
      {tL ? <SkeletonSlider title="Trending Now" /> : <MovieSlider title="Trending Now" movies={trending?.results ?? []} badge="Hot" />}
      {pL ? <SkeletonSlider title="Popular Movies" /> : <MovieSlider title="Popular Movies" movies={popular?.results ?? []} />}
      {trL ? <SkeletonSlider title="Top Rated" /> : <MovieSlider title="Top Rated" movies={topRated?.results ?? []} />}
      {uL ? <SkeletonSlider title="Coming Soon" /> : <MovieSlider title="Coming Soon" movies={upcoming?.results ?? []} badge="New" />}
    </div>
  );
}
