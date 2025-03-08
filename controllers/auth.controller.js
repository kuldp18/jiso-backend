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
import {
  sendEmailVerificationEmail,
  sendPasswordResetEmail,
} from "../mailersend/mails.js";
import { createDefaultInsight } from "./insight.controller.js";
import { createDefaultUserContext } from "./userContext.controller.js";

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

    // send verification email
    await sendEmailVerificationEmail(user);

    // create default insight document
    await createDefaultInsight(user._id);
    // create default user context
    await createDefaultUserContext(user._id);

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

export const verifyEmail = async (req, res) => {
  const { code, email } = req.body;

  if (!code || !email) {
    return res.status(400).json({
      success: false,
      message: "An email and a code are required",
    });
  }

  try {
    const user = await User.findOne({
      email: email,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // check if user is already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Your email is already verified",
      });
    }

    // Validate verification code and expiration time
    if (
      user.emailVerificationToken !== code ||
      user.emailVerificationTokenExpiresAt <= Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired email verification code",
      });
    }

    // verify the user identity
    user.isEmailVerified = true;

    // clear email verification info
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpiresAt = undefined;

    // save the user object
    await user.save();

    // TODO : send a welcome email (optional)

    res.status(200).json({
      success: true,
      message: "Your email has been verified",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        verified: user.isEmailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Something went wrong while verifying your email. Please try again later.",
    });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "We cannot find the user with the provided email. Please recheck the email or try again later.",
      });
    }

    // if we have existing valid token, skip sending email again

    if (
      user.resetPasswordToken &&
      user.resetPasswordTokenExpiresAt > Date.now()
    ) {
      return res.status(200).json({
        success: true,
        message:
          "We have already sent you a password reset link. Please check your email.",
      });
    }

    //generate password reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; //after 1hr

    // add reset token to user object
    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;

    // save user
    await user.save();

    // send password reset email

    await sendPasswordResetEmail(user, resetToken);

    res.status(200).json({
      success: true,
      message: "A password reset link has been sent to your email.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Something went wrong while doing the forgot-password operation. Please try again later.",
    });
  }
};

export const resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  const { token } = req.params;

  if (!newPassword || !token) {
    return res.status(400).json({
      success: false,
      message: "A new password is required with the reset token",
    });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // update the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Your password has been reset successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Something went wrong while resetting your password. Please try again later.",
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found",
      });
    }

    // verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user and check if refresh token matches
    const user = await User.findOne({
      _id: decoded.userId,
      refreshToken: refreshToken,
      refreshTokenExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Generate new access token and refresh token
    generateTokenAndSetCookie(res, user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Update user with new refresh token
    user.refreshToken = newRefreshToken;
    user.refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Set new refresh token cookie
    setRefreshTokenCookie(res, newRefreshToken);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error refreshing access token",
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User is authenticated",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: true,
      message: "User is not authenticated",
    });
  }
};
