// create new chat
import { Chat } from "../models/chat.model.js";
import { UserContext } from "../models/usercontext.model.js";

export const createChat = async (req, res) => {
  try {
    const userContext = await UserContext.findOne({ userId: req.userId });

    if (!userContext) {
      return res.status(404).json({
        success: false,
        message: "User context not found.",
      });
    }

    const newChat = new Chat({
      userId: req.userId,
      userContext: userContext._id,
    });

    const savedChat = await newChat.save();

    res.status(201).json({
      success: true,
      message: "New Chat created successfully.",
      chatId: savedChat._id,
      chat: savedChat,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while creating new chat.",
    });
  }
};
