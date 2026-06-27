import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './slices/favoritesSlice';
import watchlistReducer from './slices/watchlistSlice';
import ratingsReducer from './slices/ratingsSlice';

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    watchlist: watchlistReducer,
    ratings: ratingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
