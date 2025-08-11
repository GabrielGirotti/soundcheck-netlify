import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { useFavorites } from "../hooks/useFavorites";
import InstrumentCard from "./InstrumentCard";

interface Instrument {
  location?: string;
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrls?: string[];
  category?: string;
}

const SearchResults: React.FC = () => {
  const [results, setResults] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const API_URL = import.meta.env.VITE_API_URL;

  const query = new URLSearchParams(location.search).get("q") || "";

  // Buscar resultados
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(
          `${API_URL}/instruments/search?q=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setResults(data);
      } catch (error) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  const handleClick = (id: string) => {
    setResults([]);
    navigate(`/show-instrument/${id}`, { replace: true });
  };

  if (loading) return <Spinner />;

  if (results.length === 0)
    return (
      <div className="text-white p-4 flex flex-col items-center">
        No se encontraron resultados.
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-2 rounded bg-gradient-to-r from-orange-400 to-pink-600 text-white font-semibold shadow hover:scale-105 transition"
        >
          Volver al inicio
        </button>
      </div>
    );

  return (
    <div className="py-4 px-8">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {results.map((inst) => (
          <InstrumentCard
            key={inst._id}
            inst={inst}
            onClick={handleClick}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            isLoggedIn={!!username}
          />
        ))}
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-2 rounded bg-gradient-to-r from-orange-400 to-pink-600 text-white font-semibold shadow hover:scale-105 transition"
      >
        Volver al inicio
      </button>
    </div>
  );
};

export default SearchResults;
