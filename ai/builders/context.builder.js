// User Context - Update weekly and monthly themes
export const userContextBuilder = (contextObj) => {
  const { basicInfo, moods, journals, chats, goals, struggles } = contextObj;

  const { firstName, lastName, age, gender } = basicInfo;

  // Format user basic info
  let userInfoString = "--- User Information ---\n";
  userInfoString += `Name: ${firstName} ${lastName}\n`;
  userInfoString += `Age: ${age}\n`;
  userInfoString += `Gender: ${gender}\n\n`;

  // each goal has a goal and description
  const parsedUserGoals = goals.map(
    (goal) => `${goal.goal}: ${goal?.description || "no goal description"}\n`
  );

  // each struggle has a struggle and description and severity
  const parsedUserStruggles = struggles.map(
    (struggle) =>
      `${struggle.struggle}: ${
        struggle?.description || "no struggle description"
      } (severity(ignore if -1): ${struggle.severity})\n`
  );

  const userGoalsString =
    parsedUserGoals.length > 0
      ? `User Goals: ${parsedUserGoals.join("")}\n\n`
      : "User Goals: None\n";

  const userStrugglesString =
    parsedUserStruggles.length > 0
      ? `User Struggles: ${parsedUserStruggles.join("")}\n\n`
      : "User Struggles: None\n\n";

  // Format mood data
  let moodString = "--- Mood Records ---\n";
  if (moods && moods.length > 0) {
    moods.forEach((mood, index) => {
      moodString += `Entry ${index + 1} [${mood.date}]:\n`;
      moodString += `• Emotions: ${mood.emotions}\n`;
      if (mood.description)
        moodString += `• Description: ${mood.description}\n`;
      moodString += "\n";
    });
  } else {
    moodString += "No mood entries recorded.\n\n";
  }

  // Format journal data
  let journalString = "--- Journal Entries ---\n";
  if (journals && journals.length > 0) {
    journals.forEach((journal, index) => {
      const { summaries, emotions, date } = journal;
      journalString += `Entry ${index + 1} [${date}]:\n`;
      journalString += `• Summary: ${summaries.medium}\n`;
      if (emotions) journalString += `• Emotions: ${emotions}\n`;
      journalString += "\n";
    });
  } else {
    journalString += "No journal entries recorded.\n\n";
  }
  // Format chat data
  let chatString = "--- Chat History ---\n";
  if (chats && chats.length > 0) {
    chats.forEach((chat, index) => {
      chatString += `Chat ${index + 1} [${chat.date}]:\n`;
      chatString += `• Summary: ${chat.summary}\n\n`;
    });
  } else {
    chatString += "No chat history recorded.\n\n";
  }

  // Combine all sections into a single context string
  const contextString =
    userInfoString +
    userGoalsString +
    userStrugglesString +
    moodString +
    journalString +
    chatString;

  return contextString;
};

// User Insight - Update weekly and monthly insights

export const userInsightBuilder = (insightObj) => {
  const { basicInfo, goals, struggles, themes } = insightObj;

  const { firstName, lastName, age, gender } = basicInfo;
  const { moodThemes, journalThemes, chatThemes } = themes;

  // Format user basic info
  let userInfoString = "--- User Information ---\n";
  userInfoString += `Name: ${firstName} ${lastName}\n`;
  userInfoString += `Age: ${age}\n`;
  userInfoString += `Gender: ${gender}\n\n`;

  // Format user goals and struggles
  // each goal has a goal and description
  const parsedUserGoals = goals.map(
    (goal) => `${goal.goal}: ${goal?.description || "no goal description"}\n`
  );

  // each struggle has a struggle and description and severity
  const parsedUserStruggles = struggles.map(
    (struggle) =>
      `${struggle.struggle}: ${
        struggle?.description || "no struggle description"
      } (severity(ignore if -1): ${struggle.severity})\n`
  );

  const userGoalsString =
    parsedUserGoals.length > 0
      ? `User Goals: ${parsedUserGoals.join("")}\n\n`
      : "User Goals: None\n";

  const userStrugglesString =
    parsedUserStruggles.length > 0
      ? `User Struggles: ${parsedUserStruggles.join("")}\n\n`
      : "User Struggles: None\n\n";

  let moodString = "--- Mood Themes ---\n";
  if (moodThemes && moodThemes.length > 0) {
    moodThemes.forEach((theme, index) => {
      moodString += `Theme ${index + 1} [${theme.date}]:\n`;
      moodString += `• Theme: ${theme.theme}\n`;
      if (theme.description)
        moodString += `• Description: ${theme.description}\n`;
      moodString += "\n";
    });
  } else {
    moodString += "No mood themes recorded.\n\n";
  }

  let journalString = "--- Journal Themes ---\n";
  if (journalThemes && journalThemes.length > 0) {
    journalThemes.forEach((theme, index) => {
      journalString += `Theme ${index + 1} [${theme.date}]:\n`;
      journalString += `• Theme: ${theme.theme}\n`;
      if (theme.description)
        journalString += `• Description: ${theme.description}\n`;
      journalString += "\n";
    });
  } else {
    journalString += "No journal themes recorded.\n\n";
  }

  let chatString = "--- Chat Themes ---\n";
  if (chatThemes && chatThemes.length > 0) {
    chatThemes.forEach((theme, index) => {
      chatString += `Theme ${index + 1} [${theme.date}]:\n`;
      chatString += `• Theme: ${theme.theme}\n`;
      if (theme.description)
        chatString += `• Description: ${theme.description}\n`;
      chatString += "\n";
    });
  } else {
    chatString += "No chat themes recorded.\n\n";
  }

  // Combine all sections into a single insight string
  const insightString =
    userInfoString +
    userGoalsString +
    userStrugglesString +
    moodString +
    journalString +
    chatString;

  return insightString;
};
