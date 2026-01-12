import { Router } from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import {
  getAllQuestions,
  getSingleQuestion,
  postQuestion,
  editQuestion,
  deleteQuestion,
} from "../controller/questionController.js";
const router = Router();

// GET all questions
router.get("/", authMiddleware, getAllQuestions);

// POST a new question
router.post("/", authMiddleware, postQuestion);

// GET a single question
router.get("/:questionid", getSingleQuestion);
router.put("/:questionid", authMiddleware, editQuestion);
//router.put("/:questionid", authMiddleware, updateQuestion);
router.delete("/:questionid", authMiddleware, deleteQuestion);

// EDIT a question
router.put("/:questionid", authMiddleware, editQuestion);

// DELETE a question
router.delete("/:questionid", authMiddleware, deleteQuestion);

export default router;
