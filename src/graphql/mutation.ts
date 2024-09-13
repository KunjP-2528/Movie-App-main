import { gql } from '@apollo/client';
export const ADD_TO_WATCHLIST = gql`
  mutation AddToWatchList(
    $id: Int!, 
    $movie_app_id: Int!, 
    $movie_poster_path: String!, 
    $overview: String!, 
    $title: String!, 
    $added_at: timestamptz!
  ) {
    insert_watchList(objects: {
      id: $id, 
      movie_app_id: $movie_app_id, 
      movie_poster_path: $movie_poster_path, 
      overview: $overview, 
      title: $title, 
      added_at: $added_at
    }) {
      returning {
        id
        movie_app_id
        movie_poster_path
        overview
        title
        added_at
      }
    }
  }
`;
export const ADD_TO_FAVORITES = gql`
  mutation AddToFavorites(
    $id: Int!, 
    $movie_app_id: Int!, 
    $movie_poster_path: String!, 
    $overview: String!, 
    $title: String!, 
    $added_at: timestamptz!
  ) {
    insert_favorites(objects: {
      id: $id, 
      movie_app_id: $movie_app_id, 
      movie_poster_path: $movie_poster_path, 
      overview: $overview, 
      title: $title, 
      added_at: $added_at
    }) {
      returning {
        id
        movie_app_id
        movie_poster_path
        overview
        title
        added_at
      }
    }
  }
`;
