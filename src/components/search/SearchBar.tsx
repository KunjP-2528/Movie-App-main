'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi, getImageUrl } from '@/api/tmdb';
import { useDebounce } from '@/hooks/useDebounce';
import { VoiceSearch } from './VoiceSearch';

export function SearchBar({ large }: { large?: boolean }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 400);

  const { data: suggestions } = useQuery({
    queryKey: ['suggestions', debouncedQuery],
    queryFn: () => tmdbApi.search(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  });

  const showDrop = focused && debouncedQuery.length >= 2 && (suggestions?.results?.length ?? 0) > 0;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?query=${encodeURIComponent(query.trim())}`);
    setFocused(false);
  };

  const pick = (id: number) => {
    router.push(`/movie/${id}`);
    setQuery('');
    setFocused(false);
  };

  const handleVoiceResult = useCallback((text: string) => {
    setQuery(text);
    router.push(`/search?query=${encodeURIComponent(text)}`);
  }, [router]);

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={submit}>
        <div
          className={`flex items-center gap-2 glass rounded-full px-4 transition-all ${
            large ? 'py-3' : 'py-2'
          } ${focused ? 'ring-1 ring-[#E50914]/70' : ''}`}
        >
          <span className="text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Search movies…"
            className={`bg-transparent text-white placeholder-gray-500 outline-none flex-1 ${large ? 'text-base' : 'text-sm'}`}
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="text-gray-500 hover:text-white text-sm">✕</button>
          )}
          <VoiceSearch onResult={handleVoiceResult} />
        </div>
      </form>

      <AnimatePresence>
        {showDrop && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 right-0 glass rounded-2xl overflow-hidden z-50 shadow-2xl max-h-96 overflow-y-auto"
          >
            {suggestions!.results.slice(0, 6).map(movie => (
              <button
                key={movie.id}
                onClick={() => pick(movie.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left"
              >
                <div className="flex-shrink-0 w-9 h-12 rounded-lg overflow-hidden bg-[#2d2d2d]">
                  {movie.poster_path ? (
                    <Image
                      src={getImageUrl(movie.poster_path, 'w92')}
                      alt={movie.title}
                      width={36}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">🎬</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{movie.title}</p>
                  <p className="text-xs text-gray-500">{movie.release_date?.slice(0, 4)}</p>
                </div>
                {movie.vote_average > 0 && (
                  <span className="text-xs text-yellow-400 flex-shrink-0">⭐ {movie.vote_average.toFixed(1)}</span>
                )}
              </button>
            ))}
            <button
              onClick={() => { router.push(`/search?query=${encodeURIComponent(debouncedQuery)}`); setFocused(false); }}
              className="w-full py-3 text-center text-sm text-[#E50914] hover:bg-white/5 transition-colors border-t border-white/10"
            >
              See all results for "{debouncedQuery}"
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
