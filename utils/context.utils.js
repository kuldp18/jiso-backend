// fetch weekly context themes in a batch of n

export const fetchWeeklyThemeBatch = async (userContext, n = 4) => {
  try {
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
export const fetchMonthlyThemeBatch = async (userContext, n = 6) => {
  try {
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
