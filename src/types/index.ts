export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids?: number[];
  genres?: Genre[];
  popularity: number;
  original_language: string;
  adult: boolean;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface MovieDetails extends Movie {
  tagline: string;
  runtime: number;
  budget: number;
  revenue: number;
  status: string;
  production_companies: ProductionCompany[];
  spoken_languages: SpokenLanguage[];
  videos?: { results: Video[] };
  credits?: Credits;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
}

export interface SpokenLanguage {
  iso_639_1: string;
  name: string;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface WatchlistItem {
  id: number;
  movie_app_id: number;
  title: string;
  overview: string;
  poster_path: string;
  added_at: string;
}

export interface FavoriteItem {
  id: number;
  movie_app_id: number;
  title: string;
  overview: string;
  poster_path: string;
  added_at: string;
}
