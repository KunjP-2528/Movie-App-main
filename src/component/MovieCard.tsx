// import React, { useState, useEffect } from 'react';
// import './Moviecard.css';
// import { useSnackbar } from 'notistack';

// interface MovieCardProps {
//   movie: {
//     id: number;
//     title: string;
//     overview: string;
//     poster_path: string;
//   };
  
//   mode?: 'favorites' | 'watchlist'; 
// }

// const MovieCard: React.FC<MovieCardProps> = ({ movie, mode }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const [videoId, setVideoId] = useState<string | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const { enqueueSnackbar } = useSnackbar();

//   useEffect(() => {
//     const fetchVideoId = async () => {
//       try {
//         const response = await fetch(
//           `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=0d25469f326e60f3f9a2f9d2c83c34a6&language=en-US`
//         );
//         const data = await response.json();
//         const video = data.results.find(
//           (vid: any) => vid.site === 'YouTube'
//         ); // Example for YouTube videos
//         if (video) {
//           setVideoId(video.key);
//         }
//       } catch (error) {
//         console.error('Error fetching video:', error);
//       }
//     };

//     fetchVideoId();
//   }, [movie.id]);

//   const handleMouseEnter = () => {
//     setIsHovered(true);
//   };

//   const handleMouseLeave = () => {
//     setIsHovered(false);
//   };

//   const handleCardClick = () => {
//     if (videoId) {
//       setIsModalOpen(true);
//     }
//   };

//   const handleCloseModal = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setIsModalOpen(false);
//   };

//   const handleAddToFavorites = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
//     if (!favorites.some((item: any) => item.id === movie.id)) {
//       favorites.push(movie);
//       localStorage.setItem('favorites', JSON.stringify(favorites));
//       enqueueSnackbar('Movie added to Favorite!', { variant: 'success' });
//     } else {
//       enqueueSnackbar('Movie is already in Favorite!', { variant: 'info' });
//     }
//   };

//   const handleAddToWatchlist = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     let watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    
//     if (!watchlist.some((item: any) => item.id === movie.id)) {
//       watchlist.push(movie);
//       localStorage.setItem('watchlist', JSON.stringify(watchlist));
//       enqueueSnackbar('Movie added to WatchList!', { variant: 'success' });
//     } else {
//       enqueueSnackbar('Movie is already in WatchList!', { variant: 'info' });
//     }
//   };

//   const handleDelete = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     const modeKey = mode || '';
//     const storedMovies = JSON.parse(localStorage.getItem(modeKey) || '[]');
//     const updatedMovies = storedMovies.filter((movieItem: any) => movieItem.id !== movie.id);
//     localStorage.setItem(modeKey, JSON.stringify(updatedMovies));
    
//     enqueueSnackbar('Movie deleted successfully!', { variant: 'success' });
//     window.location.reload(); 
//   };

//   return (
//     <div
//       className={`movie-card ${isHovered ? 'hovered' : ''}`}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//       onClick={handleCardClick}
//     >
//       <img
//         src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
//         alt={movie.title}
//       />
//       {isHovered && (
//         <div className="movie-info">
//           <h3>{movie.title}</h3>
//           <p>{movie.overview}</p>
//           <div className="buttons">
//             <button onClick={handleAddToFavorites}>Add to Favorites</button>
//             <button onClick={handleAddToWatchlist}>Add to Watchlist</button>
//           </div>
//         </div>
//       )}
//       {isHovered && (mode === 'favorites' || mode === 'watchlist') && (
//         <div className="movie-info">
//           <button className="delete-button" onClick={handleDelete}>Delete</button>
//         </div>
//       )}
//       {isModalOpen && videoId && (
//         <div className="modal" onClick={handleCloseModal}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <button className="cancel" onClick={handleCloseModal}>
//               Cancel
//             </button>
//             <iframe
//               src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
//               title={movie.title}
//               allow="autoplay; encrypted-media"
//               allowFullScreen
//               frameBorder="0"
//             ></iframe>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MovieCard;
// import React, { useState, useEffect } from 'react';
import './Moviecard.css';
import { useMutation } from '@apollo/client';
import { ADD_TO_WATCHLIST, ADD_TO_FAVORITES } from '../graphql/mutation'; 
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
  };
  mode?: 'favorites' | 'watchlist';
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, mode }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  // Apollo Client mutations
  const [addToWatchlist] = useMutation(ADD_TO_WATCHLIST);
  const [addToFavorites] = useMutation(ADD_TO_FAVORITES);

  useEffect(() => {
    const fetchVideoId = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=0d25469f326e60f3f9a2f9d2c83c34a6&language=en-US`
        );
        const data = await response.json();
        const video = data.results.find(
          (vid: any) => vid.site === 'YouTube'
        ); // Example for YouTube videos
        if (video) {
          setVideoId(video.key);
        }
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };

    fetchVideoId();
  }, [movie.id]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleCardClick = () => {
    if (videoId) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(false);
  };

  const handleAddToFavorites = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { data } = await addToFavorites({
        variables: {
          id: movie.id,
          movie_app_id: movie.id, // Adjust according to your schema
          movie_poster_path: movie.poster_path,
          overview: movie.overview,
          title: movie.title,
          added_at: new Date().toISOString(),
        },
      });
      console.log("Added to Favorite:", data);
      enqueueSnackbar('Movie added to Favorite!', { variant: 'success' });
    } catch (error) {
      console.error("Error adding to Favorite:", error);
      enqueueSnackbar('Failed to add movie to Favorite.', { variant: 'error' });
    }
  };

  const handleAddToWatchlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { data } = await addToWatchlist({
        variables: {
          id: movie.id,
          movie_app_id: movie.id, // Adjust according to your schema
          movie_poster_path: movie.poster_path,
          overview: movie.overview,
          title: movie.title,
          added_at: new Date().toISOString(),
        },
      });
      console.log("Added to Watchlist:", data);
      enqueueSnackbar('Movie added to Watchlist!', { variant: 'success' });
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      enqueueSnackbar('Failed to add movie to Watchlist.', { variant: 'error' });
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement your delete functionality here
    enqueueSnackbar('Movie deleted successfully!', { variant: 'success' });
  };

  return (
    <div
      className={`movie-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />
      {isHovered && (
        <div className="movie-info">
          <h3>{movie.title}</h3>
          <p>{movie.overview}</p>
          <div className="buttons">
            <button onClick={handleAddToFavorites}>Add to Favorites</button>
            <button onClick={handleAddToWatchlist}>Add to Watchlist</button>
          </div>
        </div>
      )}
      {isHovered && (mode === 'favorites' || mode === 'watchlist') && (
        <div className="movie-info">
          <button className="delete-button" onClick={handleDelete}>Delete</button>
        </div>
      )}
      {isModalOpen && videoId && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="cancel" onClick={handleCloseModal}>
              Cancel
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={movie.title}
              allow="autoplay; encrypted-media"
              allowFullScreen
              frameBorder="0"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
