import { isOnlyEmoji } from "@/utils/utils";
import styles from "./Message.module.css";
import { MessageType } from "@/types/types";

export const Message = ({
  message,
  user,
  grouped,
}: {
  message: MessageType;
  user: number | null;
  grouped: boolean;
}) => {
  return (
    <>
      <div className={getClassName(message, user, grouped)}>
        {message.content}
      </div>
    </>
  );
};

const getClassName = (
  message: MessageType,
  user: number | null,
  grouped: boolean,
) => {
  return `${styles.message} ${
    message.senderId === user ? styles.user : styles.sender
  } ${isOnlyEmoji(message.content) ? styles.emoji : ""} ${
    grouped ? styles.grouped : ""
  }`;
};
