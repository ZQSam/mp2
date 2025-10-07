import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieDetails, MovieDetails, posterUrl, IMAGE_BASE } from "../api/tmdb";

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [status, setStatus] = useState<"loading"|"error"|"done">("loading");

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
  if (status === "error" || !movie) return <p style={{ padding: 16 }}>Not found.</p>;

  const title = movie.title || movie.name || "Untitled";
  const poster = posterUrl(movie.poster_path, "w500");
  const backdrop = movie.backdrop_path ? `${IMAGE_BASE}w780${movie.backdrop_path}` : undefined;

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
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 16, marginTop: -120, display: "flex", gap: 24 }}>
        {poster && <img src={poster} alt={`${title} poster`} style={{ width: 220, borderRadius: 12 }} />}
        <div>
          <h2 style={{ marginTop: 0 }}>{title}</h2>
          <p><strong>Rating:</strong> {movie.vote_average?.toFixed(1) ?? "N/A"}</p>
          <p><strong>Runtime:</strong> {movie.runtime ? `${movie.runtime} min` : "N/A"}</p>
          <p><strong>Genres:</strong> {movie.genres?.map(g => g.name).join(", ") || "N/A"}</p>
          <p style={{ lineHeight: 1.6 }}>{movie.overview || "No overview."}</p>
          <Link to="/" style={{ display: "inline-block", marginTop: 8 }}>← Back</Link>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;
