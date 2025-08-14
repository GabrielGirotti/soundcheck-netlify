import React, { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";

import NewInstrumentForm from "./components/NewInstrumentForm";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import UserPanel from "./components/UserPanel";

import SearchBar from "./components/Searchbar";

import "swiper/css";
import "swiper/css/pagination";
import Footer from "./components/Footer";

import SearchResults from "./components/SearchResults";
import ForgotPassword from "./components/ForgotPassword";
import EditInstrumentForm from "./components/EditInstrumentForm";
import ShowInstrument from "./components/ShowInstrument";

import { Toaster } from "react-hot-toast";

import { jwtDecode } from "jwt-decode";

import MessagesInbox from "./components/MessagesInbox";
import Chat from "./components/Chat";

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    if (storedToken && storedUsername) {
      setToken(storedToken);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogin = (token: string, username: string) => {
    setToken(token);
    setUsername(username);
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
  };

  const handleLogout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setMenuOpen(false);
    navigate(`/login`);
  };

  let currentUserId: string | null = null;
  if (token) {
    try {
      const decoded = jwtDecode<{ id: string }>(token); // Cambia 'id' según tu payload
      currentUserId = decoded.id;
    } catch (err) {
      console.error("Token inválido:", err);
    }
  }

  const handleMessagesClick = () => {
    navigate("/messages");
    setMenuOpen(false);
  };

  return (
    <>
      {token ? (
        <nav className="bg-gray-900 py-4 px-8 flex justify-between items-center text-white relative">
          <Link
            to="/"
            className="bg-gradient-to-r from-orange-400 to-pink-600 inline-block text-transparent bg-clip-text font-bold text-2xl"
          >
            SoundCheck
          </Link>

          {/* Desktop nav */}
          <div className="space-x-4 lg:flex hidden lg:flex-row flex-col items-center justify-end w-full p-4">
            <SearchBar />
            <nav className="flex gap-4">
              <Link to="/new" className="underline-effect">
                Vender
              </Link>
              <Link to="/panel" className="underline-effect">
                Mi panel
              </Link>
              <button
                onClick={handleMessagesClick}
                className="underline-effect"
              >
                Mensajes
              </button>
              <button onClick={handleLogout} className="underline-effect">
                Salir
              </button>
            </nav>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex items-center justify-center"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            </svg>
          </button>

          {/* Mobile menu overlay SIEMPRE MONTADO */}
          <div className="fixed inset-0 z-50 flex justify-center items-center pointer-events-none">
            <div
              className={`flex flex-col justify-center items-center w-full h-full
                transition-all duration-500 ease-in-out
                ${
                  menuOpen
                    ? "translate-x-0 opacity-100 pointer-events-auto"
                    : "-translate-x-full opacity-0 pointer-events-none"
                }
                bg-slate-900`}
              style={{ position: "absolute", left: 0, top: 0 }}
            >
              <button
                className="absolute top-3 right-9 text-white text-4xl"
                onClick={() => setMenuOpen(false)}
                aria-label="Cerrar menú"
              >
                &times;
              </button>
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="absolute top-4 bg-gradient-to-r from-orange-400 to-pink-600 inline-block text-transparent bg-clip-text font-bold text-2xl "
              >
                SoundCheck
              </Link>

              <div>
                <SearchBar onSearch={() => setMenuOpen(false)} />
              </div>
              <nav className="flex flex-col gap-6 mt-8 items-center">
                <Link
                  to="/new"
                  className="underline-effect"
                  onClick={() => setMenuOpen(false)}
                >
                  Vender
                </Link>
                <Link
                  to="/panel"
                  className="underline-effect"
                  onClick={() => setMenuOpen(false)}
                >
                  Mi panel
                </Link>
                <button onClick={handleLogout} className="underline-effect">
                  Salir
                </button>
              </nav>
            </div>
          </div>
        </nav>
      ) : (
        <nav className="bg-gray-900 py-4 px-8 flex justify-between items-center text-white relative">
          <Link
            to="/"
            className="bg-gradient-to-r from-orange-400 to-pink-600 inline-block text-transparent bg-clip-text font-bold text-2xl"
          >
            SoundCheck
          </Link>

          {/* Desktop nav */}
          <div className="space-x-4 lg:flex hidden lg:flex-row flex-col items-center justify-end w-full p-4">
            <nav className="flex gap-4">
              <Link to="/login" className="underline-effect">
                iniciar sesión
              </Link>
              <Link to="/register" className="underline-effect">
                registrarse
              </Link>
            </nav>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex items-center justify-center"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            </svg>
          </button>

          {/* Mobile menu overlay SIEMPRE MONTADO */}
          <div className="fixed inset-0 z-50 flex justify-center items-center pointer-events-none">
            <div
              className={`flex flex-col justify-center items-center w-full h-full
                transition-all duration-500 ease-in-out
                ${
                  menuOpen
                    ? "translate-x-0 opacity-100 pointer-events-auto"
                    : "-translate-x-full opacity-0 pointer-events-none"
                }
                bg-slate-900`}
              style={{ position: "absolute", left: 0, top: 0 }}
            >
              <button
                className="absolute top-3 right-9 text-white text-4xl"
                onClick={() => setMenuOpen(false)}
                aria-label="Cerrar menú"
              >
                &times;
              </button>
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="absolute top-4 bg-gradient-to-r from-orange-400 to-pink-600 inline-block text-transparent bg-clip-text font-bold text-2xl "
              >
                SoundCheck
              </Link>

              <div></div>
              <nav className="flex flex-col gap-6 mt-8 items-center">
                <Link
                  to="/login"
                  className="underline-effect"
                  onClick={() => setMenuOpen(false)}
                >
                  iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="underline-effect"
                  onClick={() => setMenuOpen(false)}
                >
                  registrarse
                </Link>
              </nav>
            </div>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/new"
          element={
            token ? <NewInstrumentForm /> : <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/login"
          element={
            token ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/register"
          element={token ? <Navigate to="/" replace /> : <Register />}
        />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/panel"
          element={
            token ? (
              <UserPanel username={username} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/edit-instrument/:id"
          element={
            token ? <EditInstrumentForm /> : <Navigate to="/login" replace />
          }
        />
        <Route path="/show-instrument/:id" element={<ShowInstrument />} />
        <Route
          path="/messages"
          element={
            token ? (
              <MessagesInbox currentUserId={currentUserId} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/chat"
          element={
            token ? (
              <Chat userId={""} otherUsername={""} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
      <Footer />

      <Toaster
        position="bottom-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
    </>
  );
};

export default App;
