import express from "express";

import cors from "cors";
import { PrismaClient } from "@prisma/client";
import http from "http";
import { socketServer } from "./socket-server";
import { apiServer } from "./api-server";

// Initialise Prisma and Express/Websocket server
const prisma = new PrismaClient();
const app = express();
app.use(cors());

const server = http.createServer(app);

socketServer({ server, prisma });

apiServer({ app, prisma });

// Start the server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
