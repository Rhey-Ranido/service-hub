import { Server } from "socket.io";

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // Replace with frontend URL in production
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  const connectedUsers = new Map();

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    socket.on("setup", (userData) => {
      if (!userData?._id) return;
      
      // Store user connection
      connectedUsers.set(userData._id, socket.id);
      socket.userId = userData._id;
      
      // Join user's personal room
      socket.join(userData._id);
      socket.emit("connected");
    });

    socket.on("join_chat", (chatId) => {
      if (!chatId) return;
      console.log("User joined chat:", chatId);
      socket.join(chatId);
    });

    socket.on("leave_chat", (chatId) => {
      if (!chatId) return;
      console.log("User left chat:", chatId);
      socket.leave(chatId);
    });

    socket.on("typing", (chatId) => {
      if (!chatId) return;
      socket.to(chatId).emit("typing");
    });

    socket.on("stop_typing", (chatId) => {
      if (!chatId) return;
      socket.to(chatId).emit("stop_typing");
    });

    socket.on("new_message", (message) => {
      const chat = message.chat;
      if (!chat?.users) return;

      // Broadcast to the chat room instead of individual users
      socket.to(chat._id).emit("message_received", message);

      // Also notify offline users in their personal rooms
      chat.users.forEach((user) => {
        if (user._id === message.sender._id) return;
        
        // Check if user is connected to a different socket
        const userSocketId = connectedUsers.get(user._id);
        if (!userSocketId || userSocketId === socket.id) return;
        
        socket.to(user._id).emit("message_notification", {
          chatId: chat._id,
          message: message
        });
      });
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
      
      // Remove user from connected users
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
      }
    });
  });

  return io;
};
