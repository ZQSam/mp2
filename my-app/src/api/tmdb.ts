import axios from "axios";

const API_KEY = process.env.REACT_APP_TMDB_KEY!;
const BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_BASE = "https://image.tmdb.org/t/p/"; // use sizes like w185, w342, w500, original

export type Movie = {
  id: number;
  title: string;
  name?: string;           // some endpoints use 'name'
  poster_path: string | null;
  release_date?: string;
  overview?: string;
};

export type MovieDetails = Movie & {
  genres?: { id: number; name: string }[];
  runtime?: number;
  vote_average?: number;
  backdrop_path?: string | null;
};

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY },
});

// Popular movies
export async function getPopularMovies(page = 1): Promise<Movie[]> {
  const { data } = await tmdb.get("/movie/popular", { params: { page } });
  return data.results;
}
// Search by title
export async function searchMovies(query: string, page = 1): Promise<Movie[]> {
  const { data } = await tmdb.get("/search/movie", { params: { query, page, include_adult: false } });
  return data.results;
}
// details
export async function getMovieDetails(id: number): Promise<MovieDetails> {
  const { data } = await tmdb.get(`/movie/${id}`);
  return data;
}

export function posterUrl(path: string | null, size: "w185"|"w342"|"w500"|"original" = "w342") {
  return path ? `${IMAGE_BASE}${size}${path}` : undefined;
}