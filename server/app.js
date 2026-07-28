import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import jobmatchRoutes from "./routes/jobmatchRoutes.js"; // Fixed: lowercase 'm'
import interviewRoutes from "./routes/interviewRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/jobmatch", jobmatchRoutes); // Fixed: variable name changed to lowercase 'm'
app.use("/api/interview", interviewRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("AI Career Prep Platform API is running 🚀");
});

export default app;
