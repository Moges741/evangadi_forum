import { Router } from "express";
const router = Router();
import {
  getAllQuestions,
  getSingleQuestion,
  postQuestion
} from "../controller/questionController.js";

router.get("/", getAllQuestions);

// get a single question
router.post("/", postQuestion);
router.get("/:questionid", getSingleQuestion);

export default router;
