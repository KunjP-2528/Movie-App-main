import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RatingsState {
  ratings: Record<number, number>;
}

const ratingsSlice = createSlice({
  name: 'ratings',
  initialState: { ratings: {} } as RatingsState,
  reducers: {
    initRatings(state) {
      if (typeof window === 'undefined') return;
      try {
        const stored = localStorage.getItem('movie-ratings');
        state.ratings = stored ? JSON.parse(stored) : {};
      } catch {
        state.ratings = {};
      }
    },
    rateMovie(state, action: PayloadAction<{ movieId: number; rating: number }>) {
      state.ratings[action.payload.movieId] = action.payload.rating;
      if (typeof window !== 'undefined') {
        localStorage.setItem('movie-ratings', JSON.stringify(state.ratings));
      }
    },
    removeRating(state, action: PayloadAction<number>) {
      delete state.ratings[action.payload];
      if (typeof window !== 'undefined') {
        localStorage.setItem('movie-ratings', JSON.stringify(state.ratings));
      }
    },
  },
});

export const { initRatings, rateMovie, removeRating } = ratingsSlice.actions;
export default ratingsSlice.reducer;
