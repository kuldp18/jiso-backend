import { Mood } from "../models/mood.model.js";

// fetch last week moods
export const fetchLastWeekMoods = async (userId) => {
  try {
    const lastWeekMoods = await Mood.find({
      userId,
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    });

    if (!lastWeekMoods || lastWeekMoods.length === 0) {
      return [];
    }

    // parse moods. each mood has emotions array and optional description
    const parsedMoods = lastWeekMoods.map((mood) => {
      return {
        emotions: mood.emotions.join(", "),
        description: mood.description || "none",
        date: mood.createdAt.toDateString(),
      };
    });

    return parsedMoods;
  } catch (error) {
    console.error("Error fetching last week moods: ", error);
    return [];
  }
};

// fetch last month moods
export const fetchLastMonthMoods = async (userId) => {
  try {
    const lastMonthMoods = await Mood.find({
      userId,
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    });

    if (!lastMonthMoods || lastMonthMoods.length === 0) {
      return [];
    }

    // parse moods. each mood has emotions array and optional description
    const parsedMoods = lastMonthMoods.map((mood) => {
      return {
        emotions: mood.emotions.join(", "),
        description: mood.description || "none",
        date: mood.createdAt.toDateString(),
      };
    });

    return parsedMoods;
  } catch (error) {
    console.error("Error fetching last month moods: ", error);
    return [];
  }
};
