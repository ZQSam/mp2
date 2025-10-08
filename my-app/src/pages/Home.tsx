import React, { useEffect, useMemo, useState } from "react";
import { getPopularMovies, searchMovies, Movie } from "../api/tmdb";
import SearchBar from "../components/SearchBar";
import MovieList from "../components/MovieList";

type SortKey = "title" | "release_date";

const Home: React.FC = () => {
  const [q, setQ] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

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

  // client-side filter using the current query (keeps server search as primary but allows quick filtering)
  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    const list = movies.filter((m) => {
      if (!qLower) return true;
      const title = (m.title || m.name || "").toLowerCase();
      return title.includes(qLower);
    });

    const sorted = list.slice().sort((a, b) => {
      let aKey: string | number = "";
      let bKey: string | number = "";
      if (sortKey === "title") {
        aKey = (a.title || a.name || "").toLowerCase();
        bKey = (b.title || b.name || "").toLowerCase();
      } else if (sortKey === "release_date") {
        aKey = a.release_date || "";
        bKey = b.release_date || "";
      }
      if (aKey < bKey) return sortDir === "asc" ? -1 : 1;
      if (aKey > bKey) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [movies, q, sortKey, sortDir]);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <h1 style={{ marginBottom: 8 }}>🎬 TMDB Movie Explorer — List View</h1>
      <SearchBar onSearch={handleSearch} initial={q} />

      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          Sort by:
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
          >
            <option value="title">Title</option>
            <option value="release_date">Release Date</option>
          </select>
        </label>
        <button
          onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
        >
          {sortDir === "asc" ? "Ascending" : "Descending"}
        </button>
      </div>

      {status === "loading" && <p>Loading…</p>}
      {status === "error" && <p>Something went wrong. Try again.</p>}

      <MovieList movies={filtered} />
    </div>
  );
};

export default Home;
