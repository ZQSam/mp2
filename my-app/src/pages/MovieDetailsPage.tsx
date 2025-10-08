import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getMovieDetails,
  MovieDetails,
  posterUrl,
  IMAGE_BASE,
} from "../api/tmdb";

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "done">("loading");
  const navigate = useNavigate();
  const [siblings, setSiblings] = useState<number[]>([]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("last_movies");
      if (raw) setSiblings(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await getMovieDetails(Number(id));
        setMovie(data);
        setStatus("done");
      } catch {
        setStatus("error");
      }
    })();
  }, [id]);

  if (status === "loading") return <p style={{ padding: 16 }}>Loading…</p>;
  if (status === "error" || !movie)
    return <p style={{ padding: 16 }}>Not found.</p>;

  const title = movie.title || movie.name || "Untitled";
  const poster = posterUrl(movie.poster_path, "w500");
  const backdrop = movie.backdrop_path
    ? `${IMAGE_BASE}w780${movie.backdrop_path}`
    : undefined;

  return (
    <div>
      {backdrop && (
        <div
          style={{
            backgroundImage: `url(${backdrop})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: 260,
            filter: "brightness(0.6)",
          }}
        />
      )}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: 16,
          marginTop: -80,
          display: "flex",
          gap: 24,
          position: "relative",
        }}
      >
        {poster && (
          <img
            src={poster}
            alt={`${title} poster`}
            style={{
              width: 220,
              borderRadius: 12,
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              position: "relative",
              zIndex: 2,
            }}
          />
        )}
        <div
          style={{
            background: "#fff",
            padding: 12,
            borderRadius: 8,
            flex: 1,
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <h2 style={{ marginTop: 0 }}>{title}</h2>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            {/* prev/next navigation */}
            {(() => {
              const idx = siblings.findIndex(
                (i) => String(i) === String(movie.id)
              );
              const prevId = idx > 0 ? siblings[idx - 1] : null;
              const nextId =
                idx >= 0 && idx < siblings.length - 1
                  ? siblings[idx + 1]
                  : null;
              return (
                <>
                  <button
                    onClick={() => prevId && navigate(`/movie/${prevId}`)}
                    disabled={!prevId}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "1px solid #ccc",
                      background: !prevId ? "#f5f5f5" : "#fff",
                      cursor: prevId ? "pointer" : "not-allowed",
                    }}
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => nextId && navigate(`/movie/${nextId}`)}
                    disabled={!nextId}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "1px solid #ccc",
                      background: !nextId ? "#f5f5f5" : "#fff",
                      cursor: nextId ? "pointer" : "not-allowed",
                    }}
                  >
                    Next →
                  </button>
                </>
              );
            })()}
          </div>
          <p>
            <strong>Rating:</strong> {movie.vote_average?.toFixed(1) ?? "N/A"}
          </p>
          <p>
            <strong>Runtime:</strong>{" "}
            {movie.runtime ? `${movie.runtime} min` : "N/A"}
          </p>
          <p>
            <strong>Genres:</strong>{" "}
            {movie.genres?.map((g) => g.name).join(", ") || "N/A"}
          </p>
          <p style={{ lineHeight: 1.6 }}>{movie.overview || "No overview."}</p>
          <Link to="/" style={{ display: "inline-block", marginTop: 8 }}>
            ← Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;
