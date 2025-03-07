import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  createMoodEntry,
  deleteMoodEntries,
  deleteMoodEntry,
  fetchMoodEntries,
  fetchMoodEntry,
  updateMoodEntry,
} from "../controllers/mood.controller.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

router.post("/create", createMoodEntry); // create new mood entry
router.get("/", fetchMoodEntries); // get all mood entries
router.get("/:moodId", fetchMoodEntry); // get a single mood entry
router.patch("/:moodId", updateMoodEntry); // update a mood entry
router.delete("/:moodId", deleteMoodEntry); // delete a mood entry
router.delete("/", deleteMoodEntries); // delete all mood entries

export default router;
