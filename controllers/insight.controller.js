import { Insight } from "../models/insight.model.js";

// created automatically on user signup
export const createDefaultInsight = async (userId) => {
  try {
    const insight = await Insight.create({ userId });

    await insight.save();
  } catch (error) {
    console.error(
      `Something went wrong while creating default insight: ${error}`
    );
  }
};
