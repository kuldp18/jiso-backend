import { createChatSummary } from "../ai/chat.ai.js";
import {
  getMonthlyContextThemes,
  getWeeklyContextThemes,
} from "../ai/context.ai.js";

import { summarizeJournal } from "../ai/journal.ai.js";
import { Chat } from "../models/chat.model.js";
import { Journal } from "../models/journal.model.js";
import { UserContext } from "../models/usercontext.model.js";
import { Insight } from "../models/insight.model.js";

import {
  fetchLastMonthChatSummaries,
  fetchLastWeekChatSummaries,
} from "../utils/chat.utils.js";

import {
  fetchLastMonthJournalSummaries,
  fetchLastWeekJournalSummaries,
} from "../utils/journal.utils.js";

import {
  fetchLastMonthMoods,
  fetchLastWeekMoods,
} from "../utils/mood.utils.js";

import {
  fetchMonthlyThemeBatch,
  fetchWeeklyThemeBatch,
} from "../utils/context.utils.js";

import { getMonthlyInsights, getWeeklyInsights } from "../ai/insight.ai.js";

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

    // Find contexts that need updating based on three cases:
    // 1. Contexts with status "pending" or "error"
    // 2. Contexts with no last update timestamp (lastWeeklyUpdate is null)
    // 3. Contexts not updated in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const contextsToUpdate = await UserContext.find({
      $or: [
        { lastWeeklyUpdateStatus: { $in: ["pending", "error"] } },
        { lastWeeklyUpdate: null },
        { lastWeeklyUpdate: { $lt: sevenDaysAgo } },
      ],
    }).populate({
      path: "userId",
      select: "firstName lastName age gender isEmailVerified",
      match: { isEmailVerified: true },
    });

    // Filter out contexts whose users are null or not verified
    const verifiedContexts = contextsToUpdate.filter(
      (context) => context.userId && context.userId.isEmailVerified
    );

    if (verifiedContexts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No user contexts need updating at this time.",
      });
    }

    const results = {
      successful: [],
      failed: [],
    };

    // Process each context
    for (let context of verifiedContexts) {
      try {
        const userId = context.userId._id;

        console.log(`Processing weekly update for user ${userId}...`);

        // Fetch relevant data for the last week
        const moods = await fetchLastWeekMoods(userId);
        const journals = await fetchLastWeekJournalSummaries(userId);
        const chats = await fetchLastWeekChatSummaries(userId);

        // Mark as pending before processing
        context.lastWeeklyUpdateStatus = "pending";
        await context.save();

        const goals = context.goals || [];
        const struggles = context.struggles || [];

        const basicInfo = {
          firstName: context.userId.firstName || "",
          lastName: context.userId.lastName || "",
          age: context.userId.age || null,
          gender: context.userId.gender || "",
        };

        const contextObj = {
          basicInfo,
          moods,
          journals,
          chats,
          goals,
          struggles,
        };

        console.log("Context object:", contextObj);

        // feed data to AI model
        const { moodThemes, chatThemes, journalThemes } =
          await getWeeklyContextThemes(contextObj);

        // update user context with new themes
        context.moodThemes.weekly.push(moodThemes);
        context.chatThemes.weekly.push(chatThemes);
        context.journalThemes.weekly.push(journalThemes);

        // Update status info
        context.lastWeeklyUpdate = new Date();
        context.lastWeeklyUpdateStatus = "complete";
        context.lastWeeklyUpdateError = null;

        await context.save();

        results.successful.push({
          userId,
          contextId: context._id,
        });
      } catch (error) {
        console.error(
          `Error updating context for user ${context.userId?._id}:`,
          error
        );

        // Update error status
        try {
          context.lastWeeklyUpdateStatus = "error";
          context.lastWeeklyUpdateError = error.message || "Unknown error";
          await context.save();
        } catch (saveError) {
          console.error("Error updating context error status:", saveError);
        }

        results.failed.push({
          userId: context.userId?._id || context.userId,
          contextId: context._id,
          error: error.message || "Unknown error",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Weekly context update processed ${verifiedContexts.length} contexts`,
      results: {
        total: verifiedContexts.length,
        successful: results.successful.length,
        failed: results.failed.length,
        successfulContexts: results.successful,
        failedContexts: results.failed,
      },
    });
  } catch (error) {
    console.error("Global error in updateUserContextsWeekly:", error);
    return res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while updating user contexts.",
    });
  }
};

export const updateUserContextsMonthly = async (req, res) => {
  const apiKey = req.headers["x-api-key"];

  try {
    if (!apiKey || apiKey !== process.env.CRON_API_KEY) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Valid API key is required.",
      });
    }

    // Find contexts that need updating based on three cases:
    // 1. Contexts with status "pending" or "error"
    // 2. Contexts with no last update timestamp (lastMonthlyUpdate is null)
    // 3. Contexts not updated in the last 30 days
    const lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() - 30);

    const contextsToUpdate = await UserContext.find({
      $or: [
        { lastMonthlyUpdateStatus: { $in: ["pending", "error"] } },
        { lastMonthlyUpdate: null },
        { lastMonthlyUpdate: { $lt: lastMonth } },
      ],
    }).populate({
      path: "userId",
      select: "firstName lastName age gender isEmailVerified",
      match: { isEmailVerified: true },
    });

    // Filter out contexts whose users are null or not verified
    const verifiedContexts = contextsToUpdate.filter(
      (context) => context.userId && context.userId.isEmailVerified
    );

    if (verifiedContexts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No user contexts need updating at this time.",
      });
    }

    const results = {
      successful: [],
      failed: [],
    };

    // Process each context
    for (let context of verifiedContexts) {
      try {
        const userId = context.userId._id;

        console.log(`Processing monthly update for user ${userId}...`);

        // Check if there's enough data to generate themes
        const moods = await fetchLastMonthMoods(userId);
        const journals = await fetchLastMonthJournalSummaries(userId);
        const chats = await fetchLastMonthChatSummaries(userId);

        // Mark as pending before processing
        context.lastMonthlyUpdateStatus = "pending";
        await context.save();

        const goals = context.goals || [];
        const struggles = context.struggles || [];

        const basicInfo = {
          firstName: context.userId.firstName || "",
          lastName: context.userId.lastName || "",
          age: context.userId.age || null,
          gender: context.userId.gender || "",
        };

        const contextObj = {
          basicInfo,
          moods,
          journals,
          chats,
          goals,
          struggles,
        };

        console.log("Context object:", contextObj);

        // feed data to AI model
        const { moodThemes, chatThemes, journalThemes } =
          await getMonthlyContextThemes(contextObj);

        // update user context with new themes
        context.moodThemes.monthly.push(moodThemes);
        context.chatThemes.monthly.push(chatThemes);
        context.journalThemes.monthly.push(journalThemes);

        // Update status info
        context.lastMonthlyUpdate = new Date();
        context.lastMonthlyUpdateStatus = "complete";
        context.lastMonthlyUpdateError = null;

        await context.save();

        results.successful.push({
          userId,
          contextId: context._id,
        });
      } catch (error) {
        console.error(
          `Error updating context for user ${context.userId?._id}:`,
          error
        );

        // Update error status
        try {
          context.lastMonthlyUpdateStatus = "error";
          context.lastMonthlyUpdateError = error.message || "Unknown error";
          await context.save();
        } catch (saveError) {
          console.error("Error updating context error status:", saveError);
        }

        results.failed.push({
          userId: context.userId?._id || context.userId,
          contextId: context._id,
          error: error.message || "Unknown error",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Monthly context update processed ${verifiedContexts.length} contexts`,
      results: {
        total: verifiedContexts.length,
        successful: results.successful.length,
        failed: results.failed.length,
        successfulContexts: results.successful,
        failedContexts: results.failed,
      },
    });
  } catch (error) {
    console.error("Global error in updateUserContextsWeekly:", error);
    return res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while updating user contexts.",
    });
  }
};

