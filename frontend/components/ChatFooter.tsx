import { MessageType, UserType } from "@/types/types";
import { handleKeyDown } from "@/utils/utils";

import styles from "./ChatFooter.module.css";
import { Dispatch, MutableRefObject, SetStateAction } from "react";

export const ChatFooter = ({
  input,
  setInput,
  targetUserData,
  setMessages,
  ws,
  connectionId,
  user,
  target,
}: {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  targetUserData: UserType | undefined;
  setMessages: Dispatch<SetStateAction<MessageType[]>>;
  ws: MutableRefObject<WebSocket | null>;
  connectionId: MutableRefObject<number | null>;
  user: number | null;
  target: number;
}) => {
  const sendMessage = () => {
    if (ws.current && input.trim() && user && connectionId.current) {
      const message: MessageType = {
        type: "message",
        senderId: user,
        targetId: target,
        content: input,
        connectionId: connectionId.current,
        createdAt: new Date().toISOString(),
      };

      setMessages((prevMessages: MessageType[]) => [
        ...prevMessages,
        { createdAt: new Date().toISOString(), ...message },
      ]);
      ws.current.send(JSON.stringify(message));
      setInput("");
    }
  };
  return (
    <div className={styles.footer}>
      <input
        type="text"
        value={input}
        className={styles.input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={`Message ${targetUserData?.name}`}
        onKeyDown={(e) => handleKeyDown(e, sendMessage)}
      />
    </div>
  );
};
