import express from "express";
import {
  getChatResponse,
  getChatHistory,
  deleteChatHistory,
} from "../controller/chatController.js";

const router = express.Router();

router.post("/", getChatResponse);
router.get("/history", getChatHistory);
router.delete("/history", deleteChatHistory);

export default router;
