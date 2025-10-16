import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";
import { JWT_SECRET } from "../config/env.js";
dotenv.config();

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

   const payload = { id: user._id };
    jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

   const payload = { id: user._id };
    jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const getUserData = async (req, res) => {
  try {
    console.log(
      "🔍 [getUserData] Full user object from token:",
      JSON.stringify(req.user, null, 2)
    );

    // Try multiple possible ID locations
    let userId =
      req.user.id || req.user.user?.id || req.user._id || req.user.user?._id;

    console.log("🔍 [getUserData] Trying to find user with ID:", userId);

    if (!userId) {
      return res.status(400).json({
        message: "No user ID found in token",
        tokenContents: req.user,
      });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found in database",
        searchedId: userId,
      });
    }

    res.status(200).json({
      message: "User data retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
};