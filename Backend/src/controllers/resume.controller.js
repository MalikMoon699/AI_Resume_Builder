// src/controllers/auth.controller.js
import Resume from "../models/resume.model.js";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

export const GetResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json(resume);
  } catch (err) {
    console.error("Error fetching resume:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const GetResumesByUser = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.params.id });
    res.json(resumes);
  } catch (err) {
    console.error("Error fetching resumes:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const CreateResume = async (req, res) => {
  try {
    const { title } = req.body;

    const newResume = new Resume({
      title,
      user: req.user.id,
    });

    const savedResume = await newResume.save();

    await User.findByIdAndUpdate(req.user.id, {
      $push: { resumes: savedResume._id },
    });

    res.status(201).json(savedResume);
  } catch (err) {
    console.error("Error creating resume:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const UpdateResume = async (req, res) => {

  try {
    const { id } = req.params;

    const resume = await Resume.findById(id);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (resume.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this resume" });
    }

    const updatedResume = await Resume.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedResume);
  } catch (err) {
    console.error("Error updating resume:", err.message);
    res.status(500).json({ message: "Server error while updating resume" });
  }
};


// export const UpdateResume = async (req, res) => {
//   try {
//     const { id } = req.params;

//     console.log("📝 Incoming update for resume:", id);
//     console.log("📦 Request body keys:", Object.keys(req.body));
//     console.log("👤 Authenticated user:", req.user);

//     // Validate resume ID
//     if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({ message: "Invalid resume ID format" });
//     }

//     const resume = await Resume.findById(id);
//     if (!resume) {
//       return res.status(404).json({ message: "Resume not found" });
//     }

//     // Verify ownership
//     if (resume.user.toString() !== req.user.id) {
//       return res
//         .status(403)
//         .json({ message: "Unauthorized to update this resume" });
//     }

//     console.log(
//       "🔄 Updating resume with data:",
//       JSON.stringify(req.body, null, 2)
//     );

//     const updatedResume = await Resume.findByIdAndUpdate(
//       id,
//       { $set: req.body },
//       {
//         new: true,
//         runValidators: true,
//         context: "query",
//       }
//     );

//     console.log("✅ Resume successfully updated:", updatedResume._id);
//     res.status(200).json(updatedResume);
//   } catch (err) {
//     console.error("❌ Error updating resume:", err);
//     console.error("❌ Error details:", err.message);
//     console.error("❌ Error stack:", err.stack);

//     // Mongoose validation errors
//     if (err.name === "ValidationError") {
//       const errors = Object.values(err.errors).map((error) => error.message);
//       return res.status(400).json({
//         message: "Validation error",
//         errors,
//       });
//     }

//     res.status(500).json({
//       message: "Server error while updating resume",
//       error: err.message,
//     });
//   }
// };