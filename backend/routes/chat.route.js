import express from "express";
import { accessChat, fetchChats } from "../controllers/chat.Controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, accessChat);
router.get("/", protect, fetchChats);

export default router;