// User Insights

export const updateUserInsightsWeekly = async (req, res) => {
  const apiKey = req.headers["x-api-key"];

  try {
    if (!apiKey || apiKey !== process.env.CRON_API_KEY) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Valid API key is required.",
      });
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const insightsToUpdate = await Insight.find({
      $or: [
        { lastWeeklyUpdateStatus: { $in: ["pending", "error"] } },
        { lastWeeklyUpdate: null },
        { lastWeeklyUpdate: { $lt: sevenDaysAgo } },
      ],
    }).populate({
      path: "userId",
      select: "firstName lastName age gender isEmailVerified",
      match: { isEmailVerified: true },
    });

    // Filter out insights whose users are null or not verified
    const verifiedInsights = insightsToUpdate.filter(
      (insight) => insight.userId && insight.userId.isEmailVerified
    );

    if (verifiedInsights.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No user insights need updating at this time.",
      });
    }

    const results = {
      successful: [],
      failed: [],
    };

    // process each insight
    for (let insight of verifiedInsights) {
      try {
        const userId = insight.userId._id;

        console.log(`Processing weekly insight update for user ${userId}...`);

        // Fetch relevant data for the last week
        const context = await UserContext.findOne({ userId });

        if (!context) {
          throw new Error("User context not found");
        }

        const goals = context.goals || [];
        const struggles = context.struggles || [];

        const basicInfo = {
          firstName: insight.userId.firstName || "",
          lastName: insight.userId.lastName || "",
          age: insight.userId.age || null,
          gender: insight.userId.gender || "",
        };

        console.log("Basic info:", basicInfo);

        const themes = await fetchWeeklyThemeBatch(context);

        console.log("Themes:", themes);

        const insightObj = {
          basicInfo,
          goals,
          struggles,
          themes,
        };

        console.log("Insight object:", insightObj);

        // feed data to AI model
        const { insights, suggestions } = await getWeeklyInsights(insightObj);

        // update user insights with new insights
        insight.weekly.push([...insights]);
        insight.suggestions.push([...suggestions]);

        // Update status info
        insight.lastWeeklyUpdate = new Date();
        insight.lastWeeklyUpdateStatus = "complete";
        insight.lastWeeklyUpdateError = null;

        await insight.save();

        results.successful.push({
          userId,
          insightId: insight._id,
        });
      } catch (error) {
        // update error status

        try {
          insight.lastWeeklyUpdate = new Date();
          insight.lastWeeklyUpdateStatus = "error";
          insight.lastWeeklyUpdateError = error.message || "Unknown error";

          await insight.save();

          console.error(
            `Error updating weekly insight for user ${insight.userId?._id}:`,
            error
          );
        } catch (error) {
          console.error("Error updating insight error status:", error);
        }

        results.failed.push({
          userId: insight.userId?._id || insight.userId,
          insightId: insight._id,
          error: error.message || "Unknown error",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Weekly insight update processed ${verifiedInsights.length} insights`,
      results: {
        total: verifiedInsights.length,
        successful: results.successful.length,
        failed: results.failed.length,
        successfulInsights: results.successful,
        failedInsights: results.failed,
      },
    });
  } catch (error) {
    console.error("Global error in updateUserInsightsWeekly:", error);
    return res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while updating user insights.",
    });
  }
};
export const updateUserInsightsMonthly = async (req, res) => {
  const apiKey = req.headers["x-api-key"];

  try {
    if (!apiKey || apiKey !== process.env.CRON_API_KEY) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Valid API key is required.",
      });
    }

    const lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() - 30);

    const insightsToUpdate = await Insight.find({
      $or: [
        { lastWeeklyUpdateStatus: { $in: ["pending", "error"] } },
        { lastWeeklyUpdate: null },
        { lastWeeklyUpdate: { $lt: lastMonth } },
      ],
    }).populate({
      path: "userId",
      select: "firstName lastName age gender isEmailVerified",
      match: { isEmailVerified: true },
    });

    // Filter out insights whose users are null or not verified
    const verifiedInsights = insightsToUpdate.filter(
      (insight) => insight.userId && insight.userId.isEmailVerified
    );

    if (verifiedInsights.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No user insights need updating at this time.",
      });
    }

    const results = {
      successful: [],
      failed: [],
    };

    // process each insight
    for (let insight of verifiedInsights) {
      try {
        const userId = insight.userId._id;

        console.log(`Processing monthly insight update for user ${userId}...`);

        // Fetch relevant data for the last week
        const context = await UserContext.findOne({ userId });

        if (!context) {
          throw new Error("User context not found");
        }

        const goals = context.goals || [];
        const struggles = context.struggles || [];

        const basicInfo = {
          firstName: insight.userId.firstName || "",
          lastName: insight.userId.lastName || "",
          age: insight.userId.age || null,
          gender: insight.userId.gender || "",
        };

        console.log("Basic info:", basicInfo);

        const themes = await fetchMonthlyThemeBatch(context);

        console.log("Themes:", themes);

        const insightObj = {
          basicInfo,
          goals,
          struggles,
          themes,
        };

        console.log("Insight object:", insightObj);

        // feed data to AI model
        const { insights, suggestions } = await getMonthlyInsights(insightObj);

        // update user insights with new insights
        insight.monthly.push([...insights]);
        insight.suggestions.push([...suggestions]);

        // Update status info
        insight.lastMonthlyUpdate = new Date();
        insight.lastMonthlyUpdateStatus = "complete";
        insight.lastMonthlyUpdateError = null;

        await insight.save();

        results.successful.push({
          userId,
          insightId: insight._id,
        });
      } catch (error) {
        // update error status

        try {
          insight.lastMonthlyUpdate = new Date();
          insight.lastMonthlyUpdateStatus = "error";
          insight.lastMonthlyUpdateError = error.message || "Unknown error";

          await insight.save();

          console.error(
            `Error updating monthly insight for user ${insight.userId?._id}:`,
            error
          );
        } catch (error) {
          console.error("Error updating insight error status:", error);
        }

        results.failed.push({
          userId: insight.userId?._id || insight.userId,
          insightId: insight._id,
          error: error.message || "Unknown error",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Monthly insight update processed ${verifiedInsights.length} insights`,
      results: {
        total: verifiedInsights.length,
        successful: results.successful.length,
        failed: results.failed.length,
        successfulInsights: results.successful,
        failedInsights: results.failed,
      },
    });
  } catch (error) {
    console.error("Global error in updateUserInsightsMonthly:", error);
    return res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while updating user insights.",
    });
  }
};

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
