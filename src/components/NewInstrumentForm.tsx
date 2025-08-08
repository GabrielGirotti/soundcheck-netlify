import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Filter } from "bad-words";
import * as nsfwjs from "nsfwjs";

const NewInstrumentForm: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modelRef = useRef<nsfwjs.NSFWJS | null>(null); // Para el modelo NSFW
  const API_URL = import.meta.env.VITE_API_URL;

  const filter = new Filter();
  filter.addWords(
    "Idiota",
    "Gilipollas",
    "Estúpido",
    "Estúpida",
    "Mierda",
    "Pendejo",
    "Pendeja",
    "Puta",
    "Puto",
    "Conchudo",
    "Conchuda",
    "Pija",
    "Verga",
    "Chota",
    "Cago",
    "Cagar",
    "Boludo",
    "Boluda",
    "Pelotudo",
    "Pelotuda"
  );

  // Cargar el modelo una sola vez
  useEffect(() => {
    const loadModel = async () => {
      modelRef.current = await nsfwjs.load();
    };
    loadModel();
  }, []);

  const analyzeImage = async (file: File) => {
    if (!modelRef.current) return false;

    return new Promise<boolean>((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = async () => {
          const predictions = await modelRef.current!.classify(img);
          const isSensitive = predictions.some(
            (p) =>
              (p.className === "Porn" ||
                p.className === "Hentai" ||
                p.className === "Sexy") &&
              p.probability > 0.5
          );
          resolve(isSensitive);
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      // Filtramos los duplicados antes de analizar
      const uniqueNewFiles = newFiles.filter(
        (file) =>
          !imageFiles.some(
            (existing) =>
              existing.name === file.name && existing.size === file.size
          )
      );

      // Procesamos todas las imágenes en paralelo
      const analysisResults = await Promise.all(
        uniqueNewFiles.map(async (file) => {
          const isSensitive = await analyzeImage(file);
          return { file, isSensitive };
        })
      );

      const safeFiles = analysisResults
        .filter((res) => {
          if (res.isSensitive) {
            toast.error(
              `La imagen "${res.file.name}" contiene contenido sensible y fue rechazada.`
            );
            return false;
          }
          return true;
        })
        .map((res) => res.file);

      // Agregamos las imágenes seguras y sus previews
      setImageFiles((prev) => [...prev, ...safeFiles]);
      setImagePreviews((prev) => [
        ...prev,
        ...safeFiles.map((file) => URL.createObjectURL(file)),
      ]);

      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedFiles = [...imageFiles];
    const updatedPreviews = [...imagePreviews];
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setImageFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (filter.isProfane(title) || filter.isProfane(description)) {
      setError(
        "Esta utilizando lenguaje inapropiado en el título o descripción."
      );
      return;
    }

    if (imageFiles.length === 0) {
      toast.error("Por favor selecciona al menos una imagen.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price.toString());
    formData.append("description", description);
    formData.append("category", category);
    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/instruments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Error al subir instrumento");

      await res.json();
      toast.success("Instrumento publicado con éxito");

      setTitle("");
      setPrice("");
      setDescription("");
      setImageFiles([]);
      setImagePreviews([]);
      setCategory("");

      navigate("/");
    } catch {
      toast.error("Error al publicar instrumento");
    }
  };

  const categories = [
    "Guitarras",
    "Bajos",
    "Baterías",
    "Teclados",
    "Vientos",
    "Cuerdas",
    "Percusión",
    "Accesorios",
  ];

  return (
    <div className="max-w-md mx-auto p-6 rounded-md">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-white">Vender Instrumento</h2>
          <button
            onClick={() => navigate("/")}
            className="text-orange-400 hover:text-white font-semibold transition duration-300"
            type="button"
          >
            &larr; Volver
          </button>
        </div>
        {error && <p className="mb-2 text-red-500">{error}</p>}
        {/* Título */}
        <label className="block mb-2 text-gray-300">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white mb-4"
          required
        />

        {/* Categoría */}
        <label className="block mb-2 text-gray-300">Categoría</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white mb-4"
          required
        >
          <option value="" disabled>
            Selecciona una categoría
          </option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Precio */}
        <label className="block mb-2 text-gray-300">Precio</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full p-2 rounded bg-gray-700 text-white mb-4"
          required
        />

        {/* Descripción */}
        <label className="block mb-2 text-gray-300">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white mb-4"
          required
        />

        {/* Imágenes */}
        <label className="block mb-2 text-gray-300">
          Imágenes del instrumento
        </label>
        <div className="mb-4">
          <label className="flex flex-col items-center justify-center px-4 py-6 bg-gray-800 text-white rounded-lg shadow-md cursor-pointer hover:bg-gray-700 transition">
            <svg
              className="w-8 h-8 mb-2 text-orange-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-5 4h.01M12 20v-4"
              />
            </svg>
            <span>Haz clic para subir imágenes</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />
          </label>
        </div>

        {/* Previews */}
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            {imagePreviews.map((src, index) => (
              <div key={index} className="relative">
                <img
                  src={src}
                  alt={`Preview ${index}`}
                  className="h-32 object-cover rounded shadow w-full"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 text-xs hover:bg-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-400 to-pink-600 hover:scale-105 text-white py-2 px-4 rounded transition duration-300"
        >
          Publicar
        </button>
      </form>
    </div>
  );
};

export default NewInstrumentForm;
