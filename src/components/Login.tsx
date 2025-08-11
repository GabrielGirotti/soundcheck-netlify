import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Spinner from "../components/Spinner";

interface LoginProps {
  onLogin: (token: string, username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error en login");

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);

      onLogin(data.token, data.username);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-md mx-auto p-6 rounded-md mt-9">
      {/* Overlay con Spinner */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Spinner />
        </div>
      )}

      <h2 className="text-2xl mb-4 text-white font-bold">Iniciar sesión</h2>
      {error && <p className="mb-2 text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
          required
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`transition duration-300 w-full p-2 rounded text-white font-semibold ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r hover:bg-gradient-to-l from-orange-400 to-pink-600"
          }`}
        >
          Entrar
        </button>
      </form>
      <nav className="w-full flex flex-col justify-center gap-2 items-center p-4">
        <p className="font-black">Aun no tienes cuenta? </p>

        <Link
          to="/register"
          className="hover:text-orange-400 text-white transition duration-300"
        >
          Crea un presionando aqui
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

export default Login;
