import { Journal } from "../models/journal.model.js";

// fetch last week journal summaries

export const fetchLastWeekJournalSummaries = async (userId) => {
  try {
    const journals = await Journal.find({
      userId,
      summaryStatus: "complete",
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    });

    if (!journals || journals.length === 0) {
      return [];
    }

    const parsedJournals = journals.map((journal) => {
      return {
        summaries: journal.summaries,
        emotions: journal.emotions?.join(", ") || "none",
        date: journal.createdAt.toDateString(),
      };
    });

    return parsedJournals;
  } catch (error) {
    console.error("Error fetching last week journal summaries: ", error);
    return [];
  }
};
