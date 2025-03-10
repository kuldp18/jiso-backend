import { Router } from "express";
import {
  summarizePendingChats,
  summarizePendingJournals,
  updateUserContextsMonthly,
  updateUserContextsWeekly,
  updateUserInsightsMonthly,
  updateUserInsightsWeekly,
} from "../controllers/cron.controller.js";

const router = Router();

router.get("/contexts/update/weekly", updateUserContextsWeekly);
router.get("/contexts/update/monthly", updateUserContextsMonthly);
router.get("/insights/update/weekly", updateUserInsightsWeekly);
router.get("/insights/update/monthly", updateUserInsightsMonthly);
router.get("/journals/summarize", summarizePendingJournals);
router.get("/chats/summarize", summarizePendingChats);

export default router;
