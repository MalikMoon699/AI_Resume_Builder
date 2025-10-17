import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    title: { type: String },

    summary: { type: String },

    personalDetails: {
      fullName: { type: String },
      email: { type: String },
      number: { type: String },
      location: { type: String },
      profession: { type: String },
      personalWebsite: { type: String },
    },

    experience: [
      {
        companyName: { type: String },
        jobTitle: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        currentlyWorking: { type: Boolean, default: false },
        jobDescription: { type: String },
      },
    ],

    education: [
      {
        institutionName: { type: String },
        degree: { type: String },
        fieldOfStudy: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        currentlyLearning: { type: Boolean, default: false },
      },
    ],

    projects: [
      {
        projectName: { type: String },
        projectType: { type: String },
        projectDescription: { type: String },
        projectLink: { type: String },
      },
    ],

    skills: [{ type: String }],

    languages: [
      {
        language: { type: String },
        proficiency: { type: Number, min: 0, max: 100 },
      },
    ],

    hobbies: [{ type: String }],

    awards: [
      {
        title: { type: String },
        organization: { type: String },
        year: { type: String },
        description: { type: String },
      },
    ],

    accentColor: { type: String, default: "#00af4e" },
    resumeType: {
      type: String,
      enum: ["Modern", "Classic"],
      default: "Modern",
    },
  },
  { timestamps: true },
  { strict: false }
);

export default mongoose.model("Resume", ResumeSchema);
