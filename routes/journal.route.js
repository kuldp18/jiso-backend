import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  createJournalEntry,
  deleteJournalEntries,
  deleteJournalEntry,
  fetchJournalEntries,
  fetchJournalEntry,
  updateJournalEntry,
} from "../controllers/journal.controller.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Journal entry routes
router.post("/create", createJournalEntry); // Create a new journal entry
router.get("/:journalId", fetchJournalEntry); // Fetch a specific journal entry by ID
router.get("/", fetchJournalEntries); // Fetch all journal entries
router.delete("/", deleteJournalEntries); // Delete all journal entries
router.patch("/:journalId", updateJournalEntry); // Update a specific journal entry
router.delete("/:journalId", deleteJournalEntry); // Delete a specific journal entry

export default router;
