// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Store connected clients and their usernames
const clients = new Map(); // Map<WebSocket, { username: string }>

// Broadcast message to all connected clients
function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('New client connected');

  // Handle incoming messages
  ws.on('message', (data) => {
    const message = JSON.parse(data);

    switch (message.type) {
      case 'join':
        // Store username and notify others
        clients.set(ws, { username: message.username });
        broadcast({
          type: 'system',
          content: `${message.username} joined the chat`,
        });
        // Send updated user list
        broadcast({
          type: 'users',
          users: Array.from(clients.values()).map((client) => client.username),
        });
        break;

      case 'message':
        // Broadcast chat message
        broadcast({
          type: 'message',
          username: clients.get(ws).username,
          content: message.content,
          timestamp: new Date().toLocaleTimeString(),
        });
        break;
    }
  });

  // Handle client disconnection
  ws.on('close', () => {
    const username = clients.get(ws)?.username;
    if (username) {
      clients.delete(ws);
      broadcast({
        type: 'system',
        content: `${username} left the chat`,
      });
      // Update user list
      broadcast({
        type: 'users',
        users: Array.from(clients.values()).map((client) => client.username),
      });
    }
    console.log('Client disconnected');
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});