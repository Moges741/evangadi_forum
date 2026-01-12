import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  login,
  register,
  checkUser,
  upload,
  uploadProfilePicture,
  removeProfilePicture,
  forgotPassword,
  resetPassword,
} from "../controller/userController.js";
import {} from "../controller/userController.js";

const router = express.Router();

router.post("/login", login);
router.get("/check", authMiddleware, checkUser);
router.post("/register", register);
router.post(
  "/upload-profile-picture",
  authMiddleware,
  upload.single("profilePicture"),
  uploadProfilePicture
);
router.delete("/remove-profile-picture", authMiddleware, removeProfilePicture);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
