import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  GetResume,
  CreateResume,
  UpdateResume,
  GetResumesByUser,
  DeleteResume,
  UpdateResumeTitle,
} from "../controllers/resume.controller.js";

const router = express.Router();

router.get("/user/:id", verifyToken, GetResumesByUser);
router.get("/get/:id", GetResume);
router.post("/create", verifyToken, CreateResume);
router.post("/update/:id", verifyToken, UpdateResume);
router.delete("/delete/:id", verifyToken, DeleteResume);
router.post("/update-title/:id", verifyToken, UpdateResumeTitle);

export default router;