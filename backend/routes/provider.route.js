// routes/provider.route.js
import express from "express";
import {
  createProvider,
  getAllProviders,
  getProviderById,
  updateProvider,
  deleteProvider,
} from "../controllers/provider.controller.js";

import { protect, restrictTo } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllProviders);
router.get("/:id", getProviderById);

// Protected routes
router.post("/", protect, restrictTo("provider"), createProvider);
router.put("/me", protect, restrictTo("provider"), updateProvider);
router.delete("/:id", protect, restrictTo("provider", "admin"), deleteProvider);

export default router;
