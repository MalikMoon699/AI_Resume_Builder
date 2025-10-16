import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  GetResume,
  CreateResume,
  UpdateResume,
  GetResumesByUser,
} from "../controllers/resume.controller.js";

const router = express.Router();

router.get("/user/:id", verifyToken, GetResumesByUser);
router.get("/get/:id", GetResume);
router.post("/create", verifyToken, CreateResume);
router.post("/update/:id", verifyToken, UpdateResume);

export default router;