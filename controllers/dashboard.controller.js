import mongoose from "mongoose";
import { Chat } from "../models/chat.model.js";
import { Journal } from "../models/journal.model.js";
import { Mood } from "../models/mood.model.js";
import { Insight } from "../models/insight.model.js";
import { UserContext } from "../models/usercontext.model.js";
import { User } from "../models/user.model.js";

// Get dashboard summary data
export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.userId;

    // Get overall activity counts
    const [moodCount, journalCount, chatCount] = await Promise.all([
      Mood.countDocuments({ userId }),
      Journal.countDocuments({ userId }),
      Chat.countDocuments({ userId }),
    ]);

    // Activity summary
    const activitySummary = {
      totalMoodEntries: moodCount,
      totalJournalEntries: journalCount,
      totalChatSessions: chatCount,
    };

    // Goal progress
    const userContext = await UserContext.findOne({ userId });

    let goalProgress = {
      totalGoals: 0,
      completedGoals: 0,
      completionRate: 0,
    };

    if (userContext && userContext.goals) {
      const totalGoals = userContext.goals.length;
      const completedGoals = userContext.goals.filter(
        (goal) => goal.completed
      ).length;

      goalProgress = {
        totalGoals,
        completedGoals,
        completionRate:
          totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0,
      };
    }

    // Get insights data
    const insights = await Insight.findOne({ userId });
    let insightsData = {
      weekly: [],
      monthly: [],
      suggestions: [],
    };

    if (insights) {
      insightsData = {
        weekly: insights.weekly || [],
        monthly: insights.monthly || [],
        suggestions: insights.suggestions || [],
      };
    }

    // Recent activity - last 5 entries of each type
    const [recentMoods, recentJournals, recentChats] = await Promise.all([
      Mood.find({ userId }).sort({ createdAt: -1 }).limit(5),
      Journal.find({ userId }).sort({ createdAt: -1 }).limit(5),
      Chat.find({ userId }).sort({ updatedAt: -1 }).limit(5),
    ]);

    const recentActivity = {
      moods: recentMoods,
      journals: recentJournals,
      chats: recentChats,
    };

    // Emotion frequency calculation
    const moods = await Mood.find({ userId });
    const emotionFrequency = {};

    moods.forEach((mood) => {
      if (mood.emotions && Array.isArray(mood.emotions)) {
        mood.emotions.forEach((emotion) => {
          emotionFrequency[emotion] = (emotionFrequency[emotion] || 0) + 1;
        });
      }
    });

    // Calculate mood trends over time (last 14 days)
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const moodsByDate = await Mood.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId.createFromHexString(userId),
          createdAt: { $gte: twoWeeksAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          emotions: { $push: "$emotions" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const moodTrends = moodsByDate.map((item) => ({
      date: item._id,
      count: item.count,
      emotions: item.emotions.flat(),
    }));

    // Get user struggles
    const struggles = userContext?.struggles || [];

    // Return all dashboard data
    return res.status(200).json({
      success: true,
      message: "Dashboard summary retrieved successfully",
      data: {
        activitySummary,
        goalProgress,
        insights: insightsData,
        recentActivity,
        emotionFrequency,
        moodTrends,
        struggles,
      },
    });
  } catch (error) {
    console.error("Error in getDashboardSummary:", error);
    return res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while retrieving dashboard data",
    });
  }
};

