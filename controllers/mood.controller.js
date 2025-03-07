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
