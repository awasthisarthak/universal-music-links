"use client";

import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [spotifyUrl, setSpotifyUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSpotifyUrl(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.url) {
        setSpotifyUrl(data.url);
      } else {
        setError("No results found.");
      }
    } catch {
      setError("Search failed.");
    }
  };

  return (
    <main className="p-8 flex flex-col items-center gap-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a song"
          className="border px-2 py-1"
        />
        <button type="submit" className="border px-4 py-1">
          Search
        </button>
      </form>
      {spotifyUrl && (
        <a
          href={spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Open in Spotify
        </a>
      )}
      {error && <p>{error}</p>}
    </main>
  );
}
