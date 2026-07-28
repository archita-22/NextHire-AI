import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String, // Cloudinary ka file identifier (delete karne ke liye chahiye hoga baad mein)
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    extractedText: {
      type: String,
      default: "",
    },

    analysis: {
      atsScore: { type: Number, default: null },
      skills: { type: [String], default: [] },
      missingSkills: { type: [String], default: [] },
      suggestions: { type: [String], default: [] },
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;