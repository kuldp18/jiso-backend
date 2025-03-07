import mongoose from "mongoose";

const insightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userContext: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserContext",
    },

    weekly: {
      type: [
        {
          date: {
            type: Date,
            default: Date.now,
          },
          insight: {
            type: String,
            required: true,
          },
          description: String,
        },
      ],
      default: [],
    },
    monthly: {
      type: [
        {
          date: {
            type: Date,
            default: Date.now,
          },
          insight: {
            type: String,
            required: true,
          },
          description: String,
        },
      ],
      default: [],
    },

    suggestions: {
      type: [
        {
          date: {
            type: Date,
            default: Date.now,
          },
          suggestion: {
            type: String,
            required: true,
          },
          description: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export const Insight = mongoose.model("Insight", insightSchema);
