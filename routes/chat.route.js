import { Router } from "express";
import {
  verifyToken,
  requireVerifiedEmail,
} from "../middlewares/auth.middleware.js";

import { createChat } from "../controllers/chat.controller.js";

const router = Router();

// Apply authentication middlewares to all routes
router.use(verifyToken, requireVerifiedEmail);

//create new chat
router.get("/new", createChat);

export default router;
