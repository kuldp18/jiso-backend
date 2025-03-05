import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  addGoal,
  addGoals,
  createJournalTheme,
  createMoodTheme,
  createUserContext,
  deleteAllGoals,
  deleteSingleGoal,
  getGoals,
  getSingleGoal,
  getUserContext,
  toggleGoalCompletion,
} from "../controllers/userContext.controller.js";

const router = Router();

router.use(verifyToken);

// User context
router.post("/create", createUserContext);
router.get("/", getUserContext);

// Goals
router.post("/goal/add", addGoal); // add single goal
router.post("/goals/add", addGoals); // add multiple goals as array
router.get("/goals", getGoals); // fetch all goals
router.delete("/goals", deleteAllGoals); // delete all goals
router.get("/goal/:goalId", getSingleGoal); // fetch single goal
router.delete("/goal/:goalId", deleteSingleGoal); // delete single goal
router.patch("/goal/:goalId", toggleGoalCompletion); // toggle completed property

// Create journal and mood themes (for AI)
router.post("/ai/theme/journal", createJournalTheme);
router.post("/ai/theme/mood", createMoodTheme);

export default router;
