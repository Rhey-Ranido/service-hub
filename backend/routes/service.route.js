import express from "express";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getAllServicesByProviderId,
} from "../controllers/service.controller.js";

import { protect, restrictTo } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.get("/by-provider/:providerId", getAllServicesByProviderId);

router.use(protect); // Auth required below

router.post("/", restrictTo("provider"), createService);
router.put("/:id", restrictTo("provider", "admin"), updateService);
router.delete("/:id", restrictTo("provider", "admin"), deleteService);

export default router;