// Get detailed mood analytics
export const getMoodAnalytics = async (req, res) => {
  try {
    const userId = req.userId;
    const period = req.query.period || "30days"; // default to 30 days

    // Get date range based on period
    const startDate = new Date();
    if (period === "7days") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === "30days") {
      startDate.setDate(startDate.getDate() - 30);
    } else if (period === "90days") {
      startDate.setDate(startDate.getDate() - 90);
    } else if (period === "year") {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    // Get mood data within date range
    const moods = await Mood.find({
      userId,
      createdAt: { $gte: startDate },
    }).sort({ createdAt: 1 });

    // Calculate emotion frequency
    const emotionFrequency = {};
    const dailyEmotions = {};
    const allEmotions = new Set();

    moods.forEach((mood) => {
      // Format the date as YYYY-MM-DD
      const dateStr = mood.createdAt.toISOString().split("T")[0];

      if (!dailyEmotions[dateStr]) {
        dailyEmotions[dateStr] = [];
      }

      if (mood.emotions && Array.isArray(mood.emotions)) {
        mood.emotions.forEach((emotion) => {
          emotionFrequency[emotion] = (emotionFrequency[emotion] || 0) + 1;
          dailyEmotions[dateStr].push(emotion);
          allEmotions.add(emotion);
        });
      }
    });

    // Calculate emotion trends over time
    const emotionTrends = {};
    Object.keys(dailyEmotions).forEach((date) => {
      const emotions = dailyEmotions[date];
      emotions.forEach((emotion) => {
        if (!emotionTrends[emotion]) {
          emotionTrends[emotion] = {};
        }
        emotionTrends[emotion][date] = (emotionTrends[emotion][date] || 0) + 1;
      });
    });

    return res.status(200).json({
      success: true,
      message: "Mood analytics retrieved successfully",
      data: {
        moodEntries: moods.length,
        period,
        emotionFrequency,
        dailyEmotions,
        emotionTrends,
        allEmotions: Array.from(allEmotions),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while retrieving mood analytics",
    });
  }
};

// Get journal analytics
export const getJournalAnalytics = async (req, res) => {
  try {
    const userId = req.userId;
    const period = req.query.period || "30days";

    // Get date range based on period
    const startDate = new Date();
    if (period === "7days") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === "30days") {
      startDate.setDate(startDate.getDate() - 30);
    } else if (period === "90days") {
      startDate.setDate(startDate.getDate() - 90);
    } else if (period === "year") {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    // Get journals within date range
    const journals = await Journal.find({
      userId,
      createdAt: { $gte: startDate },
    }).sort({ createdAt: 1 });

    // Count journals by day
    const journalsByDay = {};
    let totalCharacters = 0;
    const emotions = {};
    const tags = {};

    journals.forEach((journal) => {
      // Format the date as YYYY-MM-DD
      const dateStr = journal.createdAt.toISOString().split("T")[0];
      journalsByDay[dateStr] = (journalsByDay[dateStr] || 0) + 1;

      // Count characters for average length
      if (journal.entry) {
        totalCharacters += journal.entry.length;
      }

      // Count emotions
      if (journal.emotions && Array.isArray(journal.emotions)) {
        journal.emotions.forEach((emotion) => {
          emotions[emotion] = (emotions[emotion] || 0) + 1;
        });
      }

      // Count tags
      if (journal.tags && Array.isArray(journal.tags)) {
        journal.tags.forEach((tag) => {
          tags[tag] = (tags[tag] || 0) + 1;
        });
      }
    });

    // Calculate average journal length
    const averageLength =
      journals.length > 0 ? Math.round(totalCharacters / journals.length) : 0;

    return res.status(200).json({
      success: true,
      message: "Journal analytics retrieved successfully",
      data: {
        journalCount: journals.length,
        period,
        journalsByDay,
        emotions,
        tags,
        averageLength,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while retrieving journal analytics",
    });
  }
};

// Get goal analytics
export const getGoalAnalytics = async (req, res) => {
  try {
    const userId = req.userId;

    const userContext = await UserContext.findOne({ userId });

    if (!userContext) {
      return res.status(404).json({
        success: false,
        message: "User context not found",
      });
    }

    const goals = userContext.goals || [];
    const completedGoals = goals.filter((goal) => goal.completed);
    const incompleteGoals = goals.filter((goal) => !goal.completed);
    const completionRate =
      goals.length > 0 ? (completedGoals.length / goals.length) * 100 : 0;

    // Count completed goals by date
    const completedByDate = {};
    completedGoals.forEach((goal) => {
      if (goal.completedAt) {
        // Format the date as YYYY-MM-DD
        const dateStr = goal.completedAt.toISOString().split("T")[0];
        completedByDate[dateStr] = (completedByDate[dateStr] || 0) + 1;
      }
    });

    return res.status(200).json({
      success: true,
      message: "Goal analytics retrieved successfully",
      data: {
        totalGoals: goals.length,
        completedGoals: completedGoals.length,
        incompleteGoals: incompleteGoals.length,
        completionRate,
        goals,
        completedByDate,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while retrieving goal analytics",
    });
  }
};

// Get insight analytics
export const getInsightAnalytics = async (req, res) => {
  try {
    const userId = req.userId;

    const insight = await Insight.findOne({ userId });

    if (!insight) {
      return res.status(404).json({
        success: false,
        message: "Insights not found",
      });
    }

    // Group insights by date
    const weeklyInsightsByDate = {};
    const monthlyInsightsByDate = {};
    const suggestionsByDate = {};

    insight.weekly.forEach((item) => {
      const dateStr = item.createdAt
        ? item.createdAt.toISOString().split("T")[0]
        : "unknown";
      if (!weeklyInsightsByDate[dateStr]) {
        weeklyInsightsByDate[dateStr] = [];
      }
      weeklyInsightsByDate[dateStr].push(item);
    });

    insight.monthly.forEach((item) => {
      const dateStr = item.createdAt
        ? item.createdAt.toISOString().split("T")[0]
        : "unknown";
      if (!monthlyInsightsByDate[dateStr]) {
        monthlyInsightsByDate[dateStr] = [];
      }
      monthlyInsightsByDate[dateStr].push(item);
    });

    insight.suggestions.forEach((item) => {
      const dateStr = item.createdAt
        ? item.createdAt.toISOString().split("T")[0]
        : "unknown";
      if (!suggestionsByDate[dateStr]) {
        suggestionsByDate[dateStr] = [];
      }
      suggestionsByDate[dateStr].push(item);
    });

    // Get latest update times
    const latestUpdate = {
      weekly: insight.lastWeeklyUpdate,
      monthly: insight.lastMonthlyUpdate,
    };

    return res.status(200).json({
      success: true,
      message: "Insight analytics retrieved successfully",
      data: {
        insightCounts: {
          weekly: insight.weekly.length,
          monthly: insight.monthly.length,
          suggestions: insight.suggestions.length,
          total:
            insight.weekly.length +
            insight.monthly.length +
            insight.suggestions.length,
        },
        weeklyInsightsByDate,
        monthlyInsightsByDate,
        suggestionsByDate,
        latestUpdate,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while retrieving insight analytics",
    });
  }
};

// Get chat analytics
export const getChatAnalytics = async (req, res) => {
  try {
    const userId = req.userId;
    const period = req.query.period || "30days";

    // Get date range based on period
    const startDate = new Date();
    if (period === "7days") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === "30days") {
      startDate.setDate(startDate.getDate() - 30);
    } else if (period === "90days") {
      startDate.setDate(startDate.getDate() - 90);
    } else if (period === "year") {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    // Get chats within date range
    const chats = await Chat.find({
      userId,
      createdAt: { $gte: startDate },
    }).sort({ createdAt: 1 });

    // Count chats by day
    const chatsByDay = {};
    const messagesByDay = {};
    let totalMessages = 0;
    let userMessages = 0;
    let aiMessages = 0;

    chats.forEach((chat) => {
      // Format the date as YYYY-MM-DD
      const dateStr = chat.createdAt.toISOString().split("T")[0];
      chatsByDay[dateStr] = (chatsByDay[dateStr] || 0) + 1;

      if (!messagesByDay[dateStr]) {
        messagesByDay[dateStr] = { user: 0, ai: 0, total: 0 };
      }

      // Count messages
      if (chat.messages && Array.isArray(chat.messages)) {
        chat.messages.forEach((msg) => {
          totalMessages++;
          if (msg.sender === "user") {
            userMessages++;
            messagesByDay[dateStr].user++;
          } else if (msg.sender === "ai") {
            aiMessages++;
            messagesByDay[dateStr].ai++;
          }
          messagesByDay[dateStr].total++;
        });
      }
    });

    // Calculate average messages per chat
    const averageMessagesPerChat =
      chats.length > 0 ? Math.round(totalMessages / chats.length) : 0;

    return res.status(200).json({
      success: true,
      message: "Chat analytics retrieved successfully",
      data: {
        totalChats: chats.length,
        totalMessages,
        messageBreakdown: {
          user: userMessages,
          ai: aiMessages,
        },
        averageMessagesPerChat,
        period,
        chatsByDay,
        messagesByDay,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while retrieving chat analytics",
    });
  }
};
