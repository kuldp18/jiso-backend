import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    entry: {
      type: String,
      required: true,
    },

    emotions: {
      type: [String],
      default: [],
    },

    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const Journal = mongoose.model("Journal", journalSchema);
