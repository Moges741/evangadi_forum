import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { login, register, checkUser } from "../controller/userController.js";

const router = express.Router();

router.post("/login", login);
router.get("/check", authMiddleware, checkUser);
router.post("/register", register);

export default router;
