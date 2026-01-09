import express from "express";
import { getChatResponse, getChatHistory } from "../controller/chatController.js";

const router = express.Router();

router.post("/", getChatResponse);
router.get("/history", getChatHistory);

export default router;
