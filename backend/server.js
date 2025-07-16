// library imports
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";

// socket.io import
import { initSocket } from "./socket.js";

// middlewares imports
import requestLogger from "./middlewares/requestLogger.js";

// imported routes
import authRoutes from "./routes/auth.route.js";
import protectedRoutes from "./routes/protected.route.js";
import providerRoutes from "./routes/provider.route.js";
import serviceRoutes from "./routes/service.route.js";
import providerReviewRoutes from "./routes/providerReview.route.js";
import serviceReviewRoutes from "./routes/serviceReview.route.js";
import chatRoutes from "./routes/chat.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();
const app = express();
app.use(express.json());

// middlewares
app.use(requestLogger);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/reviewProvider", providerReviewRoutes);
app.use("/api/reviewService", serviceReviewRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// MongoDB + HTTP server + Socket.IO
const server = http.createServer(app);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    // Start HTTP server
    server.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });

    // Initialize Socket.IO
    initSocket(server);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

export default app;
