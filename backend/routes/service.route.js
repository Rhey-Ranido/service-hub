import express from "express";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getAllServicesByProviderId,
  getMyServices,
  getTopRatedServices,
} from "../controllers/service.controller.js";

import { protect, restrictTo } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/top-rated", getTopRatedServices); // Get top 3 services by rating
router.get("/", getAllServices); // Now supports advanced filtering and search
router.get("/by-provider/:providerId", getAllServicesByProviderId);
router.get("/:id", getServiceById); // Now includes view tracking and detailed info

// Protected routes
router.use(protect); // Auth required below
router.get("/provider/me", getMyServices); // Get authenticated provider's services
router.post("/", createService); // Now checks if user is a provider
router.put("/:id", updateService);
router.delete("/:id", deleteService);

export default router;
