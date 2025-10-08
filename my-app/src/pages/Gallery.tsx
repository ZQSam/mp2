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
  const [minPopularity, setMinPopularity] = useState<number | "">("");
  const [minRating, setMinRating] = useState<number | "">("");
  const [pagesToLoad, setPagesToLoad] = useState(1);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setStatus("loading");
      try {
        const pages: Movie[] = [];
        for (let p = 1; p <= pagesToLoad; p++) {
          // getPopularMovies supports page param
          // @ts-ignore
          const data = await getPopularMovies(p);
          pages.push(...data);
        }
        if (!cancelled) {
          setMovies(pages);
          setStatus("idle");
        }
      } catch (e) {
        if (!cancelled) setStatus("error");
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [pagesToLoad]);

  const filtered = useMemo(() => {
    return movies.filter((m) => {
      if (hasPoster && !m.poster_path) return false;
      if (hasOverview && !m.overview) return false;
      if (recentOnly) {
        // consider recent as year >= 2020
        const year = m.release_date ? parseInt(m.release_date.slice(0, 4)) : 0;
        if (isNaN(year) || year < 2020) return false;
      }
      if (
        minPopularity !== "" &&
        (m.popularity || 0) < (minPopularity as number)
      )
        return false;
      if (minRating !== "" && (m.vote_average || 0) < (minRating as number))
        return false;
      return true;
    });
  }, [movies, hasPoster, recentOnly, hasOverview, minPopularity, minRating]);

  return (
    <div className="page">
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
        <h1 style={{ marginBottom: 8 }}>Gallery View</h1>

        <div className="controls">
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
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            Min popularity:
            <input
              type="number"
              value={minPopularity}
              onChange={(e) =>
                setMinPopularity(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              style={{ width: 100 }}
            />
          </label>
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            Min rating:
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={minRating}
              onChange={(e) =>
                setMinRating(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              style={{ width: 100 }}
            />
          </label>
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            Pages to load:
            <input
              type="number"
              min={1}
              max={5}
              value={pagesToLoad}
              onChange={(e) =>
                setPagesToLoad(Math.max(1, Math.min(5, Number(e.target.value))))
              }
              style={{ width: 80 }}
            />
          </label>
          <div style={{ marginLeft: "auto", color: "#666" }}>
            Showing {filtered.length} of {movies.length}
          </div>
        </div>

        {status === "loading" && <p>Loading…</p>}
        {status === "error" && <p>Something went wrong. Try again.</p>}
        <MovieGrid movies={filtered} />
      </div>
    </div>
  );
};

export default Gallery;
