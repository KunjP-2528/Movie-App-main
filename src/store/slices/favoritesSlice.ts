import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FavoriteItem } from '@/types';

interface FavoritesState {
  items: FavoriteItem[];
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: { items: [] } as FavoritesState,
  reducers: {
    setFavorites(state, action: PayloadAction<FavoriteItem[]>) {
      state.items = action.payload;
    },
  },
});

export const { setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
