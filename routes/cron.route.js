import { Router } from "express";
import {
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

export default router;
