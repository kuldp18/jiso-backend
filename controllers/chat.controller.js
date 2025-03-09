import mongoose from "mongoose";
import { Chat } from "../models/chat.model.js";
import { UserContext } from "../models/usercontext.model.js";
import { getTherapistResponse } from "../ai/chat.ai.js";

// create new chat
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

// send new message and get response
export const sendMessage = async (req, res) => {
  const { chatId } = req.params;
  const { message } = req.body;

  try {
    if (!chatId || !message) {
      return res.status(400).json({
        success: false,
        message: "chatId and a message are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid chatId. Please provide a valid chatId.",
      });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found or does not exist.",
      });
    }

    const newMessage = {
      sender: "user",
      content: message,
    };

    chat.messages.push(newMessage);

    await chat.save();

    // create a history of messages for AI
    const history = chat.messages.map((msg) => ({
      role: msg.sender,
      content: msg.content,
    }));

    // ask AI for response

    const therapistResponse = await getTherapistResponse(message, history);

    if (!therapistResponse) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong while getting therapist response.",
      });
    }

    // save AI response to chat
    const aiMessage = {
      sender: "ai",
      content: therapistResponse,
    };

    chat.messages.push(aiMessage);

    await chat.save();

    res.status(200).json({
      success: true,
      message: "Message sent successfully.",
      response: therapistResponse,
      chat,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while sending message.",
    });
  }
};
