import Resume from "../models/Resume.js";
import { analyzeResume } from "../services/aiService.js";

export const analyzeResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;

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

    // AI se analysis karwao
    const analysisResult = await analyzeResume(resume.extractedText);

    // Result DB mein save karo
    resume.analysis = analysisResult;
    await resume.save();

    res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      analysis: analysisResult,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};