import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { createMoodEntry } from "../controllers/mood.controller.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

router.post("/create", createMoodEntry);

export default router;
