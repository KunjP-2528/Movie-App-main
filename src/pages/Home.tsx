// import React, { useRef, useEffect, useState } from 'react';
// import { fetchPopularMovies, fetchUpcomingMovies,fetchTopRatedMovies, Movie } from '../api';
// import MovieCard from '../component/MovieCard';
// import '../Style/Home.css';


// const Home: React.FC = () => {
//   const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
//   const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
//   const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
//   const popularContainerRef = useRef<HTMLDivElement>(null);
//   const upcomingContainerRef = useRef<HTMLDivElement>(null);
//   const topRatedMovieRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const fetchMovies = async () => {
//       try {
//         const popularMoviesData = await fetchPopularMovies();
//         setPopularMovies(popularMoviesData);

//         const upcomingMoviesData = await fetchUpcomingMovies();
//         setUpcomingMovies(upcomingMoviesData);

//         const topratedMovieData = await fetchTopRatedMovies();
//         setTopRatedMovies(topratedMovieData);

//       } catch (error) {
//         console.error("Error fetching movies:", error);
//       }
//     };

//     fetchMovies();
//   }, []);

//   const scrollLeft = (containerRef: React.RefObject<HTMLDivElement>) => {
//     if (containerRef.current) {
//       containerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
//     }
//   };

//   const scrollRight = (containerRef: React.RefObject<HTMLDivElement>) => {
//     if (containerRef.current) {
//       containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
//     }
//   };

//   return (
//     <div className="home">
//       {/* Popular Movies Section */}
//       <div className="movies-section">
//         <div className="section-header">
//           <h2>Popular Movies</h2>
//         </div>
//         <div className="movies-container" ref={popularContainerRef}>
//           {popularMovies.map(movie => (
//             <MovieCard key={movie.id} movie={movie} />
//           ))}
//         </div>
//         <button className="slider-arrow left" onClick={() => scrollLeft(popularContainerRef)}>←</button>
//         <button className="slider-arrow right" onClick={() => scrollRight(popularContainerRef)}>→</button>
//       </div>

//       {/* Upcoming Movies Section */}
//       <div className="movies-section">
//         <div className="section-header">
//           <h2>Upcoming Movies</h2>
//         </div>
//         <div className="movies-container" ref={upcomingContainerRef}>
//           {upcomingMovies.map(movie => (
//             <MovieCard key={movie.id} movie={movie} />
//           ))}
//         </div>
//         <button className="slider-arrow left" onClick={() => scrollLeft(upcomingContainerRef)}>←</button>
//         <button className="slider-arrow right" onClick={() => scrollRight(upcomingContainerRef)}>→</button>
//       </div>
//       {/* {uploading Top rated section} */}
//       <div className="movies-section">
//         <div className="section-header">
//           <h2>TopRated Movies</h2>
//         </div>
//         <div className="movies-container" ref={topRatedMovieRef}>
//           {topRatedMovies.map(movie => (
//             <MovieCard key={movie.id} movie={movie} />
//           ))}
//         </div>
//         <button className="slider-arrow left" onClick={() => scrollLeft(topRatedMovieRef)}>←</button>
//         <button className="slider-arrow right" onClick={() => scrollRight(topRatedMovieRef)}>→</button>
//       </div>
//     </div>
//   );
// };

// export default Home;
import React, { useRef, useEffect, useState } from 'react';
import { fetchPopularMovies, fetchUpcomingMovies, fetchTopRatedMovies, Movie } from '../api';
import MovieCard from '../component/MovieCard';
import '../Style/Home.css';

interface HomeProps {
  dispatch: React.Dispatch<any>;
}

const Home: React.FC<HomeProps> = ({ dispatch }) => {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const popularContainerRef = useRef<HTMLDivElement>(null);
  const upcomingContainerRef = useRef<HTMLDivElement>(null);
  const topRatedMovieRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const popularMoviesData = await fetchPopularMovies();
        setPopularMovies(popularMoviesData);

        const upcomingMoviesData = await fetchUpcomingMovies();
        setUpcomingMovies(upcomingMoviesData);

        const topratedMovieData = await fetchTopRatedMovies();
        setTopRatedMovies(topratedMovieData);

      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  const scrollLeft = (containerRef: React.RefObject<HTMLDivElement>) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = (containerRef: React.RefObject<HTMLDivElement>) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="home">
      {/* Popular Movies Section */}
      <div className="movies-section">
        <div className="section-header">
          <h2>Popular Movies</h2>
        </div>
        <div className="movies-container" ref={popularContainerRef}>
          {popularMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} dispatch={dispatch} />
          ))}
        </div>
        <button className="slider-arrow left" onClick={() => scrollLeft(popularContainerRef)}>←</button>
        <button className="slider-arrow right" onClick={() => scrollRight(popularContainerRef)}>→</button>
      </div>

      {/* Upcoming Movies Section */}
      <div className="movies-section">
        <div className="section-header">
          <h2>Upcoming Movies</h2>
        </div>
        <div className="movies-container" ref={upcomingContainerRef}>
          {upcomingMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} dispatch={dispatch} />
          ))}
        </div>
        <button className="slider-arrow left" onClick={() => scrollLeft(upcomingContainerRef)}>←</button>
        <button className="slider-arrow right" onClick={() => scrollRight(upcomingContainerRef)}>→</button>
      </div>

      {/* Top Rated Movies Section */}
      <div className="movies-section">
        <div className="section-header">
          <h2>Top Rated Movies</h2>
        </div>
        <div className="movies-container" ref={topRatedMovieRef}>
          {topRatedMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} dispatch={dispatch} />
          ))}
        </div>
        <button className="slider-arrow left" onClick={() => scrollLeft(topRatedMovieRef)}>←</button>
        <button className="slider-arrow right" onClick={() => scrollRight(topRatedMovieRef)}>→</button>
      </div>
    </div>
  );
};

export default Home;
