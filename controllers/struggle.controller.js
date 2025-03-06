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

// add struggles list
export const addStruggles = async (req, res) => {};
// fetch all struggles
export const fetchAllStruggles = async (req, res) => {};
// fetch single struggle
export const fetchSingleStruggle = async (req, res) => {};
// change severity
export const changeSeverity = async (req, res) => {};
// update struggle
export const updateStruggle = async (req, res) => {};
// delete struggle
export const deleteStruggle = async (req, res) => {};
// delete all struggles
export const deleteAllStruggles = async (req, res) => {};
