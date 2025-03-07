import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  createMoodEntry,
  fetchMoodEntries,
} from "../controllers/mood.controller.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

router.post("/create", createMoodEntry); // create new mood entry
router.get("/", fetchMoodEntries); // get all mood entries

export default router;
