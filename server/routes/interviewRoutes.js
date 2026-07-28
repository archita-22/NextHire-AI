import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  startInterview,
  submitAnswers,
  getInterviewHistory,
} from "../controllers/interviewController.js";

const router = express.Router();

router.post("/start", authMiddleware, startInterview);
router.post("/:sessionId/submit", authMiddleware, submitAnswers);
router.get("/history", authMiddleware, getInterviewHistory);

export default router;