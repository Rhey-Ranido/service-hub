// routes/provider.route.js
import express from "express";
import {
  createProvider,
  getAllProviders,
  getProviderById,
  updateProvider,
  deleteProvider,
  getMyProviderProfile,
} from "../controllers/provider.controller.js";

import { protect, restrictTo } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllProviders); // Now supports advanced filtering and search
router.get("/:id", getProviderById); // Now includes services and detailed info - Public access

// Protected routes
router.use(protect); // Auth required below
router.get("/me", getMyProviderProfile); // Must come before /:id
router.put("/me", updateProvider); // Must come before /:id
router.post("/", createProvider); // Creates provider profile and updates user role
router.delete("/:id", restrictTo("admin"), deleteProvider);

export default router;
