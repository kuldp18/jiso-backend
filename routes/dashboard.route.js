import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  getDashboardSummary,
  getMoodAnalytics,
  getJournalAnalytics,
  getGoalAnalytics,
  getInsightAnalytics,
  getChatAnalytics,
} from "../controllers/dashboard.controller.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Dashboard routes
router.get("/summary", getDashboardSummary);
router.get("/mood-analytics", getMoodAnalytics);
router.get("/journal-analytics", getJournalAnalytics);
router.get("/goal-analytics", getGoalAnalytics);
router.get("/insight-analytics", getInsightAnalytics);
router.get("/chat-analytics", getChatAnalytics);

export default router;
