import React, { useEffect, useState } from "react";
import { getPopularMovies, searchMovies, Movie } from "../api/tmdb";
import SearchBar from "../components/SearchBar";
import MovieGrid from "../components/MovieGrid";

const Home: React.FC = () => {
  const [q, setQ] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  // load popular on mount
  useEffect(() => {
    setStatus("loading");
    getPopularMovies()
      .then(setMovies)
      .then(() => setStatus("idle"))
      .catch(() => setStatus("error"));
  }, []);

  const handleSearch = async (query: string) => {
    setQ(query);
    setStatus("loading");
    try {
      const data = query ? await searchMovies(query) : await getPopularMovies();
      setMovies(data);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <h1 style={{ marginBottom: 8 }}>🎬 TMDB Movie Explorer</h1>
      <SearchBar onSearch={handleSearch} initial={q} />
      {status === "loading" && <p>Loading…</p>}
      {status === "error" && <p>Something went wrong. Try again.</p>}
      <MovieGrid movies={movies} />
    </div>
  );
};

export default Home;
