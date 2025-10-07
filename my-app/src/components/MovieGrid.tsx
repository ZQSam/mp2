import React from "react";
import { Movie } from "../api/tmdb";
import MovieCard from "./MovieCard";

type Props = { movies: Movie[] };

const MovieGrid: React.FC<Props> = ({ movies }) => {
  return (
    <div
      className="grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: 16,
      }}
    >
      {movies.map((m) => (
        <MovieCard key={m.id} movie={m} />
      ))}
    </div>
  );
};

export default MovieGrid;
