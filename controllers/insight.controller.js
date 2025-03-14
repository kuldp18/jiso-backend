import { Insight } from "../models/insight.model.js";
import { UserContext } from "../models/usercontext.model.js";

// created automatically on user signup
export const createDefaultInsight = async (userId) => {
  try {
    const userContext = await UserContext.findOne({ userId });

    if (!userContext) {
      const insight = await Insight.create({ userId });

      await insight.save();
    } else {
      const insight = await Insight.create({
        userId,
        userContext: userContext._id,
      });

      await insight.save();
    }
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

// clear user insights

export const clearUserInsights = async (req, res) => {
  try {
    const userInsight = await Insight.findOne({ userId: req.userId });

    if (!userInsight) {
      return res.status(404).json({
        success: false,
        message: "Insight not found or does not exist",
      });
    }

    userInsight.weekly = [];
    userInsight.monthly = [];
    userInsight.suggestions = [];

    userInsight.lastMonthlyUpdate = null;
    userInsight.lastMonthlyUpdateStatus = "pending";
    userInsight.lastWeeklyUpdate = null;
    userInsight.lastWeeklyUpdateStatus = "pending";

    const updatedInsight = await userInsight.save();

    res.status(200).json({
      success: true,
      message: "User insights cleared successfully",
      insight: updatedInsight,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Something went wrong while clearing user insights",
    });
  }
};
