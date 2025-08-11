import React from "react";
import { CiLocationOn } from "react-icons/ci";
import { useScrollReveal } from "../hooks/useScrollReveal";

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

interface InstrumentCardProps {
  inst: Instrument;
  onClick: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  isLoggedIn: boolean;
}

const InstrumentCard: React.FC<InstrumentCardProps> = ({
  inst,
  onClick,
  isFavorite,
  toggleFavorite,
  isLoggedIn,
}) => {
  console.log("isLoggedIn en InstrumentCard:", isLoggedIn);
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      onClick={() => onClick(inst._id)}
      className={`bg-slate-800 hover:bg-slate-700 hover:shadow-2xl p-4 rounded-t-3xl rounded-l-3xl shadow relative hover:scale-105 transition duration-300 cursor-pointer
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
      `}
      style={{
        transitionProperty: "opacity, transform",
        transitionDuration: "600ms",
      }}
    >
      {isLoggedIn && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(inst._id);
          }}
          className={`absolute top-5 right-5 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300 ${
            isFavorite(inst._id)
              ? "bg-orange-100 border-2 border-orange-400 text-pink-600"
              : "bg-transparent hover:border-2 hover:border-red-400 text-gray-400 hover:text-red-400"
          }`}
          aria-label={
            isFavorite(inst._id) ? "Quitar de favoritos" : "Agregar a favoritos"
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
      )}

      {inst.imageUrls?.[0] && (
        <img
          src={inst.imageUrls[0]}
          alt={inst.title}
          className="w-full h-48 object-cover rounded mb-2"
        />
      )}

      <h3 className="text-white text-xl font-semibold">{inst.title}</h3>
      <p className="text-gray-400 pr-16 md:pr-24">{inst.description}</p>
      <div className="flex pr-16 md:pr-24 gap-1 mt-2">
        <CiLocationOn />
        <p className="text-gray-400 pr-16 md:pr-24 text-xs">{inst.location}</p>
      </div>

      <div className="absolute bottom-0 right-0 bg-gradient-to-r hover:bg-gradient-to-l from-orange-400 to-pink-600 text-white text-xl font-semibold pr-4 pl-8 pb-4 pt-8 rounded-tl-full shadow-lg">
        €{inst.price}
      </div>
    </div>
  );
};

export default InstrumentCard;
