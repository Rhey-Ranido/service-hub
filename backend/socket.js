import { Server } from "socket.io";

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // Replace with frontend URL in production
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });

    socket.on("join_chat", (chatId) => {
      socket.join(chatId);
    });

    socket.on("typing", (chatId) => socket.to(chatId).emit("typing"));
    socket.on("stop_typing", (chatId) => socket.to(chatId).emit("stop_typing"));

    socket.on("new_message", (message) => {
      const chat = message.chat;
      if (!chat?.users) return;

      chat.users.forEach((user) => {
        if (user._id === message.sender._id) return;
        socket.to(user._id).emit("message_received", message);
      });
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });

  return io;
};
