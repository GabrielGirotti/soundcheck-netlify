import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import leoProfanity from "leo-profanity";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const profanity = leoProfanity as any;

  // 🆕 Cargar diccionario en español e inglés
  leoProfanity.loadDictionary("es" as any);
  leoProfanity.loadDictionary("en");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 🛑 Validar si el username es ofensivo
    if (profanity.isProfane(username)) {
      setError("El nombre de usuario contiene palabras inapropiadas.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error en registro");

      toast.success("Registro exitoso, ya puedes iniciar sesión");
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-md mt-9">
      <h2 className="text-2xl mb-4 text-white font-bold">Registro</h2>
      {error && <p className="mb-2 text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
          required
          minLength={3}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
          required
          minLength={6}
        />
        <button
          type="submit"
          className="transition duration-300 w-full bg-pink-400 hover:bg-pink-600 p-2 rounded text-white font-semibold"
        >
          Registrarse
        </button>
      </form>
      <nav className="w-full flex flex-col justify-center gap-2 items-center p-4">
        <p className="font-black">Ya tienes cuenta? </p>
        <Link
          to="/login"
          className="hover:text-pink-400 text-white transition duration-300"
        >
          Inicia sesión presionando aquí
        </Link>
        <Link
          to="/forgot-password"
          className="w-full hover:text-orange-400 text-slate-300 transition duration-300 border border-orange-400 text-xs p-2 rounded text-center mt-2"
        >
          Recuperar credenciales
        </Link>
      </nav>
    </div>
  );
};

export default Register;
