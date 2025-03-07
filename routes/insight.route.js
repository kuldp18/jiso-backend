import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

export default router;
