import axios from 'axios';

const API_KEY = '0d25469f326e60f3f9a2f9d2c83c34a6';
const BASE_URL = 'https://api.themoviedb.org/3';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
}

export const fetchPopularMovies = async (): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    const movies: Movie[] = response.data.results;

    return movies.map(movie => ({
      id: movie.id || Math.random(),
      title: movie.title || 'Untitled', 
      overview: movie.overview || 'No overview available', 
      poster_path: movie.poster_path || '', 
    }));
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
    const movies: Movie[] = response.data.results;

    return movies.map(movie => ({
      id: movie.id || Math.random(),
      title: movie.title || 'Untitled',
      overview: movie.overview || 'No overview available',
      poster_path: movie.poster_path || '',
    }));
  } catch (error) {
    console.error('Error searching for movies:', error);
    throw error;
  }
};

export const fetchUpcomingMovies = async (): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`);
    const movies: Movie[] = response.data.results;

    return movies.map(movie => ({
      id: movie.id || Math.random(),
      title: movie.title || 'Untitled',
      overview: movie.overview || 'No overview available',
      poster_path: movie.poster_path || '',
    }));
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    throw error;
  }
};

export const fetchMovieVideos = async (movieId: number): Promise<any> => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movie videos:', error);
    throw error;
  }
};

// Adding fetchTopRatedMovies function
export const fetchTopRatedMovies = async (): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
    const movies: Movie[] = response.data.results;

    return movies.map(movie => ({
      id: movie.id || Math.random(),
      title: movie.title || 'Untitled',
      overview: movie.overview || 'No overview available',
      poster_path: movie.poster_path || '',
    }));
  } catch (error) {
    console.error('Error fetching top-rated movies:', error);
    throw error;
  }
};
