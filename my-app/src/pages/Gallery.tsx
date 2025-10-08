import React, { useEffect, useMemo, useState } from "react";
import MovieGrid from "../components/MovieGrid";
import { Movie, getPopularMovies } from "../api/tmdb";

const Gallery: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  // filters
  const [hasPoster, setHasPoster] = useState(false);
  const [recentOnly, setRecentOnly] = useState(false);
  const [hasOverview, setHasOverview] = useState(false);

  useEffect(() => {
    setStatus("loading");
    getPopularMovies()
      .then(setMovies)
      .then(() => setStatus("idle"))
      .catch(() => setStatus("error"));
  }, []);

  const filtered = useMemo(() => {
    return movies.filter((m) => {
      if (hasPoster && !m.poster_path) return false;
      if (hasOverview && !m.overview) return false;
      if (recentOnly) {
        // consider recent as year >= 2020
        const year = m.release_date ? parseInt(m.release_date.slice(0, 4)) : 0;
        if (isNaN(year) || year < 2020) return false;
      }
      return true;
    });
  }, [movies, hasPoster, recentOnly, hasOverview]);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <h1 style={{ marginBottom: 8 }}>Gallery View</h1>

      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={hasPoster}
            onChange={(e) => setHasPoster(e.target.checked)}
          />{" "}
          Has poster
        </label>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={recentOnly}
            onChange={(e) => setRecentOnly(e.target.checked)}
          />{" "}
          Released 2020+
        </label>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={hasOverview}
            onChange={(e) => setHasOverview(e.target.checked)}
          />{" "}
          Has overview
        </label>
        <div style={{ marginLeft: "auto", color: "#666" }}>
          Showing {filtered.length} of {movies.length}
        </div>
      </div>

      {status === "loading" && <p>Loading…</p>}
      {status === "error" && <p>Something went wrong. Try again.</p>}
      <MovieGrid movies={filtered} />
    </div>
  );
};

export default Gallery;
