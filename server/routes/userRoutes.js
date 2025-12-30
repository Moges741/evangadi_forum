import express from "express";
import { login } from "../controller/userController.js";
const authMiddleware = require("../middleware/authMiddleware");
import { login, register } from "../controller/userController.js";

const router = express.Router();


router.post("/login", login);
router.get("/check", authMiddleware, checkUser);
router.post("/users/register", register);

export default router;
