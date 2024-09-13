import { gql } from "@apollo/client";
export const GET_FAVORITES = gql`
  query GetFavorites {
    favorites {
      id
      movie_app_id
      movie_poster_path
      overview
      title
      added_at
    }
  }
`;

// Query to get all movies in the watchlist
export const GET_WATCHLIST = gql`
  query GetWatchlist {
    watchList {
      id
      movie_app_id
      movie_poster_path
      overview
      title
      added_at
    }
  }
`;