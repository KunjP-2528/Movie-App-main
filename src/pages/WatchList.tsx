// import React, { useState, useEffect, useRef } from 'react';
// import MovieCard from '../component/MovieCard';

// const WatchList: React.FC = () => {
//   const [watchlist, setWatchlist] = useState<any[]>([]);
//   const watchlistContainerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const storedWatchlist = localStorage.getItem('watchlist');
//     if (storedWatchlist) {
//       setWatchlist(JSON.parse(storedWatchlist));
//     }
//   }, []);

//   const scrollLeft = () => {
//     if (watchlistContainerRef.current) {
//       watchlistContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
//     }
//   };

//   const scrollRight = () => {
//     if (watchlistContainerRef.current) {
//       watchlistContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
//     }
//   };

//   return (
//     <div className="watchlist">
//       <h1>Your Watchlist</h1>
//       <div className="movies-container" ref={watchlistContainerRef}>
//         {watchlist.length > 0 ? (
//           watchlist.map((movie: any) => (
//             <MovieCard key={movie.id} movie={movie} mode="watchlist" />
//           ))
//         ) : (
//           <p>No movies in your watchlist yet!</p>
//         )}
//       </div>
//       {watchlist.length > 0 && (
//         <>
//           <button className="slider-arrow left" onClick={scrollLeft}>←</button>
//           <button className="slider-arrow right" onClick={scrollRight}>→</button>
//         </>
//       )}
//     </div>
//   );
// };

// export default WatchList;
import React, { useRef } from 'react';
import MovieCard from '../component/MovieCard';
import { Movie } from '../App';  // Import Movie type from App

interface WatchlistProps {
  watchlist: Movie[];
  dispatch: React.Dispatch<any>;  // Type for dispatch
}

const Watchlist: React.FC<WatchlistProps> = ({ watchlist, dispatch }) => {
  const watchlistContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (watchlistContainerRef.current) {
      watchlistContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (watchlistContainerRef.current) {
      watchlistContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="watchlist">
      <h1>Your Watchlist</h1>
      <div className="movies-container" ref={watchlistContainerRef}>
        {watchlist.length > 0 ? (
          watchlist.map((movie: Movie) => (
            <MovieCard key={movie.id} movie={movie} mode="watchlist" dispatch={dispatch} />
          ))
        ) : (
          <p>No movies in your watchlist yet!</p>
        )}
      </div>
      {watchlist.length > 0 && (
        <>
          <button className="slider-arrow left" onClick={scrollLeft}>←</button>
          <button className="slider-arrow right" onClick={scrollRight}>→</button>
        </>
      )}
    </div>
  );
};

export default Watchlist;
