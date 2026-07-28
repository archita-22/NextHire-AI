import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";

dotenv.config();

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.5-flash",
  temperature: 0.3,
});

export const analyzeResume = async (resumeText) => {
  const prompt = `
You are an expert resume reviewer and ATS (Applicant Tracking System) analyzer.

Analyze the following resume text and return ONLY a valid JSON object (no markdown, no backticks, no extra text) with this exact structure:

{
  "atsScore": <number between 0-100>,
  "skills": [<array of skills found in resume>],
  "missingSkills": [<array of commonly expected skills that seem missing for this role>],
  "suggestions": [<array of 3-5 specific improvement suggestions>]
}

Resume Text:
"""
${resumeText}
"""
`;

  const response = await model.invoke(prompt);

  let rawText = response.content.trim();
  rawText = rawText.replace(/```json|```/g, "").trim();

  try {
    const parsedResult = JSON.parse(rawText);
    return parsedResult;
  } catch (err) {
    throw new Error("Failed to parse AI response as JSON");
  }
};

export const compareResumeWithJob = async (resumeText, jobDescription) => {
  const prompt = `
You are an expert career advisor and ATS (Applicant Tracking System) analyzer.

Compare the following resume against the given job description and return ONLY a valid JSON object (no markdown, no backticks, no extra text) with this exact structure:

{
  "matchScore": <number between 0-100 representing how well the resume fits this job>,
  "matchedSkills": [<array of skills from resume that match the job requirements>],
  "missingSkills": [<array of skills/technologies mentioned in job description but missing from resume>],
  "suggestions": [<array of 3-5 specific suggestions to improve the resume for this job>]
}

Resume Text:
"""
${resumeText}
"""

Job Description:
"""
${jobDescription}
"""
`;

  const response = await model.invoke(prompt);

  let rawText = response.content.trim();
  rawText = rawText.replace(/```json|```/g, "").trim();

  try {
    const parsedResult = JSON.parse(rawText);
    return parsedResult;
  } catch (err) {
    throw new Error("Failed to parse AI response as JSON");
  }
};

// Questions generate karne ke liye
export const generateInterviewQuestions = async (resumeText, jobRole) => {
  const prompt = `
You are an expert technical interviewer.

Based on the following resume and target job role, generate exactly 7 relevant interview questions (mix of technical and behavioral, tailored to the candidate's skills and the job role).

Return ONLY a valid JSON object (no markdown, no backticks, no extra text) with this exact structure:

{
  "questions": [<array of exactly 7 question strings>]
}

Job Role: ${jobRole}

Resume Text:
"""
${resumeText}
"""
`;

  const response = await model.invoke(prompt);

  let rawText = response.content.trim();
  rawText = rawText.replace(/```json|```/g, "").trim();

  try {
    const parsedResult = JSON.parse(rawText);
    return parsedResult.questions;
  } catch (err) {
    throw new Error("Failed to parse AI response as JSON");
  }
};

// Answers evaluate karne ke liye
export const evaluateInterviewAnswers = async (questions, answers, jobRole) => {
  // Questions aur answers ko pair karke ek readable format mein prompt ke liye taiyaar karo
  const qaPairs = questions
    .map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || "No answer provided"}`)
    .join("\n\n");

  const prompt = `
You are an expert technical interviewer evaluating a candidate for the role of ${jobRole}.

Below are the interview questions and the candidate's answers. Evaluate each answer and provide constructive feedback, then give an overall score.

Return ONLY a valid JSON object (no markdown, no backticks, no extra text) with this exact structure:

{
  "feedback": [<array of feedback strings, one per question, in the same order>],
  "overallScore": <number between 0-100 representing overall interview performance>
}

${qaPairs}
`;

  const response = await model.invoke(prompt);

  let rawText = response.content.trim();
  rawText = rawText.replace(/```json|```/g, "").trim();

  try {
    const parsedResult = JSON.parse(rawText);
    return parsedResult;
  } catch (err) {
    throw new Error("Failed to parse AI response as JSON");
  }
};