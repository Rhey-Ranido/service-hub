// library imports
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// middlewares imports
import requestLogger from "./middlewares/requestLogger.js";

// imported routes
import authRoutes from "./routes/auth.route.js";
import protectedRoutes from "./routes/protected.route.js";
import providerRoutes from "./routes/provider.route.js";
import serviceRoutes from "./routes/service.route.js";
import providerReviewRoutes from "./routes/providerReview.route.js";

dotenv.config();
const app = express();
app.use(express.json());

// middlewares
app.use(requestLogger);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/reviewProvider", providerReviewRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

export default app;
