import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  createJournalTheme,
  createMoodTheme,
  createUserContext,
  getUserContext,
} from "../controllers/userContext.controller.js";

const router = Router();

router.use(verifyToken);

// Create user context
router.post("/create", createUserContext);
// Get user context
router.get("/", getUserContext);

// Create journal theme
router.post("/ai/theme/journal", createJournalTheme);
// Create mood theme
router.post("/ai/theme/mood", createMoodTheme);

export default router;
