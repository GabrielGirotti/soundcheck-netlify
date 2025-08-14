import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";

interface MessagesInboxProps {
  currentUserId: string | null;
  otherUserId: string;
}

const MessagesInbox: React.FC<MessagesInboxProps> = ({
  currentUserId,
  otherUserId,
}) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUserId) return;

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
    if (!newMessage.trim() || !currentUserId) return;

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
        <Link to={`/chat/${otherUserId}`}>Abrir chat</Link>
      {messages.length === 0 ? (
        <p>No hay mensajes.</p>
      ) : (
        messages.map((msg) => (
          <div
            key={msg._id}
            className={`p-2 rounded ${
              msg.sender === currentUserId
                ? "bg-slate-700 self-end"
                : "bg-orange-400 self-start"
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
          className="flex-1 p-2 border rounded"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <button
          className="bg-orange-400 text-white px-4 rounded"
          onClick={sendMessage}
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default MessagesInbox;
