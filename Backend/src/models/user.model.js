// models/user.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resumes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resume" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
