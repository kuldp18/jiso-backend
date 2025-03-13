import { UserContext } from "../models/usercontext.model.js";

// fetch weekly context themes in a batch of n

export const fetchWeeklyContextBatch = async (userId, n = 4) => {
  try {
    const userContext = await UserContext.findOne({ userId });

    if (!userContext) {
      return [];
    }

    const moodThemes = userContext.moodThemes.weekly
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, n);

    const chatThemes = userContext.chatThemes.weekly
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, n);

    const journalThemes = userContext.journalThemes.weekly
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, n);

    return {
      moodThemes,
      chatThemes,
      journalThemes,
    };
  } catch (error) {
    console.error(`Error fetching context themes: ${error.message}`);
    return [];
  }
};

// fetch monthly context themes in a batch of n
export const fetchMonthlyContextBatch = async (userId, n = 6) => {
  try {
    const userContext = await UserContext.findOne({ userId });

    if (!userContext) {
      return [];
    }

    const moodThemes = userContext.moodThemes.monthly
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, n);

    const chatThemes = userContext.chatThemes.monthly
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, n);

    const journalThemes = userContext.journalThemes.monthly
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, n);

    return {
      moodThemes,
      chatThemes,
      journalThemes,
    };
  } catch (error) {
    console.error(`Error fetching context themes: ${error.message}`);
    return [];
  }
};
