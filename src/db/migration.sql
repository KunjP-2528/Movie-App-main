-- Run these in your Hasura SQL console to add user_id support
-- After running, every user will see only their own favorites/watchlist

-- Add user_id to favorite table
ALTER TABLE public.favorite
  ADD COLUMN IF NOT EXISTS user_id TEXT;

-- Add user_id to watchlist table
ALTER TABLE public.watchlist
  ADD COLUMN IF NOT EXISTS user_id TEXT;

-- Add indexes for fast per-user lookups
CREATE INDEX IF NOT EXISTS idx_favorite_user_id  ON public.favorite(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON public.watchlist(user_id);

-- Then update /api/favorites/route.ts and /api/watchlist/route.ts to:
--   WHERE { user_id: { _eq: $user_id } }   (GET / DELETE)
--   object: { ..., user_id: session.user.id }  (POST)
