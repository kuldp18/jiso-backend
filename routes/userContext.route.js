import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyToken);

// Create user context
router.post("/create", (req, res) => {});
// Get user context
router.get("/:userId", (req, res) => {});
// journal themes
// mood themes

export default router;
