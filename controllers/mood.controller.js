import { Mood } from "../models/mood.model.js";
import mongoose from "mongoose";

// create new mood entry
export const createMoodEntry = async (req, res) => {
  let { emotions, description } = req.body;

  try {
    if (!emotions || !Array.isArray(emotions)) {
      return res.status(400).json({
        success: false,
        message: "An array named `emotions` is required to create a mood entry",
      });
    }

    if (emotions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "`emotions` cannot be empty",
      });
    }

    const moodEntry = new Mood({
      userId: req.userId,
      emotions,
      description,
    });

    const savedMoodEntry = await moodEntry.save();

    res.status(201).json({
      success: true,
      message: "New mood entry created successfully",
      entry: savedMoodEntry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Something went wrong while create a new mood entry",
    });
  }
};

// get all mood entries
export const fetchMoodEntries = async (req, res) => {
  try {
    const moodEntries = await Mood.find({ userId: req.userId });

    if (moodEntries.length === 0) {
      return res.status(404).json({
        success: true,
        message: "No mood entries found for this user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Mood entries fetched successfully",
      total: moodEntries.length,
      entries: moodEntries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Something went wrong while fetching mood entries",
    });
  }
};

// get specific mood entry
export const fetchMoodEntry = async (req, res) => {
  const { moodId } = req.params;

  try {
    if (!moodId) {
      return res.status(400).json({
        success: false,
        message: "moodId is required to fetch a mood entry",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(moodId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid moodId provided",
      });
    }

    const moodEntry = await Mood.findOne({ _id: moodId, userId: req.userId });

    if (!moodEntry) {
      return res.status(404).json({
        success: false,
        message: "Mood entry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Mood entry fetched successfully",
      entry: moodEntry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Something went wrong while fetching mood entry",
    });
  }
};

// update mood entry
export const updateMoodEntry = async (req, res) => {
  const { moodId } = req.params;
  const { emotions, description } = req.body;
  try {
    if (!moodId) {
      return res.status(400).json({
        success: false,
        message: "moodId is required to update a mood entry",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(moodId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid moodId provided",
      });
    }

    const moodEntry = await Mood.findOne({ _id: moodId, userId: req.userId });

    if (!moodEntry) {
      return res.status(404).json({
        success: false,
        message: "Mood entry not found for this user",
      });
    }

    // update only the provided fields
    if (emotions) moodEntry.emotions = emotions;
    if (description) moodEntry.description = description;

    const updatedMoodEntry = await moodEntry.save();

    res.status(200).json({
      success: true,
      message: "Mood entry updated successfully",
      entry: updatedMoodEntry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Something went wrong while updating mood entry",
    });
  }
};

// delete mood entry
export const deleteMoodEntry = async (req, res) => {
  const { moodId } = req.params;
  try {
    if (!moodId || !mongoose.Types.ObjectId.isValid(moodId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid moodId provided",
      });
    }

    const moodEntry = await Mood.findOneAndDelete({
      _id: moodId,
      userId: req.userId,
    });

    if (!moodEntry) {
      return res.status(404).json({
        success: false,
        message: "Mood entry not found or already deleted",
      });
    }

    res.status(200).json({
      success: true,
      message: "Mood entry deleted successfully",
      entry: moodEntry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Something went wrong while deleting mood entry",
    });
  }
};
