import mongoose from "mongoose";

// Schema for individual messages
const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ["user", "ai"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Schema for chat sessions
const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userContext: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserContext",
      required: true,
    },
    title: {
      type: String,
      default: "New Chat",
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);
