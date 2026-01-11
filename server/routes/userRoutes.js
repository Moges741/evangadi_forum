import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  login,
  register,
  checkUser,
  forgotPassword,
  resetPassword,
} from "../controller/userController.js";

const router = express.Router();

router.post("/login", login);
router.get("/check", authMiddleware, checkUser);
router.post("/register", register);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
