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
      password,
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

    await user.save();

    // TODO : send verification email here

    res.status(201).json({
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
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {};
