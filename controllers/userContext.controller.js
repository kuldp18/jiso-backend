import { UserContext } from "../models/usercontext.model.js";

export const createUserContext = async (req, res) => {
  const { goals, struggles } = req.body;

  try {
    if (!goals || goals.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please fill in at least one of your goals",
      });
    }

    if (!struggles || struggles.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please fill in at least one of your struggles",
      });
    }

    // check if context already exists

    const existingContext = await UserContext.findOne({
      userId: req.userId,
    });

    if (existingContext) {
      return res.status(400).json({
        success: false,
        message: "A context already exists for this user",
        contextId: existingContext._id,
      });
    }

    const newUserContext = new UserContext({
      userId: req.userId,
      goals,
      struggles,
    });

    const savedContext = await newUserContext.save();

    res.status(201).json({
      success: true,
      message: "New user context created successfully",
      context: savedContext,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "Something went wrong while creating user context",
    });
  }
};

export const getUserContext = async (req, res) => {
  try {
    const userContext = await UserContext.findOne({ userId: req.userId });

    if (!userContext) {
      return res.status(404).json({
        success: false,
        message: "No context for this user found",
      });
    }

    res.status(200).json({
      success: true,
      context: userContext,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Something went wrong while fetching user context",
    });
  }
};
