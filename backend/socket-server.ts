import WebSocket from "ws";
import http from "http";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export const socketServer = ({
  server,
  prisma,
}: {
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
}) => {
  // Initialise WebSocket server
  const wss = new WebSocket.Server({ server });

  // Object to store connected users by their IDs
  const users: Record<string, WebSocket> = {};

  // Handle WebSocket connections
  wss.on("connection", (ws) => {
    console.log("New client connected");

    ws.on("message", async (message: string) => {
      const parsedMessage = JSON.parse(message);
      const { type, senderId, targetId, content, connectionId, createdAt } =
        parsedMessage;

      if (type === "connect") {
        users[senderId] = ws; // Set user in object
        console.log(`User ${senderId} connected`);
      } else if (type === "message") {
        // Handle messages between users
        const newMessage = await prisma.message.create({
          data: {
            content,
            senderId,
            targetId,
            connectionId,
          },
        });

        const sendToUser = (targetId: string, data: any) => {
          const client = users[targetId]; // Get client from object
          if (client && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        };

        if (targetId && users[targetId]) {
          // Check for target user in object
          sendToUser(targetId, { senderId, targetId, content, createdAt });
          console.log(`Message from ${senderId} to ${targetId}: ${content}`);
        } else {
          console.log(`Target user ${targetId} not connected`);
        }
      }
    });

    ws.on("error", (error) => {
      console.error("WebSocket error: ", error);
    });

    ws.on("close", () => {
      for (const senderId in users) {
        if (users[senderId] === ws) {
          delete users[senderId]; // Delete user from object
          console.log(`User ${senderId} disconnected`);
          break; // Exit loop after finding the user
        }
      }
    });
  });
};
