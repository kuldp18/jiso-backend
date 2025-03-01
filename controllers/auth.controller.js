import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import {
  generateEmailVerificationToken,
  generateRefreshToken,
  generateTokenAndSetCookie,
  setRefreshTokenCookie,
} from "../utils/auth.utils.js";

export const signup = async (req, res) => {
  const { name, email, password, gender, age } = req.body;

  try {
    // make sure all fields are there
    if (!name || !email || !password || !gender || !age) {
      throw new Error("All fields are required.");
    }

    // check if user already exists
    const doesUserExist = await User.findOne({ email });

    if (doesUserExist) {
      throw new Error("A user with the provided email already exists");
    }

    // TODO : a temp email check can be done here

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const emailVerificationToken = generateEmailVerificationToken();

    // create new user and save
    const user = new User({
      email,
      password: hashedPassword,
      name,
      gender: gender || null,
      age: age || null,
      emailVerificationToken,
      emailVerificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, //24hrs
    });

    await user.save();

    // generate auth and refresh tokens
    generateTokenAndSetCookie(res, user._id);
    const refreshToken = generateRefreshToken(user._id);
    setRefreshTokenCookie(res, refreshToken);

    // update and save user with refresh token
    user.refreshToken = refreshToken;
    user.refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    user.lastLogin = new Date();

    await user.save();

    // TODO : send verification email here

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        age: user.age,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: "false",
        message: "Please provide your email and password to login.",
      });
    }

    const user = await User.findOne({ email });

    // if no user found with email, then stop
    if (!user) {
      return res.status(404).json({
        success: "false",
        message: "Invalid credentials or user not found",
      });
    }

    // check if the user is already logged in
    const userRefreshToken = req.cookies?.refreshToken;
    if (userRefreshToken) {
      const decoded = jwt.verify(
        userRefreshToken,
        process.env.JWT_REFRESH_SECRET
      );
      if (decoded) {
        return res.status(400).json({
          success: "false",
          message: "You are already logged in",
        });
      }
    }

    // check is password is valid

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(403).json({
        success: false,
        message: "Invalid email or password provided",
      });
    }

    // generate tokens
    generateTokenAndSetCookie(res, user._id);
    const refreshToken = generateRefreshToken(user._id);

    // save refresh token to user
    user.refreshToken = refreshToken;
    user.refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    user.lastLogin = new Date();

    // set refresh token
    setRefreshTokenCookie(res, refreshToken);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        gender: user.gender,
        age: user.age,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while logging you in. Please try again later.",
    });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear both tokens from cookies
    res.clearCookie("token");
    res.clearCookie("refreshToken");

    // Clear refresh token from database if user is authenticated
    if (req.userId) {
      await User.findByIdAndUpdate(req.userId, {
        refreshToken: null,
        refreshTokenExpiresAt: null,
      });
    }

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong during logout.",
    });
  }
};
