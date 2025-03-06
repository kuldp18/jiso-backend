import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  createJournalEntry,
  fetchJournalEntries,
  fetchJournalEntry,
  updateJournalEntry,
} from "../controllers/journal.controller.js";

const router = Router();

router.use(verifyToken);

router.post("/create", createJournalEntry); // create new entry
router.get("/:journalId", fetchJournalEntry); // fetch specific entry
router.get("/", fetchJournalEntries); // fetch all entries
router.patch("/:journalId", updateJournalEntry); // update specific entry

export default router;
