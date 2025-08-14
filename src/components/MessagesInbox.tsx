import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import Spinner from "./Spinner";

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

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    if (!currentUserId) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No hay token");

      const res = await fetch(`${API_URL}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al cargar mensajes");

      const data = await res.json();

      const filtered = data.filter(
        (msg: any) =>
          (msg.sender._id === currentUserId &&
            msg.receiver._id === otherUserId) ||
          (msg.sender._id === otherUserId && msg.receiver._id === currentUserId)
      );

      setMessages(filtered);
    } catch (err) {
      console.error(err);
      toast.error("No se pudieron cargar los mensajes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // polling cada 3s
    return () => clearInterval(interval);
  }, [currentUserId, otherUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUserId) return;

    // Validación del receptor
    if (!otherUserId || !/^[0-9a-fA-F]{24}$/.test(otherUserId)) {
      toast.error("Usuario receptor inválido");
      return;
    }

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
          receiver: otherUserId, // solo esto
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
    <div className="flex flex-col gap-2 max-w-[500px] mx-auto p-4 h-[80vh] overflow-y-auto">
      {messages.length === 0 ? (
        <p>No hay mensajes.</p>
      ) : (
        messages.map((msg) => (
          <div
            key={msg._id}
            className={`p-2 rounded max-w-[80%] ${
              msg.sender._id === currentUserId
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

      <div ref={messagesEndRef} />

      <div className="flex gap-2 mt-4">
        <input
          type="text"
          className="flex-1 p-2 border rounded"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
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
