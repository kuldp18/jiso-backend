import mongoose from "mongoose";

const moodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    emotions: {
      type: [String],
      required: true,
    },

    description: String,
  },
  { timestamps: true }
);

export const Mood = mongoose.model("Mood", moodSchema);
