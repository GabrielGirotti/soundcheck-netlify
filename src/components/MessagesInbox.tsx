import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { toast } from "react-hot-toast";

interface MessagesInboxProps {
  currentUserId: string | null;
}

const MessagesInbox: React.FC<MessagesInboxProps> = ({ currentUserId }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token");

        const res = await fetch(`${API_URL}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar mensajes");

        const data = await res.json();
        setMessages(data);
        console.log(data);
      } catch (err) {
        console.error(err);
        toast.error("No se pudieron cargar los mensajes");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="flex flex-col gap-2 max-w-[500px] mx-auto p-4">
      {messages.length === 0 ? (
        <p>No hay mensajes.</p>
      ) : (
        messages.map((msg) => (
          <div
            key={msg._id}
            className={`p-2 rounded ${
              msg.sender._id === currentUserId
                ? "bg-slate-700 self-start"
                : "bg-orange-400 self-end"
            }`}
          >
            <p className="text-sm">{msg.content}</p>
            <span className="text-xs text-gray-400">
              {new Date(msg.createdAt).toLocaleString()}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default MessagesInbox;
