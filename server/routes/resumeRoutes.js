import express from "express";
import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  uploadResume,
  getUserResumes,
} from "../controllers/resumeController.js";
import { analyzeResumeById } from "../controllers/analysisController.js";


const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  upload.single("resume"), // form-data field ka naam "resume" hona chahiye
  uploadResume
);

router.get("/my-resumes", authMiddleware, getUserResumes);
router.post("/:resumeId/analyze", authMiddleware, analyzeResumeById);

export default router;