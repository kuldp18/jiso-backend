import mongoose from "mongoose";

const userContextSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    goals: [
      {
        title: String,
        description: String,
        createdAt: { type: Date, default: Date.now },
        completed: { type: Date, default: false },
      },
    ],

    struggles: [
      {
        description: String,
        severity: { type: Number, min: 1, max: 10 },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    moodThemes: {
      weekly: [
        {
          weekStart: Date, // Start of the week (e.g., Monday)
          theme: String, // Example: "Anxious", "Hopeful"
          description: String,
        },
      ],
      monthly: [
        {
          month: String, // Example: "February 2025"
          theme: String, // Example: "Resilience", "Depressed"
          description: String,
        },
      ],
    },

    journalThemes: {
      weekly: [
        {
          weekStart: Date, // Start of the week (e.g., Monday)
          theme: String,
          description: String,
        },
      ],
      monthly: [
        {
          month: String, // Example: "February 2025"
          theme: String,
          description: String,
        },
      ],
    },
  },
  { timestamps: true }
);

export const UserContext = mongoose.model("UserContext", userContextSchema);
