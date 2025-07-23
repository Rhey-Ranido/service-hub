import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getUserProfile,
  updateUserProfile,
  updateUserEmail,
  changePassword,
  deleteUserAccount,
  updateAccountSettings
} from "../controllers/user.controller.js";

const router = express.Router();

// All user routes require authentication
router.use(protect);

// GET current user profile
router.get("/profile", getUserProfile);

// UPDATE user profile information (name, phone)
router.put("/profile", updateUserProfile);

// UPDATE user email (requires password verification)
router.put("/email", updateUserEmail);

// CHANGE password
router.put("/password", changePassword);

// UPDATE account settings/preferences
router.put("/settings", updateAccountSettings);

// DELETE user account (requires password and confirmation)
router.delete("/account", deleteUserAccount);

export default router;
