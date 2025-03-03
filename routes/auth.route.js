import { Router } from "express";
import {
  login,
  signup,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refreshToken,
  checkAuth,
} from "../controllers/auth.controller.js";
import {
  verifyToken,
  requireVerifiedEmail,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", verifyToken, logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", verifyToken, forgotPassword);
router.post("/reset-password/:token", verifyToken, resetPassword);
router.post("/refresh", refreshToken);

router.get("/protected", verifyToken, requireVerifiedEmail, (req, res) => {
  return res.send("protected");
});

router.post("/check-auth", verifyToken, checkAuth);

export default router;
