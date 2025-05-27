import express from "express";
import { createProvider } from "../controllers/provider.controller.js";

const router = express.Router();

router.post("/", createProvider);

export default router;
