"use client";

import { useUser } from "@/providers/UserProvider";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { fetchData } from "./Dashboard";
import styles from "./Chat.module.css";
import { MessageType, ConnectionType, UserType } from "@/types/types";

const Chat = ({ target }: { target: number }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const ws = useRef<WebSocket | null>(null);
  const connectionId = useRef<Number | null>(null);
  const [connection, setConnection] = useState<ConnectionType | undefined>();
  const [userData, setUserData] = useState<UserType[] | undefined>();
  const [targetUserData, setTargetUserData] = useState<
    UserType[] | undefined
  >();
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  if (!user) {
    setLoading(true);
    router.push("/");
  }

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const connections: ConnectionType[] = await fetchData(
          `http://127.0.0.1:3001/connections/${user}`,
        );
        const connectionData = connections.filter(
          (connection) => connection.userId === target,
        )?.[0];
        connectionId.current = connectionData.connectionId;
        setConnection(connectionData);
      } catch (error) {
        console.error("Error fetching connections or user data:", error);
      } finally {
        //   setLoading(false); // Set loading to false once fetching is done
      }
    };

    const fetchUser = async () => {
      try {
        const userData: UserType[] = await fetchData(
          `http://127.0.0.1:3001/user/${user}`,
        );

        setUserData(userData);
      } catch (error) {
        console.error("Error fetching connections or user data:", error);
      }
    };

    const fetchTargetUser = async () => {
      try {
        const targetUserData: UserType[] = await fetchData(
          `http://127.0.0.1:3001/user/${target}`,
        );

        setTargetUserData(targetUserData);
      } catch (error) {
        console.error("Error fetching connections or user data:", error);
      }
    };

    const fetchMessages = async () => {
      try {
        const messages = await fetchData(
          `http://127.0.0.1:3001/messages/${connectionId.current}`,
        );

        setMessages(messages);
      } catch (error) {
        console.error("Error fetching connections or user data:", error);
      }
    };

    const initializeData = async () => {
      await fetchConnections(); // Ensure connectionId is fetched
      await fetchMessages(); // Only fetch messages after connectionId is set
      user && fetchUser(); // Fetch user data in parallel
      target && fetchTargetUser(); // Fetch target user data in parallel
    };

    initializeData();
    // Create a WebSocket connection to the Express server
    ws.current = new WebSocket("ws://localhost:3001");

    ws.current.onopen = () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: "connect", userId: user }));
      }
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      setMessages((prevChat) => [...prevChat, message]);
    };
    setLoading(false);
  }, [user]);

  function isOnlyEmoji(message: string) {
    // Check if the message is empty
    if (!message) {
      return false;
    }
    // Remove whitespace from the start and end
    message = message.trim();

    // Regex to match emoji characters
    const emojiRegex = /^[\p{Emoji}]+$/u;
    return emojiRegex.test(message);
  }

  const sendMessage = () => {
    if (ws.current && input.trim() && user !== null) {
      const message: MessageType = {
        type: "message",
        senderId: user,
        targetId: target,
        content: input,
        connectionId: connectionId.current,
      };

      setMessages((prevChat) => [...prevChat, message]);
      ws.current.send(JSON.stringify(message));
      setInput("");
    }
  };

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const connectionDate = connection && new Date(connection.createdAt);

  // Define the options for formatting the date
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric", // 'numeric' or '2-digit'
    month: "long", // 'numeric', '2-digit', 'long', 'short', 'narrow'
    day: "numeric", // 'numeric' or '2-digit'
  };

  // Format the date using the toLocaleDateString() method
  const formattedConnectionDate =
    connectionDate && connectionDate.toLocaleDateString("en-US", options);

  const connectionTimeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const formattedConnectionTime =
    connectionDate &&
    connectionDate.toLocaleTimeString("en-US", connectionTimeOptions);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className={styles.chatContainer}>
      {userData?.[0]?.name}
      <div className={styles.chatWindow}>
        <div>
          <p>
            <strong>{formattedConnectionDate}</strong>&nbsp;
            {formattedConnectionTime}
          </p>
          <p>You matched &#127880;</p>
        </div>

        {messages.map((msg, index) => {
          if (msg.type !== "connect") {
            return (
              <div
                key={index}
                className={`${styles.message} ${msg.senderId === user ? styles.user : styles.sender} ${isOnlyEmoji(msg.content) ? styles.emoji : ""}`}
              >
                {msg.content}
              </div>
            );
          }
        })}
      </div>
      <input
        type="text"
        value={input}
        className={styles.text}
        onChange={(e) => setInput(e.target.value)}
        placeholder={`Message ${targetUserData?.[0]?.name}`}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default Chat;
