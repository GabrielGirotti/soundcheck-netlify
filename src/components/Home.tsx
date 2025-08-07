import React, { useEffect, useState } from "react";
import { FilterNav } from "./FilterNav";
import HeroSlider from "./HeroSlider";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../hooks/useFavorites";

interface Instrument {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrls?: string[];
  user?: string;
  category?: string;
}

const Home: React.FC = () => {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const { isFavorite, toggleFavorite } = useFavorites();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://${API_URL}/instruments`);
        const data = await res.json();
        setInstruments(data);
      } catch (error) {
        console.error("Error cargando instrumentos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Spinner />;

  const sortedInstruments = [...instruments].sort((a, b) =>
    b._id > a._id ? 1 : -1
  );

  const filteredInstruments = sortedInstruments.filter(
    (inst) =>
      (!selectedCategory || inst.category === selectedCategory) &&
      inst.user !== username
  );

  const handleClick = (_id: string) => {
    navigate(`show-instrument/${_id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    toggleFavorite(id);
  };

  return (
    <>
      <HeroSlider />
      <FilterNav onCategorySelect={setSelectedCategory} />

      <div className="py-4 px-8 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {filteredInstruments.map((inst) => (
          <div
            key={inst._id}
            onClick={() => handleClick(inst._id)}
            className="bg-slate-800 hover:bg-slate-700 hover:shadow-2xl p-4 rounded-t-3xl rounded-l-3xl shadow relative hover:scale-105 transition duration-300 cursor-pointer"
          >
            {/* Corazón de favoritos */}
            <button
              onClick={(e) => handleFavoriteClick(e, inst._id)}
              className={`absolute top-5 right-5 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300 ${
                isFavorite(inst._id)
                  ? "bg-orange-100 border-2 border-orange-400 text-pink-600"
                  : "bg-transparent hover:border-2 hover:border-red-400 text-gray-400 hover:text-red-400"
              }`}
              aria-label={
                isFavorite(inst._id)
                  ? "Quitar de favoritos"
                  : "Agregar a favoritos"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isFavorite(inst._id) ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                />
              </svg>
            </button>

            {/* Imagen */}
            {inst.imageUrls?.[0] && (
              <img
                src={`http://${API_URL}${inst.imageUrls[0]}`}
                alt={inst.title}
                className="w-full h-48 object-cover rounded mb-2"
              />
            )}

            <h3 className="text-white text-xl font-semibold">{inst.title}</h3>
            <p className="text-gray-400 pr-16 md:pr-24">{inst.description}</p>
            <div className="absolute bottom-0 right-0 bg-gradient-to-r hover:bg-gradient-to-l from-orange-400 to-pink-600 text-white text-xl font-semibold pr-4 pl-8 pb-4 pt-8 rounded-tl-full shadow-lg">
              ${inst.price}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
