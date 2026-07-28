import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  matchResumeWithJob,
  getUserJobMatches,
} from "../controllers/jobmatchController.js"; // Fixed: lowercase 'm'

const router = express.Router();

router.post("/match", authMiddleware, matchResumeWithJob);
router.get("/my-matches", authMiddleware, getUserJobMatches);

export default router;
