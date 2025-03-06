import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  createJournalEntry,
  fetchJournalEntry,
} from "../controllers/journal.controller.js";

const router = Router();

router.use(verifyToken);

router.post("/create", createJournalEntry); // create new entry
router.get("/:journalId", fetchJournalEntry); // fetch specific entry

export default router;
