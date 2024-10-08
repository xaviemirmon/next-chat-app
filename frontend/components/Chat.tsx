"use client";

import { useUser } from "@/providers/UserProvider";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { fetchData } from "@/lib/fetchData";
import styles from "./Chat.module.css";
import { MessageType, ConnectionType, UserType } from "@/types/types";
import { Spinner } from "@/components/Spinner";
import { isOnlyEmoji } from "@/utils/utils";

const Chat = ({ target }: { target: number }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const ws = useRef<WebSocket | null>(null);
  const connectionId = useRef<number | null>(null);
  const [connection, setConnection] = useState<ConnectionType | undefined>();
  const [userData, setUserData] = useState<UserType | undefined>();
  const [targetUserData, setTargetUserData] = useState<UserType | undefined>();
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  // Redirect if no user
  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    const getData = async () => {
      if (!user) return;

      // Initialise data from backend API
      try {
        const [connections, userData, targetUserData] = await Promise.all([
          fetchData(`http://127.0.0.1:3001/connections/${user}`),
          fetchData(`http://127.0.0.1:3001/user/${user}`),
          fetchData(`http://127.0.0.1:3001/user/${target}`),
        ]);

        const connectionData = connections.find(
          (connection: ConnectionType) => connection.userId === target,
        );
        if (connectionData) {
          connectionId.current = connectionData.connectionId;
          setConnection(connectionData);
          const messagesData = await fetchData(
            `http://127.0.0.1:3001/messages/${connectionId.current}`,
          );
          setMessages(messagesData);
        }

        setUserData(userData);
        setTargetUserData(targetUserData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();

    // Initialise WebSocket connection
    ws.current = new WebSocket("ws://localhost:3001");

    ws.current.onopen = () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: "connect", userId: user }));
      }
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };
  }, [user, target]);

  const sendMessage = () => {
    if (ws.current && input.trim() && user && connectionId.current) {
      const message: MessageType = {
        type: "message",
        senderId: user,
        targetId: target,
        content: input,
        connectionId: connectionId.current,
      };

      setMessages((prevMessages) => [...prevMessages, message]);
      ws.current.send(JSON.stringify(message));
      setInput("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const formattedConnectionDate = connection
    ? new Date(connection.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const formattedConnectionTime = connection
    ? new Date(connection.createdAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  if (loading) return <Spinner />;

  return (
    <div className={styles.container}>
      {userData?.name}
      <div className={styles.chatWindow}>
        <div>
          <p>
            <strong>{formattedConnectionDate}</strong>&nbsp;
            {formattedConnectionTime}
          </p>
          <p>You matched &#127880;</p>
        </div>
        {messages.map(
          (message, index) =>
            message.type !== "connect" && (
              <div
                key={index}
                className={`${styles.message} ${message.senderId === user ? styles.user : styles.sender} ${isOnlyEmoji(message.content) ? styles.emoji : ""}`}
              >
                {message.content}
              </div>
            ),
        )}
      </div>
      <input
        type="text"
        value={input}
        className={styles.text}
        onChange={(e) => setInput(e.target.value)}
        placeholder={`Message ${targetUserData?.name}`}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default Chat;
