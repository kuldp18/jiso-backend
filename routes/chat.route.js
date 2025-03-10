import { Router } from "express";
import {
  verifyToken,
  requireVerifiedEmail,
} from "../middlewares/auth.middleware.js";

import {
  createChat,
  getChat,
  sendMessage,
} from "../controllers/chat.controller.js";

const router = Router();

// Apply authentication middlewares to all routes
router.use(verifyToken, requireVerifiedEmail);

router.get("/new", createChat); // create new chat
router.get("/:chatId", getChat); // get chat by id
router.post("/:chatId/send", sendMessage); // send new message to AI

export default router;
