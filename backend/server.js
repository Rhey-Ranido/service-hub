import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import providerRoutes from "./routes/provider.route.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/providers", providerRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
