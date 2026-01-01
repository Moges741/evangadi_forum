import express from "express";
import { getAnswers , getAnswerSummary, postAnswer} from "../controller/answerController.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/:question_id", getAnswers);

// GET /api/:question_id/summary
router.get("/:question_id/summary", getAnswerSummary);

// POST /api/answer
router.post("/", authMiddleware, postAnswer);

export default router;
