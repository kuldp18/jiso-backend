import mongoose from "mongoose";

const userContextSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    goals: {
      type: [
        {
          goal: {
            type: String,
            required: true,
          },
          description: String,
          createdAt: { type: Date, default: Date.now },
          completed: { type: Boolean, default: false },
        },
      ],
    },

    struggles: {
      type: [
        {
          struggle: {
            type: String,
            required: true,
          },
          description: String,
          severity: { type: Number, min: 0, max: 10, default: -1 },
          createdAt: { type: Date, default: Date.now },
        },
      ],
    },

    moodThemes: {
      type: {
        weekly: {
          type: [
            {
              date: {
                type: Date,
                default: Date.now,
              },
              theme: {
                type: String,
                required: true,
              },
              description: String,
            },
          ],
          default: [], // Initialize as empty array
        },
        monthly: {
          type: [
            {
              date: {
                type: Date,
                default: Date.now,
              },
              theme: {
                type: String,
                required: true,
              },
              description: String,
            },
          ],
          default: [], // Initialize as empty array
        },
      },
      default: { weekly: [], monthly: [] }, // Initialize as empty object with arrays
    },

    journalThemes: {
      type: {
        weekly: {
          type: [
            {
              date: {
                type: Date,
                default: Date.now,
              },
              theme: {
                type: String,
                required: true,
              },
              description: String,
            },
          ],
          default: [], // Initialize as empty array
        },
        monthly: {
          type: [
            {
              date: {
                type: Date,
                default: Date.now,
              },
              theme: {
                type: String,
                required: true,
              },
              description: String,
            },
          ],
          default: [], // Initialize as empty array
        },
      },
      default: { weekly: [], monthly: [] }, // Initialize as empty object with arrays
    },
  },
  { timestamps: true }
);

export const UserContext = mongoose.model("UserContext", userContextSchema);
