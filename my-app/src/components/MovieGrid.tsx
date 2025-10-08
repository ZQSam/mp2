import React from "react";
import { Movie } from "../api/tmdb";
import MovieCard from "./MovieCard";

type Props = { movies: Movie[] };

const MovieGrid: React.FC<Props> = ({ movies }) => {
  const prepare = () => {
    try {
      sessionStorage.setItem(
        "last_movies",
        JSON.stringify(movies.map((m) => m.id))
      );
    } catch {}
  };
  return (
    <div className="movie-grid">
      {movies.map((m) => (
        <MovieCard key={m.id} movie={m} onPrepareNavigate={prepare} />
      ))}
    </div>
  );
};

export default MovieGrid;
