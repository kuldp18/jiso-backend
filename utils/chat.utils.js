import { Chat } from "../models/chat.model.js";

// get last week chat summaries
export const fetchLastWeekChatSummaries = async (userId) => {
  try {
    const chats = await Chat.find({
      userId,
      summaryStatus: "complete",
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    });

    if (!chats || chats.length === 0) {
      return [];
    }

    const parsedChats = chats.map((chat) => {
      return {
        summary: chat.summary,
        date: chat.createdAt.toDateString(),
      };
    });

    return parsedChats;
  } catch (error) {
    console.error("Error fetching last week chat summaries: ", error);
    return [];
  }
};
