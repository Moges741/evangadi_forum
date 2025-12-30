import express from "express";
import dotenv from "dotenv";
import userRoutes from  './routes/userRoutes.js'
import postQuestionRouter from './routes/postQuestionRoute.js'
import answerRoutes from "./routes/answerRoute.js";
import authMiddleware from "./middleware/authMiddleware.js";
import questionRoutes from "./routes/questionRoute.js";

const app = express();
app.use(express.json());

dotenv.config();
const PORT = process.env.PORT || 5500;

//json packing middleware
app.use(express.json());

const userRoutes = require("./routes/userRoute");
const questionRoutes = require("./routes/questionRoute");
app.use("/api", authMiddleware, questionRoutes);
//userRoutes middleware
app.use("/api", userRoutes);


// question routes midware
app.use("/api/question", questionRoutes);


//userRoutes middleware
app.use("/api", answerRoutes);

// postQuestionRoutes middleware
app.use('/api',postQuestionRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
});
