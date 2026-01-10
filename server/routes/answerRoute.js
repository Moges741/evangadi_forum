import express from "express";
import {
  getAnswers,
  getAnswerSummary,
  postAnswer,
  editAnswer,
  deleteAnswer,
  getSingleAnswer,
} from "../controller/answerController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all answers for a question
router.get("/:question_id", getAnswers);

router.get("/single/:answer_id", getSingleAnswer);
// GET summary of answers for a question
router.get("/:question_id/summary", getAnswerSummary);

// POST a new answer
router.post("/", authMiddleware, postAnswer);

// EDIT an answer
router.put("/:answer_id", authMiddleware, editAnswer);

// DELETE an answer
router.delete("/:answer_id", authMiddleware, deleteAnswer);

export default router;
