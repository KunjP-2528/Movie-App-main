// import { gql } from "@apollo/client";
// export const GET_FAVORITES = gql`
//   query GetFavorites {
//     favorites {
//       id
//       movie_app_id
//       movie_poster_path
//       overview
//       title
//       added_at
//     }
//   }
// `;


// export const GET_WATCHLIST = gql`
//   query GetWatchlist {
//     watchList {
//       id
//       movie_app_id
//       movie_poster_path
//       overview
//       title
//       added_at
//     }
//   }
// `;
import { gql } from "@apollo/client";

export const GET_FAVORITES = gql`
  query GetFavorites {
    favorite {  
      id
      movie_app_id
     poster_path: movie_poster_path
      overview
      title
      added_at
    }
  }
`;

export const GET_WATCHLIST = gql`
  query GetWatchlist {
    watchlist { 
      id
      movie_app_id
    poster_path: movie_poster_path
      overview
      title
      added_at
    }
  }
`;
