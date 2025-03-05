import { UserContext } from "../models/usercontext.model.js";

// USER CONTEXT

// create new user context
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

// GOALS

// add a new goal
export const addGoal = async (req, res) => {
  let { goal, description } = req.body;

  try {
    if (!goal) {
      return res.status(400).json({
        success: false,
        message: "A goal is required",
      });
    }

    const userContext = await UserContext.findOne({ userId: req.userId });

    if (!userContext) {
      return res.status(404).json({
        success: false,
        message: "Couldn't find a context for this user",
      });
    }

    userContext.goals.push({ goal, description });

    const savedContext = await userContext.save();

    res.status(200).json({
      success: true,
      message: "New goal added in the user context",
      context: savedContext,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Something went wrong while adding new goal in the user context",
    });
  }
};

// add new goals as array: [item1,item2...]
export const addGoals = async (req, res) => {
  let { newGoals } = req.body;

  try {
    if (!newGoals || newGoals.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a `newGoals` array with at least one goal item",
      });
    }

    if (!Array.isArray(newGoals)) {
      return res.status(400).json({
        success: false,
        message: "`newGoals` should be an array of goal items",
      });
    }

    const userContext = await UserContext.findOne({ userId: req.userId });

    if (!userContext) {
      return res.status(404).json({
        success: false,
        message: "Couldn't find a context for this user",
      });
    }

    //   merge goals
    const updatedGoals = [...userContext.goals, ...newGoals];
    userContext.goals = updatedGoals;

    //   save context
    const updatedContext = await userContext.save();

    res.status(200).json({
      success: true,
      message: "Goals updated successfully",
      context: updatedContext,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Something went wrong while add new goals in the user context",
    });
  }
};

// fetch all goals
export const getGoals = async (req, res) => {
  try {
    const userContext = await UserContext.findOne({ userId: req.userId });

    if (!userContext) {
      return res.status(404).json({
        success: false,
        message: "Couldn't find a context for this user",
      });
    }

    res.status(200).json({
      success: true,
      messages: "User goals found successfully",
      contextId: userContext._id,
      goals: userContext.goals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Something went wrong while fetching user goals",
    });
  }
};

// fetch single goal
export const getSingleGoal = async (req, res) => {
  const { goalId } = req.params;

  try {
    if (!goalId) {
      return res.status(400).json({
        success: false,
        message: "Provide a goal id in the url",
      });
    }

    const userContext = await UserContext.findOne({ userId: req.userId });

    if (!userContext) {
      return res.status(404).json({
        success: false,
        message: "Couldn't find a context for this user",
      });
    }

    const userGoals = userContext.goals;

    const goals = userGoals.filter(
      (userGoal) => userGoal._id.toString() === goalId
    );

    if (goals.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Goal found",
      result: goals[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while fetching your goal",
    });
  }
};

// delete all goals

export const deleteAllGoals = async (req, res) => {
  try {
    const userContext = await UserContext.findOne({ userId: req.userId });

    if (!userContext) {
      return res.status(400).json({
        success: false,
        message: "Couldn't find a context for this user",
      });
    }

    if (userContext.goals.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Goals are already empty",
      });
    }

    userContext.goals = [];
    const updatedContext = await userContext.save();

    res.status(200).json({
      success: true,
      message: "All goals have been deleted successfully",
      context: updatedContext,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Something went wrong while deleting all the goals",
    });
  }
};

// delete single goal

// toggle goal completion

// edit goal

// For AI
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
