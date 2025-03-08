import { summarizeJournal } from "../ai/journal.ai.js";
import { Journal } from "../models/journal.model.js";

// User Contexts

export const updateUserContextsWeekly = async (req, res) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== process.env.CRON_API_KEY) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Valid API key is required.",
    });
  }
  /*
    Plan:
    1. Get all users
    2. For each user:
        - Grab user context
        - Fetch summaries of all journals from the last 7 days
        - Calculate mood themes for the week
        - Grab chat summaries from the last 7 days
        - Grab goals and struggles from the context
        - Join all the above data
        - Feed the data to the AI model
        - Get journal themes, mood themes, and chat themes
        - Update the user context with the new weekly themes

    3. Return completion or error message
  */
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

    const pendingJournals = await Journal.find({ summaryStatus: "pending" });

    if (pendingJournals.length === 0) {
      return;
    }

    // loop through pending journals and summarize them
    for (let journal of pendingJournals) {
      //summarize journal
      await summarizeJournal(journal);
    }

    res.status(200).json({
      success: true,
      message: "Summarized all pending journals.",
      count: pendingJournals.length,
      entries: pendingJournals,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred while summarizing journals.",
    });
  }
};
