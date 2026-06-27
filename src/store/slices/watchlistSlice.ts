import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WatchlistItem } from '@/types';

interface WatchlistState {
  items: WatchlistItem[];
}

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState: { items: [] } as WatchlistState,
  reducers: {
    setWatchlist(state, action: PayloadAction<WatchlistItem[]>) {
      state.items = action.payload;
    },
  },
});

export const { setWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;
