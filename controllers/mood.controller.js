import { Mood } from "../models/mood.model.js";
import mongoose from "mongoose";

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
