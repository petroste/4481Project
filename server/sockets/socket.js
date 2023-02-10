const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const rateLimit = require("express-rate-limit");
const { celebrate, Joi } = require("celebrate");

//Prevent Flooding
const messageLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests
  message: "Too many messages, please try again later"
});

// Message validation using Celebrate library
const validateMessage = celebrate({
  body: Joi.object().keys({
    message: Joi.string().required()
  })
});

server.listen(4001, () => {
  console.log("Socket.io server listening on port 4001");
});

let users = new Map();

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

//tamplate User identification, in Memeory, Can switch to Redis to maintain better perf and coherence 
//Also Consider SQL DBs for Session Persistence
  socket.on("identify", (userId) => {
    console.log("User", userId, "identified as", socket.id);

    // Store the user's socket ID in memory
    users.set(userId, socket.id);
  });

  socket.on("start-conversation", (targetUserId) => {
    console.log("Received request to start conversation with", targetUserId);

    // Get the target user's socket ID from memory
    const targetSocketId = users.get(targetUserId);

    if (targetSocketId) {
      // Join the target user's socket room
      socket.join(targetSocketId);

      // call out event back to the client to confirm that the conversation has started
      socket.emit("conversation-started", targetUserId);
    } else {
      console.error("Target user not found");
    }
  });

  socket.on("send-message", validateMessage, messageLimiter, (message) => {
    console.log("Received message:", message);

    // Get the target user's socket ID from memory
    const targetSocketId = users.get(targetUserId);

    if (targetSocketId) {
      // Broadcast the message to the target user
      socket.broadcast.to(targetSocketId).emit("received-message", {
        sender: socket.id,
        message: message.message
      });
    } else {
      console.error("Target user not found");
    }
  });
});