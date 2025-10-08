import React, { useEffect, useState } from "react";
import MovieGrid from "../components/MovieGrid";
import { Movie, getPopularMovies } from "../api/tmdb";

const Gallery: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    setStatus("loading");
    getPopularMovies()
      .then(setMovies)
      .then(() => setStatus("idle"))
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <h1 style={{ marginBottom: 8 }}>Gallery View</h1>
      {status === "loading" && <p>Loading…</p>}
      {status === "error" && <p>Something went wrong. Try again.</p>}
      <MovieGrid movies={movies} />
    </div>
  );
};

export default Gallery;
