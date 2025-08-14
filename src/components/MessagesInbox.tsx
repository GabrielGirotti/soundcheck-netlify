import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import Spinner from "./Spinner";

interface MessagesInboxProps {
  currentUserId: string | null;
}

const MessagesInbox: React.FC<MessagesInboxProps> = ({ currentUserId }) => {
  const { otherUserId } = useParams<{ otherUserId: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!currentUserId || !otherUserId) return;

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token");

        const res = await fetch(
          `${API_URL}/messages?user1=${currentUserId}&user2=${otherUserId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Error al cargar mensajes");

        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error(err);
        toast.error("No se pudieron cargar los mensajes");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [currentUserId, otherUserId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUserId || !otherUserId) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No hay token");

      const res = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sender: currentUserId,
          receiver: otherUserId,
          content: newMessage,
        }),
      });

      if (!res.ok) throw new Error("Error al enviar mensaje");

      const data = await res.json();
      setMessages((prev) => [...prev, data]);
      setNewMessage("");
    } catch (err) {
      console.error(err);
      toast.error("No se pudo enviar el mensaje");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="flex flex-col gap-2 max-w-[500px] mx-auto p-4">
      {messages.length === 0 ? (
        <p>No hay mensajes.</p>
      ) : (
        messages.map((msg) => (
          <div
            key={msg._id}
            className={`p-2 rounded w-[80%] ${
              msg.sender._id === currentUserId
                ? "bg-slate-700 self-end"
                : "bg-slate-800 self-start"
            }`}
          >
            <p className="text-sm">{msg.content}</p>
            <span className="text-xs text-gray-400">
              {new Date(msg.createdAt).toLocaleString()}
            </span>
          </div>
        ))
      )}

      <div className="flex gap-2 mt-4">
        <input
          type="text"
          className="flex-1 p-2 border rounded bg-slate-700"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <button
          className="rounded bg-gradient-to-r from-orange-400 to-pink-600 text-white font-semibold shadow hover:scale-105 transition px-4 py-2"
          onClick={sendMessage}
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default MessagesInbox;
