import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { toast } from "react-hot-toast";

const MessagesList = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/messages/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setConversations(data);
      } catch {
        toast.error("Error al cargar mensajes");
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Tus conversaciones</h1>
      {conversations.length === 0 ? (
        <p>No tienes mensajes todavía.</p>
      ) : (
        <ul>
          {conversations.map((conv: any) => (
            <li
              key={conv.user._id}
              className="p-3 bg-slate-800 rounded mb-2 cursor-pointer hover:bg-slate-700"
              onClick={() => navigate(`/messages/${conv.user._id}`)}
            >
              <p className="font-semibold">{conv.user.username}</p>
              <p className="text-sm text-gray-400">
                {conv.lastMessage.content}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MessagesList;
