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

export const DeleteResume = async (req, res) => {
  try {
    const { id } = req.params;

    const resume = await Resume.findById(id);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (resume.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this resume" });
    }

    await Resume.findByIdAndDelete(id);

    await User.findByIdAndUpdate(req.user.id, {
      $pull: { resumes: id },
    });

    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (err) {
    console.error("Error deleting resume:", err.message);
    res.status(500).json({ message: "Server error while deleting resume" });
  }
};

export const UpdateResumeTitle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, creationType } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: "Resume title is required" });
    }
    if (!creationType?.trim()) {
      return res
        .status(400)
        .json({ message: "Resume creationType is required" });
    }

    const resume = await Resume.findById(id);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (resume.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this resume" });
    }

    resume.title = title.trim();
    resume.creationType = creationType.trim();
    const updatedResume = await resume.save();

    res.status(200).json({
      message: "Resume title updated successfully",
      resume: updatedResume,
    });
  } catch (err) {
    console.error("Error updating resume title:", err.message);
    res.status(500).json({ message: "Server error while updating title" });
  }
};
