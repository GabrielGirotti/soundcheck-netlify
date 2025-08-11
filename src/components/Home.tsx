import React, { useEffect, useState } from "react";
import { FilterNav } from "./FilterNav";
import HeroSlider from "./HeroSlider";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../hooks/useFavorites";
import InstrumentCard from "./InstrumentCard";

interface Instrument {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrls?: string[];
  user?: string;
  category?: string;
  location?: string;
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
        const res = await fetch(`${API_URL}/instruments`);
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

  const filteredInstruments = sortedInstruments.filter((inst) => {
    if (!selectedCategory || inst.category === selectedCategory) {
      if (username) {
        return inst.user !== username;
      }
      return true; // si no hay usuario, muestra todo
    }
    return false;
  });

  const handleClick = (_id: string) => {
    navigate(`show-instrument/${_id}`);
  };

  return (
    <>
      <HeroSlider />
      <FilterNav onCategorySelect={setSelectedCategory} />

      <div className="py-4 px-8 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {filteredInstruments.map((inst) => (
          <InstrumentCard
            key={inst._id}
            inst={inst}
            onClick={handleClick}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </>
  );
};

export default Home;
