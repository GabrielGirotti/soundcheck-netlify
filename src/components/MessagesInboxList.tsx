// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Spinner from "./Spinner";
// import { toast } from "react-hot-toast";

// interface MessagesInboxListProps {
//   currentUserId: string | null;
// }

// interface Conversation {
//   userId: string;
//   username: string;
//   lastMessage: string;
//   lastMessageDate: string;
// }

// const MessagesInboxList: React.FC<MessagesInboxListProps> = ({
//   currentUserId,
// }) => {
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const API_URL = import.meta.env.VITE_API_URL;

//   useEffect(() => {
//     if (!currentUserId) return;

//     const fetchConversations = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) throw new Error("No hay token");

//         const res = await fetch(`${API_URL}/messages`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.ok) throw new Error("Error al cargar mensajes");

//         const data = await res.json();

//         // Agrupar mensajes por usuario
//         const convMap: Record<string, Conversation> = {};

//         data.forEach((msg: any) => {
//           const otherUser =
//             msg.sender._id === currentUserId ? msg.receiver : msg.sender;
//           const lastMessageDate = new Date(msg.createdAt).toISOString();

//           if (
//             !convMap[otherUser._id] ||
//             new Date(convMap[otherUser._id].lastMessageDate) <
//               new Date(lastMessageDate)
//           ) {
//             convMap[otherUser._id] = {
//               userId: otherUser._id,
//               username: otherUser.username,
//               lastMessage: msg.content,
//               lastMessageDate,
//             };
//           }
//         });

//         setConversations(Object.values(convMap));
//       } catch (err) {
//         console.error(err);
//         toast.error("No se pudieron cargar las conversaciones");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchConversations();
//   }, [currentUserId]);

//   if (loading) return <Spinner />;

//   if (conversations.length === 0)
//     return <p className="p-4">No tienes conversaciones.</p>;

//   return (
//     <div className="max-w-md mx-auto p-4 flex flex-col gap-2">
//       <h3 className="text-lg text-white mb-4">Estos son tus mensajes:</h3>
//       {conversations.map((conv) => (
//         <div
//           key={conv.userId}
//           className="p-3 rounded hover:bg-slate-800 hover:scale-105 transition duration-300 cursor-pointer bg-slate-700 shadow-xl"
//           onClick={() => navigate(`/messages/${conv.userId}`)}
//         >
//           <p className="font-semibold">{conv.username}</p>
//           <p className="text-sm text-gray-400 truncate">{conv.lastMessage}</p>
//           <span className="text-xs text-gray-400">
//             {new Date(conv.lastMessageDate).toLocaleString()}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default MessagesInboxList;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { toast } from "react-hot-toast";

interface MessagesInboxListProps {
  currentUserId: string | null;
}

interface User {
  _id: string;
  username: string;
}

interface Message {
  _id: string;
  sender: User;
  receiver: User;
  content: string;
  createdAt: string;
  read: boolean;
}

interface Conversation {
  userId: string;
  username: string;
  lastMessage: string;
  lastMessageDate: string;
  hasUnread?: boolean;
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

        // Traer todos los mensajes
        const res = await fetch(`${API_URL}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar mensajes");
        const data: Message[] = await res.json();

        // Traer mensajes no leídos
        const unreadRes = await fetch(`${API_URL}/messages/unread`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!unreadRes.ok)
          throw new Error("Error al cargar mensajes no leídos");
        const unreadData: Message[] = await unreadRes.json();

        // Crear un Set de usuarios con mensajes no leídos
        const unreadSet = new Set(unreadData.map((msg) => msg.sender._id));

        // Agrupar mensajes por usuario
        const convMap: Record<string, Conversation> = {};
        data.forEach((msg: Message) => {
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
              hasUnread: unreadSet.has(otherUser._id),
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

  const handleOpenConversation = async (userId: string) => {
    navigate(`/messages/${userId}`);

    // Marcar como leídos en el backend
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await fetch(`${API_URL}/messages/mark-read`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      // Actualizar estado local para quitar borde rojo SOLO de esa conversación
      setConversations((prev) =>
        prev.map((conv) =>
          conv.userId === userId ? { ...conv, hasUnread: false } : conv
        )
      );
    } catch (err) {
      console.error("Error al marcar mensajes como leídos:", err);
    }
  };

  if (loading) return <Spinner />;

  if (conversations.length === 0)
    return <p className="p-4">No tienes conversaciones.</p>;

  return (
    <div className="max-w-md mx-auto p-4 flex flex-col gap-2">
      <h3 className="text-lg text-white mb-4">Estos son tus mensajes:</h3>
      {conversations.map((conv) => {
        const borderClass = conv.hasUnread ? "border-2 border-red-500" : "";
        return (
          <div
            key={conv.userId}
            className={`p-3 rounded hover:bg-slate-800 hover:scale-105 transition duration-300 cursor-pointer bg-slate-700 shadow-xl ${borderClass}`}
            onClick={() => handleOpenConversation(conv.userId)}
          >
            <p className="font-semibold">{conv.username}</p>
            <p className="text-sm text-gray-400 truncate">{conv.lastMessage}</p>
            <span className="text-xs text-gray-400">
              {new Date(conv.lastMessageDate).toLocaleString()}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default MessagesInboxList;
