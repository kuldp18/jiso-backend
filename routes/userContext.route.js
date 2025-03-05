import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  createUserContext,
  getUserContext,
} from "../controllers/userContext.controller.js";

const router = Router();

router.use(verifyToken);

// Create user context
router.post("/create", createUserContext);
// Get user context
router.get("/", getUserContext);
// journal themes
// mood themes

export default router;
