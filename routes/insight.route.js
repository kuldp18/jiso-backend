import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getUserInsight } from "../controllers/insight.controller.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

router.get("/current", getUserInsight);

export default router;
