import { Router } from "express";
import {
  verifyToken,
  requireVerifiedEmail,
} from "../middlewares/auth.middleware.js";

import { createChat, sendMessage } from "../controllers/chat.controller.js";

const router = Router();

// Apply authentication middlewares to all routes
router.use(verifyToken, requireVerifiedEmail);

//create new chat
router.get("/new", createChat);
router.post("/:chatId/send", sendMessage);

export default router;
