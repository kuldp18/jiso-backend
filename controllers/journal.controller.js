import { Journal } from "../models/journal.model.js";
import mongoose from "mongoose";

// create new journal entry
export const createJournalEntry = async (req, res) => {
  let { entry, emotions, tags } = req.body;

  try {
    if (!entry) {
      return res.status(400).json({
        success: false,
        message: "Journal entry can't be empty",
      });
    }

    if (!emotions) {
      emotions = [];
    }

    if (!tags) {
      tags = [];
    }

    if (!Array.isArray(emotions) || !Array.isArray(tags)) {
      return res.status(400).json({
        success: false,
        message: "emotions and tags should be an array of string values",
      });
    }

    const newJournalEntry = new Journal({
      userId: req.userId,
      entry,
      emotions,
      tags,
    });

    const savedEntry = await newJournalEntry.save();

    res.status(200).json({
      success: true,
      message: "New journal entry created successfully",
      entry: savedEntry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Something went wrong while creating a new journal entry",
    });
  }
};

// fetch by id
export const fetchJournalEntry = async (req, res) => {
  const { journalId } = req.params;

  try {
    if (!journalId) {
      return res.status(400).json({
        success: false,
        message: "Valid journalId is required to fetch an entry",
      });
    }

    const journalEntry = await Journal.findOne({
      userId: req.userId,
      _id: journalId,
    });

    if (!journalEntry) {
      return res.status(404).json({
        success: false,
        message: "Invalid journalId or journal entry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Journal entry found successfully",
      entry: journalEntry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Something went wrong while fetching journal entry",
    });
  }
};

// fetch all journal entries for user

export const fetchJournalEntries = async (req, res) => {
  const entries = await Journal.find({
    userId: req.userId,
  });

  try {
    if (entries.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No journal entries found for this user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Entries found successfully",
      total: entries.length,
      entries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Something went wrong while fetching the user journal entries",
    });
  }
};
