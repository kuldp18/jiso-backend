import { UserContext } from "../models/usercontext.model.js";

// USER CONTEXT

// create default user context
export const createDefaultUserContext = async (userId) => {
  try {
    const newUserContext = new UserContext({ userId });
    await newUserContext.save();
  } catch (error) {
    console.error(
      error.message ||
        "Something went wrong while creating default user context"
    );
  }
};

// update user context: onboarding
export const updateUserContext = async (req, res) => {
  const { goals, struggles } = req.body;

  if (!Array.isArray(goals) || !Array.isArray(struggles)) {
    return res.status(400).json({
      success: false,
      message: "Goals and struggles should be arrays",
    });
  }

  if (goals.length === 0 && struggles.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Goals and struggles should not be empty",
    });
  }

  try {
    const userContext = await UserContext.findOne({ userId: req.userId });
    if (!userContext) {
      return res.status(404).json({
        success: false,
        message: "No context for this user found",
      });
    }

    if (goals.length > 0) {
      userContext.goals = goals;
    }

    if (struggles.length > 0) {
      userContext.struggles = struggles;
    }

    const updatedContext = await userContext.save();
    res.status(200).json({
      success: true,
      message: "User context updated successfully",
      context: updatedContext,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Something went wrong while updating user context",
    });
  }
};

// get user context
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

// TODO :  WILL NOT WORK WITH CRON JOBS!
// create journal theme (weekly or monthly)
export const createJournalTheme = async (req, res) => {
  let { type, theme, description } = req.body;

  try {
    if (!type || !theme) {
      return res.status(400).json({
        success: false,
        message: "A theme, type and description(optional) are required",
      });
    }

    if (type !== "weekly" && type !== "monthly") {
      return res.status(400).json({
        success: false,
        message: "Theme type should only be: weekly or monthly",
      });
    }

    if (!description) {
      description = "";
    }

    let userContext = await UserContext.findOne({ userId: req.userId });

    if (!userContext) {
      return res.status(404).json({
        success: false,
        message: "No context found for this user",
      });
    }

    //   create and save journal theme
    userContext.journalThemes[type].push({ theme, description });
    const updatedContext = await userContext.save();

    res.status(201).json({
      success: true,
      message: `${type} journal theme created successfully`,
      context: updatedContext,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Something went wrong while creating journal theme",
    });
  }
};

// create mood theme (weekly or monthly)
export const createMoodTheme = async (req, res) => {
  let { type, theme, description } = req.body;

  try {
    if (!type || !theme) {
      return res.status(400).json({
        success: false,
        message: "A theme, type and description(optional) are required",
      });
    }

    if (type !== "weekly" && type !== "monthly") {
      return res.status(400).json({
        success: false,
        message: "Theme type should only be: weekly or monthly",
      });
    }

    if (!description) {
      description = "";
    }

    let userContext = await UserContext.findOne({ userId: req.userId });

    if (!userContext) {
      return res.status(404).json({
        success: false,
        message: "No context found for this user",
      });
    }

    //   create and save mood theme
    userContext.moodThemes[type].push({ theme, description });
    const updatedContext = await userContext.save();

    res.status(201).json({
      success: true,
      message: `${type} mood theme created successfully`,
      context: updatedContext,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Something went wrong while creating journal theme",
    });
  }
};
