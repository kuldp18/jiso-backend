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

// get user insight
export const getUserInsight = async (req, res) => {
  try {
    const userInsight = await Insight.findOne({ userId: req.userId });

    if (!userInsight) {
      return res.status(404).json({
        success: false,
        message: "Insight not found or does not exist",
      });
    }

    res.status(200).json({
      success: true,
      message: "User insight retrieved successfully",
      insight: userInsight,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Something went wrong while fetching user insight",
    });
  }
};
