import express from "express";
import {
  signup,
  login,
  getProfile,
} from "../controllers/authController.js";
import { forgotPassword, resetPassword } from "../controllers/authController.js";
import { changePassword } from "../controllers/authController.js";



import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Authentication
router.post("/signup", signup);
router.post("/login", login);

// Protected Route
router.get("/profile", authMiddleware, getProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/change-password", authMiddleware, changePassword);

export default router;