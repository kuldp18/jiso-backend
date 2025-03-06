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
        success: true,
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

// update journal entry
export const updateJournalEntry = async (req, res) => {
  const { journalId } = req.params;
  const { entry, emotions, tags } = req.body;

  try {
    if (!journalId) {
      return res.status(400).json({
        success: false,
        message: "journalId is required to update a journal entry",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(journalId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid journalId provided",
      });
    }

    // find if journalId is valid
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

    // Create an update object with only the fields that were provided
    const updateData = {};
    if (entry !== undefined) updateData.entry = entry;
    if (emotions !== undefined) {
      if (!Array.isArray(emotions)) {
        return res.status(400).json({
          success: false,
          message: "`emotions` should be an array of string values",
        });
      }
      updateData.emotions = emotions;
    }
    if (tags !== undefined) {
      if (!Array.isArray(tags)) {
        return res.status(400).json({
          success: false,
          message: "`tags` should be an array of string values",
        });
      }
      updateData.tags = tags;
    }

    // Update the journal entry with only the changed fields
    const updatedEntry = await Journal.findByIdAndUpdate(
      journalId,
      { $set: updateData },
      { new: true } // Return the updated document
    );

    res.status(200).json({
      success: true,
      message: "Journal entry updated successfully",
      journalEntry: updatedEntry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Something went wrong while updating the journal entry",
    });
  }
};
