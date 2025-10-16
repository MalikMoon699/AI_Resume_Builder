import express from "express";
import { signUp, login, getUserData } from "../controllers/auth.controller.js";
import {verifyToken} from "../middlewares/auth.middleware.js"

const router = express.Router();

router.post("/register", signUp);
router.post("/login", login);
router.get("/user", verifyToken, getUserData);

router.get("/debug", verifyToken, (req, res) => {
  console.log("🔍 [Debug] Full req.user:", req.user);
  res.json({
    message: "Debug endpoint",
    userFromToken: req.user,
    userId: req.user.id,
    userUserId: req.user.user?.id,
  });
});

export default router;
