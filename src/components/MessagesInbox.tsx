import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { toast } from "react-hot-toast";

const MessagesInbox = ({ userId }: { userId: string }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/messages/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
  }, [userId]);

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
              msg.sender._id === userId ? "bg-slate-700 self-start" : "bg-orange-400 self-end"
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
