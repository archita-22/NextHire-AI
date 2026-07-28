import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    jobRole: {
      type: String,
      required: true,
    },

    questions: {
      type: [String],
      default: [],
    },

    answers: {
      type: [String],
      default: [],
    },

    feedback: {
      type: [String], // har answer ke liye ek feedback
      default: [],
    },

    overallScore: {
      type: Number,
      default: null,
    },

    status: {
      type: String,
      enum: ["questions_generated", "completed"],
      default: "questions_generated",
    },
  },
  {
    timestamps: true,
  }
);

const InterviewSession = mongoose.model(
  "InterviewSession",
  interviewSessionSchema
);

export default InterviewSession;