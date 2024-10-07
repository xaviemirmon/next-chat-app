const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');
const { PrismaClient }= require('@prisma/client');
const prisma = new PrismaClient();

// Create the Express app
const app = express();
app.use(cors());

// Create an HTTP server for the WebSocket server to hook into
const server = require('http').createServer(app);


// Initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

// Store connected users by their IDs
const users = new Map();

// Function to send a message to a specific user
const sendToUser = (senderId, data) => {
    const client = users.get(senderId);
    if (client && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
    }
};

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('New client connected');

    // Listen for the first message to identify the user
    ws.on('message', async (message) => {
        const parsedMessage = JSON.parse(message);
        const { type, senderId, targetId, content, connectionId } = parsedMessage;

        if (type === 'connect') {
            // When a user sends their senderId, store the WebSocket connection
            users.set(senderId, ws);
            const client = users.get(senderId);
            console.log(`User ${senderId} connected`);
        } else if (type === 'message') {
            // Handle messages between users
            const newMessage = await prisma.message.create({
                data: {
                  content: content,
                  senderId: senderId,
                  targetId: targetId,
                  connectionId: connectionId,
                },
              });
            
            if (targetId && users.has(targetId)) {
                sendToUser(targetId, { senderId: senderId, target: targetId, content });
                sendToUser(senderId, {senderId: senderId, target: targetId, content });
                console.log(`Message from ${senderId} to ${targetId}: ${content}`);
            } else {
                console.log(`Target user ${targetId} not connected`);
            }
        }
    });

    // Handle errors
    ws.on('error', (error) => {
        console.error(`WebSocket error: ${error}`);
    });

    // Handle disconnection
    ws.on('close', () => {
        // Find the disconnected senderId and remove them from the users map
        for (let [senderId, client] of users.entries()) {
            if (client === ws) {
                users.delete(senderId);
                console.log(`User ${senderId} disconnected`);
                break;
            }
        }
    });
});

// Set up a basic route for health checking
app.get('/healthcheck', (req, res) => {
  res.send('Backend server is running!');
});

app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany();
    res.send(users)
})

app.get('/user/:id', async (req, res) => {
    if(req.params.id) {
        const user = await prisma.user.findMany({
            where: {
              id: Number(req.params.id), // Filter by id
            },
          });
        res.send(user)
    }
})

app.get('/connections/:id', async (req, res) => {
    const id = Number(req.params.id); // Convert to a number
  
    // Validate the ID
    if (!id || isNaN(id)) {
      return res.status(400).send({ error: 'Invalid ID provided' }); // Send an error response
    }
  
    try {
      const connections = await prisma.connection.findMany({
        where: {
          OR: [
            { userAId: id }, // Use the validated number
            { userBId: id }
          ]
        }
      });
  
      const mergedConnections = connections.map(connection => {
        // Determine the senderId to keep
        const userId = connection.userAId === id ? connection.userBId : connection.userAId;
  
        return {
          connectionId: connection.id,
          userId: userId,
          createdAt: connection.createdAt,
        };
      });
  
      res.send(mergedConnections); 
    } catch (error) {
      console.error('Error fetching connections:', error);
      res.status(500).send({ error: 'An error occurred while fetching connections' });
    }
  });

  app.get('/messages/:connectionId', async (req, res) => {
    const id = Number(req.params.connectionId); // Convert to a number
  
    // Validate the ID
    if (!id || isNaN(id)) {
      return res.status(400).send({ error: 'Invalid ID provided' }); // Send an error response
    }
  
    try {
      const messages = await prisma.message.findMany({
        where: {
            connectionId: id,
          },
      });
  
      res.send(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).send({ error: 'An error occurred while fetching messages' });
    }
  });

  
// Start the server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});