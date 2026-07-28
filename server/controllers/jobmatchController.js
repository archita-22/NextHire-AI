import Resume from "../models/resume.js"; // Fixed: lowercase 'r'
import JobMatch from "../models/jobMatch.js"; // Fixed: lowercase 'j'
import { compareResumeWithJob } from "../services/aiservice.js"; // Fixed: lowercase 's'

export const matchResumeWithJob = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: "resumeId and jobDescription are required",
      });
    }

    // Resume nikaalo aur confirm karo yeh isi user ka hai
    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // AI se comparison karwao
    const matchResult = await compareResumeWithJob(
      resume.extractedText,
      jobDescription
    );

    // Result DB mein save karo
    const jobMatch = await JobMatch.create({
      user: req.user.id,
      resume: resume._id,
      jobDescription,
      matchScore: matchResult.matchScore,
      matchedSkills: matchResult.matchedSkills,
      missingSkills: matchResult.missingSkills,
      suggestions: matchResult.suggestions,
    });

    res.status(201).json({
      success: true,
      message: "Job match analyzed successfully",
      jobMatch,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get all job matches of logged-in user
export const getUserJobMatches = async (req, res) => {
  try {
    const jobMatches = await JobMatch.find({ user: req.user.id })
      .populate("resume", "fileName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      jobMatches,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
