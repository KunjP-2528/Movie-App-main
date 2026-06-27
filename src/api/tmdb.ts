import axios from 'axios';
import { Movie, MovieDetails, TMDBResponse, Video } from '@/types';

const tmdb = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TMDB_BASE_URL,
  params: { api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY },
});

export const tmdbApi = {
  getTrending: (): Promise<TMDBResponse<Movie>> =>
    tmdb.get('/trending/movie/day').then(r => r.data),

  getPopular: (page = 1): Promise<TMDBResponse<Movie>> =>
    tmdb.get('/movie/popular', { params: { page } }).then(r => r.data),

  getTopRated: (page = 1): Promise<TMDBResponse<Movie>> =>
    tmdb.get('/movie/top_rated', { params: { page } }).then(r => r.data),

  getUpcoming: (page = 1): Promise<TMDBResponse<Movie>> =>
    tmdb.get('/movie/upcoming', { params: { page } }).then(r => r.data),

  getMovieDetails: (id: number): Promise<MovieDetails> =>
    tmdb.get(`/movie/${id}`, { params: { append_to_response: 'videos,credits' } }).then(r => r.data),

  getSimilar: (id: number): Promise<TMDBResponse<Movie>> =>
    tmdb.get(`/movie/${id}/similar`).then(r => r.data),

  getRecommendations: (id: number): Promise<TMDBResponse<Movie>> =>
    tmdb.get(`/movie/${id}/recommendations`).then(r => r.data),

  getVideos: (id: number): Promise<{ results: Video[] }> =>
    tmdb.get(`/movie/${id}/videos`).then(r => r.data),

  search: (query: string, page = 1): Promise<TMDBResponse<Movie>> =>
    tmdb.get('/search/movie', { params: { query, page } }).then(r => r.data),

  getByGenre: (genreId: number, page = 1): Promise<TMDBResponse<Movie>> =>
    tmdb.get('/discover/movie', { params: { with_genres: genreId, sort_by: 'popularity.desc', page } }).then(r => r.data),
};

export const getImageUrl = (path: string | null, size = 'w500') => {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
