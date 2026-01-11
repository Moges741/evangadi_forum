import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import answerRoutes from "./routes/answerRoute.js";
import userRoutes from "./routes/userRoutes.js";
import questionRoutes from "./routes/questionRoute.js";
import authMiddleware from "./middleware/authMiddleware.js";
import chatRoutes from "./routes/chatRoutes.js";
import dbconnection from "./DB/dbconfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:4173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);

app.use(express.json());

// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

dotenv.config();
const PORT = process.env.PORT || 5500;

// question routes middleware
app.use("/api/question", authMiddleware, questionRoutes);

// userRoutes middleware
app.use("/api/user", userRoutes);

// chatRoutes middleware
app.use("/api/chat", authMiddleware, chatRoutes);

// answerRoutes middleware
app.use("/api/answer", authMiddleware, answerRoutes);

async function startServer() {
  try {
    await dbconnection.execute("SELECT 'test'");
    console.log("Database connected...");
    app.listen(PORT);
    console.log(`Server running on: http://localhost:${PORT}`);
  } catch (error) {
    console.log("Database connection failed: ", error.message);
  }
}

startServer();
