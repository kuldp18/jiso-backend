import mongoose from "mongoose";

const userContextSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    goals: [
      {
        goal: {
          type: String,
          required: true,
        },
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
          date: {
            type: Date,
            default: Date.now,
          },
          theme: {
            type: String, // Example: "Anxious", "Hopeful"
            required: true,
          },
          description: String,
        },
      ],
      monthly: [
        {
          date: {
            type: Date,
            default: Date.now,
          },
          theme: {
            type: String, // Example: "Anxious", "Hopeful"
            required: true,
          },
          description: String,
        },
      ],
    },

    journalThemes: {
      weekly: [
        {
          date: {
            type: Date,
            default: Date.now,
          },
          theme: {
            type: String, // Example: "Anxious", "Hopeful"
            required: true,
          },
          description: String,
        },
      ],
      monthly: [
        {
          date: {
            type: Date,
            default: Date.now,
          },
          theme: {
            type: String, // Example: "Anxious", "Hopeful"
            required: true,
          },
          description: String,
        },
      ],
    },
  },
  { timestamps: true }
);

export const UserContext = mongoose.model("UserContext", userContextSchema);
