import express from "express";
import { getAnswers } from "../controller/answerController.js";


const router = express.Router();

// GET /api/answer/:question_id
router.get("/answer/:question_id", getAnswers);

export default router;
