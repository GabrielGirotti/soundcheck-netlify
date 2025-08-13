// import { useState, useEffect, useRef } from "react";
// import { useParams } from "react-router-dom";
// import Spinner from "./Spinner";
// import { toast } from "react-hot-toast";

// const Chat = () => {
//   const { userId } = useParams();
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const API_URL = import.meta.env.VITE_API_URL;

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await fetch(`${API_URL}/messages/with/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         if (!res.ok) throw new Error();
//         const data = await res.json();
//         setMessages(data);
//       } catch {
//         toast.error("Error al cargar chat");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMessages();
//   }, [userId]);

//   const sendMessage = async () => {
//     if (!newMessage.trim()) return;

//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_URL}/messages`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({ receiver: userId, content: newMessage })
//       });
//       if (!res.ok) throw new Error();
//       const sentMsg = await res.json();
//       setMessages((prev) => [...prev, sentMsg]);
//       setNewMessage("");
//       messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     } catch {
//       toast.error("No se pudo enviar el mensaje");
//     }
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="p-4 flex flex-col h-screen">
//       <div className="flex-1 overflow-y-auto mb-4">
//         {messages.map((msg: any, idx) => (
//           <div
//             key={idx}
//             className={`mb-2 p-2 rounded max-w-xs ${
//               msg.sender._id === localStorage.getItem("userId")
//                 ? "bg-orange-500 ml-auto text-white"
//                 : "bg-slate-700 text-white"
//             }`}
//           >
//             {msg.content}
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="flex gap-2">
//         <input
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Escribe un mensaje..."
//           className="flex-1 p-2 rounded bg-slate-800 text-white border border-gray-600"
//         />
//         <button
//           onClick={sendMessage}
//           className="px-4 py-2 rounded bg-gradient-to-r from-orange-400 to-pink-600 text-white"
//         >
//           Enviar
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chat;
