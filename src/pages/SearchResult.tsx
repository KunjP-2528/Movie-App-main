import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { searchMovies, Movie } from '../api'; // Import searchMovies
import MovieCard from '../component/MovieCard';


const SearchResults: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('query') || '';
    setQuery(searchQuery);

    const fetchMovies = async () => {
      try {
        const result = await searchMovies(searchQuery);
        setMovies(result);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    fetchMovies();
  }, [location.search]);

  return (
    <div className="search-results">
      <h2>Search Results for: "{query}"</h2>
      <div className="movies-container">
        {movies.length > 0 ? (
          movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        ) : (
          <p>No movies found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
