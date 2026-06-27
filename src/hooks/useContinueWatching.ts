import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function useContinueWatching(movieId: number, title: string, poster_path: string | null) {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session || !movieId) return;

    fetch('/api/continue-watching', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        movieId,
        title,
        poster_path: poster_path ?? '',
        progress: 5, // Mark as "started" when detail page is visited
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }, [movieId, title, poster_path, session]);
}
