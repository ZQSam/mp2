import React from "react";
import { Movie, posterUrl } from "../api/tmdb";
import { Link } from "react-router-dom";

type Props = {
  movies: Movie[];
};

const MovieList: React.FC<Props> = ({ movies }) => {
  const prepare = () => {
    try {
      sessionStorage.setItem(
        "last_movies",
        JSON.stringify(movies.map((m) => m.id))
      );
    } catch {}
  };
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {movies.map((m) => {
        const title = m.title || m.name || "Untitled";
        return (
          <Link
            key={m.id}
            to={`/movie/${m.id}`}
            onClick={prepare}
            style={{
              display: "flex",
              gap: 12,
              textDecoration: "none",
              color: "inherit",
              alignItems: "center",
              padding: 12,
              border: "1px solid #2223",
              borderRadius: 8,
            }}
          >
            {m.poster_path ? (
              <img
                src={posterUrl(m.poster_path, "w185")}
                alt={`${title} poster`}
                style={{
                  width: 80,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 6,
                }}
              />
            ) : (
              <div
                style={{
                  width: 80,
                  height: 120,
                  display: "grid",
                  placeItems: "center",
                  background: "#eee",
                  borderRadius: 6,
                }}
              >
                No Poster
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>{title}</div>
              <div style={{ color: "#555", fontSize: 14 }}>
                {m.release_date || "Unknown release"}
              </div>
              <p style={{ marginTop: 8, marginBottom: 0 }}>
                {m.overview
                  ? m.overview.slice(0, 200) +
                    (m.overview.length > 200 ? "..." : "")
                  : "No overview."}
              </p>
            </div>
            <div style={{ minWidth: 90, textAlign: "right", color: "#666" }}>
              ID: {m.id}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default MovieList;
