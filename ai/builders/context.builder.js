// User Context - Update weekly themes
export const contextBuilderWeekly = (contextObj) => {
  const { basicInfo, moods, journals, chats, goals, struggles } = contextObj;

  const { firstName, lastName, age, gender } = basicInfo;

  // Format user basic info
  let userInfoString = "--- User Information ---\n";
  userInfoString += `Name: ${firstName} ${lastName}\n`;
  userInfoString += `Age: ${age}\n`;
  userInfoString += `Gender: ${gender}\n\n`;

  const userGoalsString =
    goals.length > 0
      ? `User Goals: ${goals?.join(", ")}\n`
      : "User Goals: None\n";

  const userStrugglesString =
    struggles.length > 0
      ? `User Struggles: ${struggles?.join(", ")}\n\n`
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
