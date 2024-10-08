export const isOnlyEmoji = (message: string) => {
  const trimmedMessage = message.trim();
  return trimmedMessage && /^[\p{Emoji}]+$/u.test(trimmedMessage);
};

export const handleKeyDown = (
  event: React.KeyboardEvent<HTMLInputElement>,
  func: () => void,
) => {
  if (event.key === "Enter") {
    func();
  }
};

export const formattedDate = (
  date?: string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
) => (date ? new Date(date).toLocaleDateString("en-US", options) : "");

export const formattedTime = (
  date?: string,
  options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  },
) => (date ? new Date(date).toLocaleTimeString("en-US", options) : "");

export const dateToTimestamp = (date: string) =>
  Math.floor(new Date(date).getTime() / 1000);
