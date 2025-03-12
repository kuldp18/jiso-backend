import { createChatSummary } from "../ai/chat.ai.js";
import { getWeeklyContextThemes } from "../ai/context.ai.js";
import { summarizeJournal } from "../ai/journal.ai.js";
import { Chat } from "../models/chat.model.js";
import { Journal } from "../models/journal.model.js";
import { User } from "../models/user.model.js";
import { UserContext } from "../models/usercontext.model.js";
import { fetchLastWeekChatSummaries } from "../utils/chat.utils.js";
import { fetchLastWeekJournalSummaries } from "../utils/journal.utils.js";
import { fetchLastWeekMoods } from "../utils/mood.utils.js";

// User Contexts

export const updateUserContextsWeekly = async (req, res) => {
  const apiKey = req.headers["x-api-key"];

  try {
    if (!apiKey || apiKey !== process.env.CRON_API_KEY) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Valid API key is required.",
      });
    }

    const users = await User.find({ isEmailVerified: true });

    if (users.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No verified users found.",
      });
    }

    // loop through users and update their contexts
    for (let user of users) {
      const userContext = await UserContext.findOne({
        userId: user._id,
      });

      if (!userContext) {
        continue;
      }

      // fetch relevant last week data
      const moods = await fetchLastWeekMoods(user._id);
      const journals = await fetchLastWeekJournalSummaries(user._id);
      const chats = await fetchLastWeekChatSummaries(user._id);
      const goals = userContext.goals;
      const struggles = userContext.struggles;

      const basicInfo = {
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        gender: user.gender,
      };

      const contextObj = {
        basicInfo,
        moods,
        journals,
        chats,
        goals,
        struggles,
      };

      console.log(`Context object for user ${user._id}: `, contextObj);

      // feed data to AI model
      const { moodThemes, chatThemes, journalThemes } =
        await getWeeklyContextThemes(contextObj);

      // update user context with new themes
      userContext.moodThemes.weekly.push(moodThemes);
      userContext.chatThemes.weekly.push(chatThemes);
      userContext.journalThemes.weekly.push(journalThemes);

      const updatedContext = await userContext.save();

      res.status(200).json({
        success: true,
        message: `Updated user context for user ${user._id}.`,
        context: updatedContext,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while updating user contexts.",
    });
  }
};

export const updateUserContextsMonthly = async (req, res) => {};

// User Insights

export const updateUserInsightsWeekly = async (req, res) => {
  /*
    Plan:
    1. Get all users
    2. For each user:
        - Grab user context
        - Get all the themes of last week
        - Get struggles and goals
        - Get all the insights of last week (if any)
        - Feed the data to the AI model
        - Get insights for the week
        - Update the user context with the new weekly insights
    3. Return completion or error message
    */
};

export const updateUserInsightsMonthly = async (req, res) => {};

//Journals

export const summarizePendingJournals = async (req, res) => {
  const apiKey = req.headers["x-api-key"];

  try {
    if (!apiKey || apiKey !== process.env.CRON_API_KEY) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Valid API key is required.",
      });
    }

    // get journals with pending or error status with verified users
    const pendingJournals = await Journal.find({
      summaryStatus: { $in: ["pending", "error"] },
    }).populate({
      path: "userId",
      select: "isEmailVerified firstName lastName",
      match: { isEmailVerified: true },
    });

    const verifiedJournals = pendingJournals.filter(
      (journal) => journal.userId // filter out journals with unverified users
    );

    if (verifiedJournals.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No pending journals found to summarize.",
      });
    }

    // loop through verified journals and summarize them
    for (let journal of verifiedJournals) {
      //summarize journal
      await summarizeJournal(journal);
    }

    res.status(200).json({
      success: true,
      message: "Summarized all pending journals.",
      count: verifiedJournals.length,
      entries: verifiedJournals,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred while summarizing journals.",
    });
  }
};

// Chats
export const summarizePendingChats = async (req, res) => {
  const apiKey = req.headers["x-api-key"];

  try {
    if (!apiKey || apiKey !== process.env.CRON_API_KEY) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Valid API key is required.",
      });
    }

    // get chats with pending or error status
    const pendingChats = await Chat.find({
      summaryStatus: { $in: ["pending", "error"] },
    });

    if (pendingChats.length === 0) {
      return;
    }

    // loop through pending chats and summarize them
    for (let chat of pendingChats) {
      //summarize chat
      await createChatSummary(chat);
    }

    res.status(200).json({
      success: true,
      message: "Summarized all pending chats.",
      count: pendingChats.length,
      entries: pendingChats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while summarizing chats.",
    });
  }
};
