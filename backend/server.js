// library imports
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import path from "path";

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
import uploadRoutes from "./routes/upload.route.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";

dotenv.config();
const app = express();

// CORS configuration - allow frontend to access backend
const getAllowedOrigins = () => {
  const origins = [
    "http://localhost:5173", 
    "http://localhost:3000", 
    "http://127.0.0.1:5173",
    "http://192.168.1.17:5173",  // Allow access from network IP
    "http://192.168.1.17:3000"   // Allow access from network IP
  ];
  
  // Add production origins from environment variables
  if (process.env.ALLOWED_ORIGINS) {
    const envOrigins = process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
    origins.push(...envOrigins);
  }
  
  // Add Vercel frontend URL if provided
  if (process.env.VERCEL_FRONTEND_URL) {
    origins.push(process.env.VERCEL_FRONTEND_URL);
  }
  
  return origins;
};

app.use(cors({
  origin: getAllowedOrigins(),
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// middlewares
app.use(requestLogger);

// Static file serving for uploaded images
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// MongoDB + HTTP server + Socket.IO
const server = http.createServer(app);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    // Start HTTP server - listen on all network interfaces
    server.listen(process.env.PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
      console.log(`🌐 Server accessible at:`);
      console.log(`   - Local: http://localhost:${process.env.PORT}`);
      console.log(`   - Network: http://192.168.1.17:${process.env.PORT}`);
      console.log(`📁 Static files served from: ${path.join(process.cwd(), 'uploads')}`);
    });

    // Initialize Socket.IO
    const io = initSocket(server);
    
    // Attach socket.io to request object BEFORE routes
    app.use((req, res, next) => {
      req.io = io;
      next();
    });

    // routes
    app.use("/api/auth", authRoutes);
    app.use("/api/protected", protectedRoutes);
    app.use("/api/providers", providerRoutes);
    app.use("/api/services", serviceRoutes);
    app.use("/api/reviewProvider", providerReviewRoutes);
    app.use("/api/reviewService", serviceReviewRoutes);
    app.use("/api/chat", chatRoutes);
    app.use("/api/message", messageRoutes);
    app.use("/api/upload", uploadRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/admin", adminRoutes);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

export default app;
