import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetailsPage from "./pages/MovieDetailsPage";

const App: React.FC = () => {
  return (
    <div>
      <header style={{ padding: 16, borderBottom: "1px solid #2223" }}>
        <nav style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Link to="/" style={{ fontWeight: 700, textDecoration: "none" }}>
            TMDB Explorer
          </Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
      </Routes>
    </div>
  );
};

export default App;
