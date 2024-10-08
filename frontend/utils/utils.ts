export const isOnlyEmoji = (message: string) => {
  const trimmedMessage = message.trim();
  return trimmedMessage && /^[\p{Emoji}]+$/u.test(trimmedMessage);
};
