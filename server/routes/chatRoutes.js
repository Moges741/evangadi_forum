import express from "express";
import { getChatResponse } from "../controller/chatController.js";

const router = express.Router();

router.post("/", getChatResponse);

export default router;
