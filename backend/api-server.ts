import { PrismaClient, Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { Request, Response, Express } from "express";

export const apiServer = ({
  app,
  prisma,
}: {
  app: Express;
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
}) => {
  // Health check route
  app.get("/healthcheck", (req: Request, res: Response) => {
    res.send("Backend server is running!");
  });

  // Get all users
  app.get("/users", async (req: Request, res: Response) => {
    try {
      const allUsers = await prisma.user.findMany();
      // ransform the output to include userId instead of id
      const transformedUsers = allUsers.map((user) => ({
        userId: user.id, // Rename id to userId
        ...user, // Spread the rest of the user properties
      }));

      res.send(transformedUsers);
    } catch (error) {
      handleError(res, error, "Error fetching users");
    }
  });

  // Get a specific user by ID
  app.get("/user/:id", async (req: Request<{ id: string }>, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).send({ error: "Invalid ID" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (user) {
        res.send({ userId: user.id, ...user });
      } else {
        res.status(404).send({ error: "User not found" });
      }
    } catch (error) {
      handleError(res, error, "Error fetching user");
    }
  });

  // Get connections by user ID
  app.get(
    "/connections/:id",
    async (req: Request<{ id: string }>, res: Response) => {
      const id = Number(req.params.id);

      // Validate the ID
      if (isNaN(id)) {
        return res.status(400).send({ error: "Invalid ID provided" });
      }

      try {
        const connections = await prisma.connection.findMany({
          where: {
            OR: [{ userAId: id }, { userBId: id }],
          },
        });

        const mergedConnections = connections.map((connection) => {
          // Determine the userId to keep
          const userId =
            connection.userAId === id ? connection.userBId : connection.userAId;

          return {
            connectionId: connection.id,
            userId: userId,
            createdAt: connection.createdAt,
          };
        });

        // Send the merged connections
        return res.send(mergedConnections);
      } catch (error) {
        handleError(res, error, "Error fetching connections");
      }
    },
  );

  // Get messages for a connection by connection ID
  app.get(
    "/messages/:connectionId",
    async (req: Request<{ connectionId: string }>, res: Response) => {
      const connectionId = Number(req.params.connectionId);

      if (isNaN(connectionId)) {
        return res.status(400).send({ error: "Invalid connection ID" });
      }

      try {
        const messages = await prisma.message.findMany({
          where: { connectionId },
          orderBy: {
            createdAt: "asc",
          },
        });
        res.send(messages);
      } catch (error) {
        handleError(res, error, "Error fetching messages");
      }
    },
  );

  // Utility function to handle errors
  const handleError = (res: Response, error: unknown, message: string) => {
    console.error(message, error);
    res.status(500).send({ error: message });
  };
};
