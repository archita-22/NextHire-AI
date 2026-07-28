import cloudinary from "../config/cloudinary.js";
import Resume from "../models/Resume.js";
import { PDFParse } from "pdf-parse";

export const uploadResume = async (req, res) => {
  try {
    // Check file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file",
      });
    }

    console.log("File received:", req.file.originalname, req.file.size, "bytes");
    console.log("Buffer length:", req.file.buffer.length);

    // Extract text from PDF buffer
    let extractedText = "";
    try {
      const parser = new PDFParse({ data: req.file.buffer });
      const result = await parser.getText();
      extractedText = result.text;
    } catch (parseError) {
      console.log("PDF parse error:", parseError.message);
      return res.status(400).json({
        success: false,
        message: "Couldn't read this PDF. Try re-saving/exporting it and upload again.",
      });
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "resumes",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    // Save to DB
    const resume = await Resume.create({
      user: req.user.id,
      fileUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      fileName: req.file.originalname,
      extractedText,
    });

    res.status(201).json({
      success: true,
      message: "Resume uploaded successfully",
      resume,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get all resumes of logged-in user
export const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      resumes,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};