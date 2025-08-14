import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { toast } from "react-hot-toast";

interface MessagesInboxListProps {
  currentUserId: string | null;
}

interface Conversation {
  userId: string;
  username: string;
  lastMessage: string;
  lastMessageDate: string;
}

const MessagesInboxList: React.FC<MessagesInboxListProps> = ({
  currentUserId,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!currentUserId) return;

    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token");

        const res = await fetch(`${API_URL}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Error al cargar mensajes");

        const data = await res.json();

        // Agrupar mensajes por usuario
        const convMap: Record<string, Conversation> = {};

        data.forEach((msg: any) => {
          const otherUser =
            msg.sender._id === currentUserId ? msg.receiver : msg.sender;
          const lastMessageDate = new Date(msg.createdAt).toISOString();

          if (
            !convMap[otherUser._id] ||
            new Date(convMap[otherUser._id].lastMessageDate) <
              new Date(lastMessageDate)
          ) {
            convMap[otherUser._id] = {
              userId: otherUser._id,
              username: otherUser.username,
              lastMessage: msg.content,
              lastMessageDate,
            };
          }
        });

        setConversations(Object.values(convMap));
      } catch (err) {
        console.error(err);
        toast.error("No se pudieron cargar las conversaciones");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [currentUserId]);

  if (loading) return <Spinner />;

  if (conversations.length === 0)
    return <p className="p-4">No tienes conversaciones.</p>;

  return (
    <div className="max-w-md mx-auto p-4 flex flex-col gap-2">
      <h3 className="text-lg text-white mb-4">Estos son tus mensajes:</h3>
      {conversations.map((conv) => (
        <div
          key={conv.userId}
          className="p-3 rounded hover:bg-slate-800 hover:scale-105 transition duration-300 cursor-pointer bg-slate-700 shadow-xl"
          onClick={() => navigate(`/messages/${conv.userId}`)}
        >
          <p className="font-semibold">{conv.username}</p>
          <p className="text-sm text-gray-400 truncate">{conv.lastMessage}</p>
          <span className="text-xs text-gray-400">
            {new Date(conv.lastMessageDate).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default MessagesInboxList;
