import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./utils/db.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/v1/auth", authRoutes);

const PORT = process.env.PORT || 8888;

app.get("/", (req, res) => {
  res.send("Welcome to Jiso!");
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Jiso backend running at port: ${PORT}!`);
});
