import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  createJournalTheme,
  createMoodTheme,
  getUserContext,
} from "../controllers/userContext.controller.js";

import {
  addGoal,
  addGoals,
  getGoals,
  deleteAllGoals,
  getSingleGoal,
  deleteSingleGoal,
  toggleGoalCompletion,
  editGoal,
} from "../controllers/goal.controller.js";

import {
  addStruggle,
  addStruggles,
  changeSeverity,
  deleteAllStruggles,
  deleteSingleStruggle,
  fetchAllStruggles,
  fetchSingleStruggle,
  updateStruggle,
} from "../controllers/struggle.controller.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

/**
 * User Context Routes
 * Handles basic user context operations
 */
router.get("/", getUserContext);

/**
 * Goal Routes
 * Handles CRUD operations for user goals
 */
router.post("/goal/add", addGoal); // Add a single goal
router.post("/goals/add", addGoals); // Add multiple goals
router.get("/goals", getGoals); // Get all goals
router.get("/goal/:goalId", getSingleGoal); // Get a specific goal
router.patch("/goal/edit/:goalId", editGoal); // Update a goal
router.patch("/goal/toggle/:goalId", toggleGoalCompletion); // Toggle goal completion
router.delete("/goal/:goalId", deleteSingleGoal); // Delete a specific goal
router.delete("/goals", deleteAllGoals); // Delete all goals

/**
 * Struggle Routes
 * Handles CRUD operations for user struggles
 */
router.post("/struggle/add", addStruggle); // Add a single struggle
router.post("/struggles/add", addStruggles); // Add multiple struggles
router.get("/struggles", fetchAllStruggles); // Get all struggles
router.get("/struggle/:struggleId", fetchSingleStruggle); // Get a specific struggle
router.patch("/struggle/:struggleId", updateStruggle); // Update a struggle
router.patch("/struggle/severity/:struggleId", changeSeverity); // Update struggle severity
router.delete("/struggle/:struggleId", deleteSingleStruggle); // Delete a specific struggle
router.delete("/struggles", deleteAllStruggles); // Delete all struggles

/**
 * AI Theme Routes
 * Handles theme generation for AI features
 */
router.post("/ai/theme/journal", createJournalTheme);
router.post("/ai/theme/mood", createMoodTheme);

export default router;
