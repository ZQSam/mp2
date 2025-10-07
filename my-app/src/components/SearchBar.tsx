import React, { useState } from "react";

type Props = { onSearch: (q: string) => void; initial?: string };

const SearchBar: React.FC<Props> = ({ onSearch, initial = "" }) => {
  const [q, setQ] = useState(initial);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(q.trim());
      }}
      className="search"
      style={{ display: "flex", gap: 8, marginBottom: 16 }}
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search movies…"
        aria-label="Search movies"
        style={{ flex: 1, padding: "8px 12px" }}
      />
      <button type="submit" style={{ padding: "8px 12px" }}>Search</button>
    </form>
  );
};

export default SearchBar;
