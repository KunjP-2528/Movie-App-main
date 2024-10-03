  // import React, { useState, useEffect, useRef } from 'react';
  // import MovieCard from '../component/MovieCard';

  // const Favorite: React.FC = () => {
  //   const [favorites, setFavorites] = useState<any[]>([]);
  //   const favoritesContainerRef = useRef<HTMLDivElement>(null);

  //   useEffect(() => {
  //     const storedFavorites = localStorage.getItem('favorites');
  //     if (storedFavorites) {
  //       setFavorites(JSON.parse(storedFavorites));
  //     }
  //   }, []);

  //   const scrollLeft = () => {
  //     if (favoritesContainerRef.current) {
  //       favoritesContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  //     }
  //   };

  //   const scrollRight = () => {
  //     if (favoritesContainerRef.current) {
  //       favoritesContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  //     }
  //   };

  //   return (
  //     <div className="favorite">
  //       <h1>Your Favorites</h1>
  //       <div className="movies-container" ref={favoritesContainerRef}>
  //         {favorites.length > 0 ? (
  //           favorites.map((movie: any) => (
  //             <MovieCard key={movie.id} movie={movie} mode="favorites" />
  //           ))
  //         ) : (
  //           <p>No favorite movies added yet!</p>
  //         )}
  //       </div>
  //       {favorites.length > 0 && (
  //         <>
  //           <button className="slider-arrow left" onClick={scrollLeft}>←</button>
  //           <button className="slider-arrow right" onClick={scrollRight}>→</button>
  //         </>
  //       )}
  //     </div>
  //   );
  // };

  // export default Favorite;
import React, { useRef } from 'react';
import MovieCard from '../component/MovieCard';
import { useQuery } from '@apollo/client';
import { GET_FAVORITES, } from '../graphql/quires';



const Favorite: React.FC = ( ) => {

  const favoritesContainerRef = useRef<HTMLDivElement>(null);
  const { data, loading, error } = useQuery(GET_FAVORITES);
  console.log(data);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const movies = data?.favorite || [];
  console.log(movies)


  const scrollLeft = () => {
    if (favoritesContainerRef.current) {
      favoritesContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (favoritesContainerRef.current) {
      favoritesContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="favorite">
      <h1>Your Favorites</h1>
      <div className="movies-container" ref={favoritesContainerRef}>
        {movies.length > 0 ? (
          movies.map((movie: any) => (
            <MovieCard key={movie.id} movie={movie} mode="favorites"  />
          ))
        ) : (
          <p>No favorite movies added yet!</p>
        )}
      </div>
      {data.length > 0 && (
        <>
          <button className="slider-arrow left" onClick={scrollLeft}>←</button>
          <button className="slider-arrow right" onClick={scrollRight}>→</button>
        </>
      )}
    </div>
  );
};

export default Favorite;
