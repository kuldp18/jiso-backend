import { Router } from "express";
import {
  login,
  signup,
  logout,
  verifyEmail,
  forgotPassword,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", verifyToken, logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

export default router;
