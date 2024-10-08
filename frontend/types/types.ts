export type ConnectionType = {
  connectionId: number;
  userId: number;
  createdAt: string;
};

export type MessageType = {
  type: string;
  senderId: number;
  targetId: number;
  content: string;
  timestamp?: string;
  connectionId: number;
};

export type UserType = {
  userId: number;
  name: string;
  createdAt: string;
};
