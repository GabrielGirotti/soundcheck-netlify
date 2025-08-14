import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import NewInstrumentForm from "./components/NewInstrumentForm";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import UserPanel from "./components/UserPanel";

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
import MessagesInboxList from "./components/MessagesInboxList";
import Navbar from "./components/Navbar";

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
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
  };

  return (
    <>
      <Navbar
        token={token}
        username={username}
        handleLogout={handleLogout}
        handleMessagesClick={handleMessagesClick}
        currentUserId={currentUserId}
      />

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
              <MessagesInboxList currentUserId={currentUserId} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/messages/:otherUserId"
          element={
            token ? (
              <MessagesInbox currentUserId={currentUserId} />
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
