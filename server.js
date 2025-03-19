import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./utils/db.js";
import {
  authRoutes,
  userContextRoutes,
  journalRoutes,
  moodRoutes,
  insightRoutes,
  cronRoutes,
  chatRoutes,
} from "./routes/index.js";

dotenv.config();

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/context", userContextRoutes);
app.use("/api/v1/journals", journalRoutes);
app.use("/api/v1/moods", moodRoutes);
app.use("/api/v1/insights", insightRoutes);
app.use("/api/v1/chats", chatRoutes);
app.use("/api/v1/cron", cronRoutes);

const PORT = process.env.PORT || 8888;

app.get("/", (req, res) => {
  res.send("Welcome to Jiso!");
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Jiso backend running at port: ${PORT}!`);
});
