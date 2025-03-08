import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

    summaryStatus: {
      type: String,
      enum: ["pending", "complete"],
      default: "pending",
    },

    summaries: {
      small: {
        type: String,
        default: "",
      },
      medium: {
        type: String,
        default: "",
      },
      large: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

export const Journal = mongoose.model("Journal", journalSchema);
