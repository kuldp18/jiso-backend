import { UserContext } from "../models/usercontext.model.js";

// add struggle
export const addStruggle = async (req, res) => {
  const { struggle, description, severity } = req.body;
  try {
    if (!struggle) {
      return res.status(400).json({
        success: false,
        message: "A `struggle` field is required",
      });
    }

    const userContext = await UserContext.findOne({ userId: req.userId });

    if (!userContext) {
      return res.status(400).json({
        success: false,
        message: "Couldn't find a context for this user",
      });
    }

    userContext.struggles.push({ struggle, description, severity });

    const updatedContext = await userContext.save();

    return res.status(201).json({
      success: true,
      message: "New struggle added in the user context",
      context: updatedContext,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Something went wrong while adding a new struggle",
    });
  }
};

// add struggles as list
export const addStruggles = async (req, res) => {
  const { struggles } = req.body;
  try {
    if (!struggles || struggles.length === 0) {
      return res.status(400).json({
        success: false,
        message: "A non-empty `struggles` array is required to add",
      });
    }

    if (!Array.isArray(struggles)) {
      return res.status(400).json({
        success: false,
        message:
          "`struggles` should be an array with at least one struggle item",
      });
    }

    const userContext = await UserContext.findOne({ userId: req.userId });

    if (!userContext) {
      return res.status(400).json({
        success: false,
        message: "Couldn't find a context for this user",
      });
    }

    const userStruggles = userContext.struggles;
    const newStruggles = [...userStruggles, ...struggles];

    userContext.struggles = newStruggles;

    const updatedContext = await userContext.save();

    res.status(200).json({
      success: true,
      message: "New struggles successfully added in the context",
      context: updatedContext,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Something went wrong while adding these struggles in the context",
    });
  }
};
// fetch all struggles
export const fetchAllStruggles = async (req, res) => {
  try {
    const userContext = await UserContext.findOne({ userId: req.userId });
    if (!userContext) {
      return res.status(400).json({
        success: false,
        message: "Couldn't find a context for this user",
      });
    }

    if (userContext.struggles.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No user struggles found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User struggles found successfully",
      struggles: userContext.struggles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Something went wrong while fetching user struggles",
    });
  }
};
// fetch single struggle
export const fetchSingleStruggle = async (req, res) => {
  const { struggleId } = req.params;

  try {
    if (!struggleId) {
      return res.status(400).json({
        success: false,
        message: "Provide a struggleId to fetch a struggle",
      });
    }

    const userContext = await UserContext.findOne({ userId: req.userId });

    if (!userContext) {
      return res.status(400).json({
        success: false,
        message: "Couldn't find a context for this user",
      });
    }

    // find if the struggle exists
    const struggleIndex = userContext.struggles.findIndex(
      (struggle) => struggle._id.toString() === struggleId
    );

    if (struggleIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Invalid struggleId or struggle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Struggle found successfully",
      result: userContext.struggles[struggleIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Something went wrong while finding struggle in the context",
    });
  }
};
// change severity
export const changeSeverity = async (req, res) => {};
// update struggle
export const updateStruggle = async (req, res) => {};
// delete struggle
export const deleteStruggle = async (req, res) => {};
// delete all struggles
export const deleteAllStruggles = async (req, res) => {
  try {
    const userContext = await UserContext.findOne({ userId: req.userId });
    if (!userContext) {
      return res.status(400).json({
        success: false,
        message: "Couldn't find a context for this user",
      });
    }

    // remove all struggles
    userContext.struggles = [];
    const updatedContext = await userContext.save();

    res.status(200).json({
      success: true,
      message: "All struggles deleted successfully",
      context: updatedContext,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Something went wrong while deleting the struggles",
    });
  }
};
