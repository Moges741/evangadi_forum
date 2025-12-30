import { Router } from "express";
const router = Router();
import {
  getAllQuestions,
  getSingleQuestion,
} from "../controller/questionController.js";

router.get("/", getAllQuestions);

// ===================================Muller Task=============================
// get a single question
router.get("/:questionid", getSingleQuestion);
// ===================================Muller Task=============================
export default router;
