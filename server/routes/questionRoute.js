import { Router } from "express";
const router = Router();
import { getAllQuestions } from "../controller/questionController.js";

router.get("/", getAllQuestions);
export default router;
