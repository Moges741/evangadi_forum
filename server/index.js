import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import answerRoutes from "./routes/answerRoute.js";
import userRoutes from "./routes/userRoutes.js";
import questionRoutes from "./routes/questionRoute.js";
import chatRoutes from "./routes/chatRoutes.js";
import dbconnection from "./DB/dbconfig.js";
import authMiddleware from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://studentsforum.vercel.app",
  "https://studentsforum-b8m6a4pwc-moges-sisays-projects-c5465d4e.vercel.app"
];

// ✅ SAFE CORS (NO ERRORS THROWN)
app.use(cors({
  origin: (origin, callback) => {
    // allow Postman, curl, server-to-server
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // ❗ DO NOT THROW ERROR
    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Explicit preflight safety (Express 4 & 5 safe)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/test", (req, res) => {
  res.send("API is running");
});

// Routes (unchanged)
app.use("/api/user", userRoutes);
app.use("/api/question", authMiddleware, questionRoutes);
app.use("/api/chat", authMiddleware, chatRoutes);
app.use("/api/answer", authMiddleware, answerRoutes);

async function startServer() {
  try {
    await dbconnection.execute("SELECT 1");
    console.log("Database connected");

    const PORT = process.env.PORT || 5500;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("DB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
