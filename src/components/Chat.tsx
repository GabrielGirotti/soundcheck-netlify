import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import Spinner from "./Spinner";

interface ChatProps {
  currentUserId: string;      // Usuario actual
  otherUserId: string;        // Usuario con quien chateamos
  otherUsername: string;      // Nombre para mostrar
}

const Chat: React.FC<ChatProps> = ({ currentUserId, otherUserId, otherUsername }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  // Scroll al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token");

        const res = await fetch(`${API_URL}/messages/${otherUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
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
  }, [otherUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return toast.error("El mensaje no puede estar vacío");

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
          receiver: otherUserId,
          content: message,
        }),
      });

      if (!res.ok) throw new Error("Error al enviar mensaje");

      const newMsg = await res.json();
      setMessages([...messages, newMsg]);
      setMessage("");
    } catch (err) {
      console.error(err);
      toast.error("No se pudo enviar el mensaje");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="flex flex-col max-w-[500px] mx-auto p-4 h-[80vh] border border-gray-600 rounded-lg bg-slate-900">
      <h2 className="text-xl font-bold mb-4 text-center">{otherUsername}</h2>

      <div className="flex-1 overflow-y-auto mb-4 flex flex-col gap-2">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center mt-4">No hay mensajes aún.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`p-2 rounded max-w-[80%] ${
                msg.sender._id === currentUserId
                  ? "bg-slate-700 self-end"
                  : "bg-orange-400 self-start text-black"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <span className="text-xs text-gray-400">
                {new Date(msg.createdAt).toLocaleString()}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Escribe tu mensaje..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 rounded bg-slate-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 rounded bg-gradient-to-r from-orange-400 to-pink-600 text-white font-semibold shadow hover:scale-105 transition"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Chat;
