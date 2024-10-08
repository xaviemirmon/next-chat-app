"use client";

import { useUser } from "@/providers/UserProvider";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { fetchData } from "@/lib/fetchData";
import styles from "./Chat.module.css";
import { MessageType, ConnectionType, UserType } from "@/types/types";
import { Spinner } from "@/components/Spinner";
import { dateToTimestamp, formattedDate, formattedTime } from "@/utils/utils";
import { Message } from "@/components/Message";
import { ChatFooter } from "./ChatFooter";
import { ChatHeader } from "./ChatHeader";

const Chat = ({ target, apiUrl }: { target: number; apiUrl: string }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const ws = useRef<WebSocket | null>(null);
  const connectionId = useRef<number | null>(null);
  const [connection, setConnection] = useState<ConnectionType | undefined>();
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
        const [connections, targetUserData] = await Promise.all([
          fetchData(`http://${apiUrl}/connections/${user}`),
          fetchData(`http://${apiUrl}/user/${target}`),
        ]);

        const connectionData = connections.find(
          (connection: ConnectionType) => connection.userId === target,
        );
        if (connectionData) {
          connectionId.current = connectionData.connectionId;
          setConnection(connectionData);
          const messagesData = await fetchData(
            `http://${apiUrl}/messages/${connectionId.current}`,
          );
          setMessages(messagesData);
        }

        setTargetUserData(targetUserData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();

    // Initialise WebSocket connection
    ws.current = new WebSocket(`ws://${apiUrl}`);

    ws.current.onopen = () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: "connect", senderId: user }));
      }
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };
  }, [user, target, apiUrl]);

  if (loading) return <Spinner />;

  return (
    <>
      <ChatHeader
        userName={targetUserData?.name}
        userId={targetUserData?.userId}
        setLoading={setLoading}
        router={router}
      />
      <div className={styles.container}>
        <div className={styles.chatWindow}>
          <div className={styles.messages}>
            <p className={`${styles.center} ${styles.time}`}>
              <strong>{formattedDate(connection?.createdAt)}</strong>&nbsp;
              {formattedTime(connection?.createdAt)}
            </p>
            <p className={`${styles.center} ${styles.matched}`}>
              You matched &#127880;
            </p>
          </div>
          {messages.map((message, index) => {
            if (message.type === "connect") return null;

            let olderThanHour = false;
            let grouped = false;

            const currentMessageTimestamp =
              message?.createdAt && dateToTimestamp(message?.createdAt);
            let prevMessageTimestamp = null;
            if (index > 0) {
              prevMessageTimestamp = dateToTimestamp(
                messages[index - 1]?.createdAt ?? "",
              );
            }

            if (prevMessageTimestamp && currentMessageTimestamp) {
              grouped = currentMessageTimestamp - prevMessageTimestamp <= 20;
              olderThanHour =
                currentMessageTimestamp - prevMessageTimestamp >= 3600;
            }
            return (
              <div className={styles.message} key={message.createdAt}>
                {olderThanHour && (
                  <p className={`${styles.center} ${styles.time}`}>
                    <strong>{formattedDate(message?.createdAt)}</strong>&nbsp;
                    {formattedTime(message?.createdAt)}
                  </p>
                )}
                <Message message={message} user={user} grouped={grouped} />
              </div>
            );
          })}
        </div>
      </div>
      <ChatFooter
        input={input}
        setInput={setInput}
        targetUserData={targetUserData}
        setMessages={setMessages}
        ws={ws}
        connectionId={connectionId}
        user={user}
        target={target}
      />
    </>
  );
};

export default Chat;
