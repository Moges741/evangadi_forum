// import dotenv from "dotenv";

// import express from "express";
// import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";
// import answerRoutes from "./routes/answerRoute.js";
// import userRoutes from "./routes/userRoutes.js";
// import questionRoutes from "./routes/questionRoute.js";
// import chatRoutes from "./routes/chatRoutes.js";
// import dbconnection from "./DB/dbconfig.js";
// import authMiddleware from "./middleware/authMiddleware.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// dotenv.config();
// const app = express();

// // CORS configuration
// app.use(cors());

// app.use(express.json());

// // Serve static files for uploaded images
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// const PORT = process.env.PORT || 5500;

// app.get("/test", (req, res) => {
//   res.send("API is running");
// });

// // question routes middleware
// app.use("/api/question", authMiddleware, questionRoutes);

// // userRoutes middleware
// app.use("/api/user", userRoutes);

// // chatRoutes middleware
// app.use("/api/chat", authMiddleware, chatRoutes);

// // answerRoutes middleware
// app.use("/api/answer", authMiddleware, answerRoutes);

// async function startServer() {
//   try {
//     await dbconnection.execute("SELECT 'test'");
//     console.log("Database connected...");
//     app.listen(PORT);
//     console.log(`Server running on: http://localhost:${PORT}`);
//   } catch (error) {
//     console.log("Database connection failed: ", error.message);
//   }
// }

// startServer();

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration - Update for production
const allowedOrigins = [
  'http://localhost:3000',
  'https://studentsforum-b8m6a4pwc-moges-sisays-projects-c5465d4e.vercel.app',
  'https://studentsforum.vercel.app/',
  'https://evangadi-forum-1-edti.onrender.com',


];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());

// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5500;

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "healthy",
    message: "API is running",
    timestamp: new Date().toISOString()
  });
});

app.get("/test", (req, res) => {
  res.send("API is running");
});

// Routes
app.use("/api/question", authMiddleware, questionRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", authMiddleware, chatRoutes);
app.use("/api/answer", authMiddleware, answerRoutes);

async function startServer() {
  try {
    await dbconnection.execute("SELECT 'test'");
    console.log("Database connected...");
    
    // Listen on all network interfaces (important for Render)
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port: ${PORT}`);
    });
  } catch (error) {
    console.log("Database connection failed: ", error.message);
    process.exit(1); // Exit if DB connection fails
  }
}

startServer();