'use client';

import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { MovieCard } from '@/components/movie/MovieCard';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { FavoriteItem, WatchlistItem } from '@/types';
import { getImageUrl } from '@/api/tmdb';
import type { ContinueItem } from '@/app/api/continue-watching/route';

export function Dashboard() {
  const { data: session } = useSession();
  const qc = useQueryClient();

  const { data: favorites = [], isLoading: favLoad } = useQuery<FavoriteItem[]>({
    queryKey: ['favorites'],
    queryFn: () => fetch('/api/favorites').then(r => r.json()),
    enabled: !!session,
  });

  const { data: watchlist = [], isLoading: wlLoad } = useQuery<WatchlistItem[]>({
    queryKey: ['watchlist'],
    queryFn: () => fetch('/api/watchlist').then(r => r.json()),
    enabled: !!session,
  });
  

  const { data: continueItems = [] } = useQuery<ContinueItem[]>({
    queryKey: ['continue-watching'],
    queryFn: () => fetch('/api/continue-watching').then(r => r.json()),
    enabled: !!session,
  });

  const { mutate: removeFromContinue } = useMutation({
    mutationFn: (movieId: number) =>
      fetch(`/api/continue-watching?movieId=${movieId}`, { method: 'DELETE' }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['continue-watching'] }),
  });

  if (!session) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="glass rounded-2xl p-10 text-center max-w-sm">
          <p className="text-4xl mb-4">🔐</p>
          <p className="font-bold text-xl mb-2">Sign in required</p>
          <p className="text-gray-400 text-sm mb-6">Your dashboard is protected</p>
          <Link href="/login">
            <button className="px-8 py-3 bg-[#E50914] text-white font-bold rounded-xl hover:bg-[#c40812] transition-colors">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 md:px-8 max-w-7xl mx-auto pb-16">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          {session.user?.image ? (
            <Image src={session.user.image} alt="" width={40} height={40} className="rounded-full ring-2 ring-[#E50914]/40" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#E50914] flex items-center justify-center font-bold">
              {session.user?.name?.[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-extrabold">Hello, {session.user?.name} 👋</h1>
            <p className="text-gray-500 text-xs">{session.user?.email}</p>
          </div>
        </div>
        <p className="text-gray-500 text-sm mt-1 mb-10">Your personal movie collection</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        {[
          { label: 'Favorites', value: favorites.length, color: 'text-yellow-400' },
          { label: 'Watchlist', value: watchlist.length, color: 'text-blue-400' },
          { label: 'Continue', value: continueItems.length, color: 'text-[#E50914]' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-2xl p-5"
          >
            <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-gray-400 text-sm mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Continue Watching */}
      {continueItems.length > 0 && (
        <ListSection title="Continue Watching" loading={false} isEmpty={false} emptyMsg="">
          {continueItems.map(item => (
            <div key={item.movieId} className="flex-shrink-0 w-[150px] md:w-[175px] relative group/cw">
              <Link href={`/movie/${item.movieId}`}>
                <div className="rounded-xl overflow-hidden bg-[#1a1a1a]" style={{ aspectRatio: '2/3' }}>
                  {item.poster_path ? (
                    <Image src={getImageUrl(item.poster_path)} alt={item.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🎬</div>
                  )}
                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div className="h-full bg-[#E50914]" style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1 truncate">{item.title}</p>
              </Link>
              <button
                onClick={() => removeFromContinue(item.movieId)}
                className="absolute top-1 right-1 w-6 h-6 glass rounded-full text-xs flex items-center justify-center opacity-0 group-hover/cw:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </ListSection>
      )}

      <ListSection title="My Favorites" loading={favLoad} isEmpty={favorites.length === 0} emptyMsg="No favorites yet — browse movies and hit ★">
        {(favorites as FavoriteItem[]).map(m => (
          <div key={m.id} className="flex-shrink-0 w-[150px] md:w-[175px]">
            <MovieCard movie={m} mode="favorites" />
          </div>
        ))}
      </ListSection>

      <ListSection title="My Watchlist" loading={wlLoad} isEmpty={watchlist.length === 0} emptyMsg="Watchlist is empty — add movies with + List">
        {(watchlist as WatchlistItem[]).map(m => (
          <div key={m.id} className="flex-shrink-0 w-[150px] md:w-[175px]">
            <MovieCard movie={m} mode="watchlist" />
          </div>
        ))}
      </ListSection>
    </div>
  );
}

function ListSection({ title, loading, isEmpty, emptyMsg, children }: {
  title: string; loading: boolean; isEmpty: boolean; emptyMsg: string; children: React.ReactNode;
}) {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold mb-5">{title}</h2>
      {loading ? (
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="flex-shrink-0 w-[150px]"><SkeletonCard /></div>)}
        </div>
      ) : isEmpty ? (
        <div className="glass rounded-2xl p-10 text-center text-gray-500">
          <p className="text-4xl mb-3">🎬</p><p className="text-sm">{emptyMsg}</p>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4">{children}</div>
      )}
    </div>
  );
}
