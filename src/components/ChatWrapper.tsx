import { useParams } from "react-router-dom";
import MessagesInbox from "./MessagesInbox";

interface ChatWrapperProps {
  currentUserId: string | null;
}

const ChatWrapper: React.FC<ChatWrapperProps> = ({ currentUserId }) => {
  const { otherUserId } = useParams<{ otherUserId: string }>();

  if (!otherUserId) return <p>Error: usuario no encontrado</p>;

  return (
    <MessagesInbox currentUserId={currentUserId} otherUserId={otherUserId} />
  );
};

export default ChatWrapper;
