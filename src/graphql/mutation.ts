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
    insert_watchlist(objects: {
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
    insert_favorite(objects: {
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
export const DELETE_FROM_WATCHLIST = gql`
  mutation DeleteFromWatchlist($id: Int!) {
    delete_watchlist(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;

export const DELETE_FROM_FAVORITES = gql`
  mutation DeleteFromFavorites($id: Int!) {
    delete_favorite(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;
