'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Movie } from '@/types';
import { MovieCard } from './MovieCard';

interface Props {
  title: string;
  movies: Movie[];
  badge?: string;
}

export function MovieSlider({ title, movies, badge }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir === 'left' ? -ref.current.clientWidth * 0.75 : ref.current.clientWidth * 0.75, behavior: 'smooth' });
  };

  if (!movies.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group/slider relative"
    >
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {badge && (
          <span className="text-xs px-2 py-0.5 bg-[#E50914] rounded-full font-semibold uppercase tracking-wider">
            {badge}
          </span>
        )}
      </div>

      <div className="relative">
        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-r from-[#141414]/90 to-transparent flex items-center justify-start pl-2 opacity-0 group-hover/slider:opacity-100 transition-opacity"
        >
          <span className="text-3xl font-light text-white/80 hover:text-white transition-colors">‹</span>
        </button>

        <div ref={ref} className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {movies.map(movie => (
            <div key={movie.id} className="flex-shrink-0 w-[150px] md:w-[185px]">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-l from-[#141414]/90 to-transparent flex items-center justify-end pr-2 opacity-0 group-hover/slider:opacity-100 transition-opacity"
        >
          <span className="text-3xl font-light text-white/80 hover:text-white transition-colors">›</span>
        </button>
      </div>
    </motion.div>
  );
}
