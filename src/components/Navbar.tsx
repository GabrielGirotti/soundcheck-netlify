import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./Searchbar";

interface NavbarProps {
  token: string | null;
  username: string | null;
  handleLogout: () => void;
  handleMessagesClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  token,
  handleLogout,
  handleMessagesClick,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch(`${API_URL}/messages/unread-count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUnreadCount(data.unreadCount);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 5000); // refresca cada 5s
    return () => clearInterval(interval);
  }, [token]);

  const handleLogoutClick = () => {
    handleLogout(); // función que viene de App
    setMenuOpen(false); // cerrar menú
  };

  const handleMessagesClickNav = () => {
    handleMessagesClick(); // función de App
    setMenuOpen(false); // cerrar menú
  };

  return (
    <nav className="bg-gray-900 py-4 px-8 flex justify-between items-center text-white relative">
      <Link
        to="/"
        className="bg-gradient-to-r from-orange-400 to-pink-600 inline-block text-transparent bg-clip-text font-bold text-2xl"
      >
        SoundCheck
      </Link>

      {/* Desktop nav */}
      <div className="space-x-4 lg:flex hidden lg:flex-row flex-col items-center justify-end w-full p-4">
        {token && <SearchBar />}
        <nav className="flex gap-4">
          {token ? (
            <>
              <Link to="/new" className="underline-effect">
                Vender
              </Link>
              <div className="relative">
                <button
                  onClick={handleMessagesClickNav}
                  className="underline-effect"
                >
                  Mensajes
                </button>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-2 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </div>

              <Link to="/panel" className="underline-effect">
                Mi panel
              </Link>
              <button onClick={handleLogoutClick} className="underline-effect">
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="underline-effect">
                iniciar sesión
              </Link>
              <Link to="/register" className="underline-effect">
                registrarse
              </Link>
            </>
          )}
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

      {/* Mobile menu overlay */}
      <div className="fixed inset-0 z-50 flex justify-center items-center pointer-events-none">
        <div
          className={`flex flex-col pt-20 items-center w-full h-full transition-all duration-500 ease-in-out ${
            menuOpen
              ? "translate-x-0 opacity-100 pointer-events-auto"
              : "-translate-x-full opacity-0 pointer-events-none"
          } bg-slate-900`}
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
            className="absolute top-4 bg-gradient-to-r from-orange-400 to-pink-600 inline-block text-transparent bg-clip-text font-bold text-2xl"
          >
            SoundCheck
          </Link>

          {token && <SearchBar onSearch={() => setMenuOpen(false)} />}
          <nav className="flex flex-col gap-6 mt-8 items-center">
            {token ? (
              <>
                <Link
                  to="/new"
                  className="underline-effect"
                  onClick={() => setMenuOpen(false)}
                >
                  Vender
                </Link>
                <div className=" relative">
                  <button
                    onClick={handleMessagesClickNav}
                    className="underline-effect"
                  >
                    Mensajes
                  </button>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2 h-2 w-2 bg-red-500 rounded-full"></span>
                  )}
                </div>

                <Link
                  to="/panel"
                  className="underline-effect"
                  onClick={() => setMenuOpen(false)}
                >
                  Mi panel
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="underline-effect"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
