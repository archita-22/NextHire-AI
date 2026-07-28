import Resume from "../models/resume.js"; // Fixed: lowercase 'r'
import InterviewSession from "../models/interviewSession.js"; // Fixed: lowercase 'i'
import {
  generateInterviewQuestions,
  evaluateInterviewAnswers,
} from "../services/aiservice.js"; // Fixed: lowercase 's'

// ============ START INTERVIEW (generate questions) ============
export const startInterview = async (req, res) => {
  try {
    const { resumeId, jobRole } = req.body;

    if (!resumeId || !jobRole) {
      return res.status(400).json({
        success: false,
        message: "resumeId and jobRole are required",
      });
    }

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

    const questions = await generateInterviewQuestions(
      resume.extractedText,
      jobRole
    );

    const session = await InterviewSession.create({
      user: req.user.id,
      resume: resume._id,
      jobRole,
      questions,
      status: "questions_generated",
    });

    res.status(201).json({
      success: true,
      message: "Interview questions generated",
      session,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ============ SUBMIT ANSWERS (evaluate) ============
export const submitAnswers = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "answers array is required",
      });
    }

    const session = await InterviewSession.findOne({
      _id: sessionId,
      user: req.user.id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found",
      });
    }

    const evaluation = await evaluateInterviewAnswers(
      session.questions,
      answers,
      session.jobRole
    );

    session.answers = answers;
    session.feedback = evaluation.feedback;
    session.overallScore = evaluation.overallScore;
    session.status = "completed";
    await session.save();

    res.status(200).json({
      success: true,
      message: "Interview evaluated successfully",
      session,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ============ GET USER'S INTERVIEW HISTORY ============
export const getInterviewHistory = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ user: req.user.id })
      .populate("resume", "fileName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
