import React from "react";
import { Link } from "react-router-dom";
import { Movie, posterUrl } from "../api/tmdb";

type Props = { movie: Movie; onPrepareNavigate?: () => void };

const MovieCard: React.FC<Props> = ({ movie, onPrepareNavigate }) => {
  const img = posterUrl(movie.poster_path, "w342");
  const title = movie.title || movie.name || "Untitled";

  return (
    <Link
      to={`/movie/${movie.id}`}
      onClick={() => onPrepareNavigate && onPrepareNavigate()}
      className="movie-card"
    >
      {img ? (
        <img src={img} alt={`${title} poster`} />
      ) : (
        <div
          style={{
            height: 200,
            display: "grid",
            placeItems: "center",
            background: "#eee",
          }}
        >
          No Poster
        </div>
      )}
      <div style={{ padding: 12, fontWeight: 600 }}>{title}</div>
    </Link>
  );
};

export default MovieCard;
