import express from "express";
import { login, register } from "../controller/userController.js";

const router = express.Router();

router.post("/login", login);

// Register Route
router.post("/register", register);

export default router;
