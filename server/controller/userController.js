import { StatusCodes } from "http-status-codes";
import dbConnection from "../DB/dbconfig.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
dotenv.config();

async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;
  if (!username || !firstname || !lastname || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields are required" });
  }
  try {
    const [userExists] = await dbConnection.query(
      "SELECT userid FROM users WHERE email = ?",
      [email]
    );
    if (userExists.length > 0) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "User with this email already exists" });
    }
    if (password.length < 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Password must be at least 8 characters long" });
    }
    // Hash the password before storing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await dbConnection.query(
      "INSERT INTO users (username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)",
      [username, firstname, lastname, email, hashedPassword]
    );
    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during registration:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;

  //validating email and password
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required information." });
  }
  try {
    const [users] = await dbConnection.query(
      "select username, email, userid, password, firstname, lastname from users where email = ? ",
      [email]
    );

    //if no user found
    if (users.length === 0) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid Credentials" });
    }
    const user = users[0];

    //compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid Credentials" });
    }

    // generate token
    const username = user.username;
    const userid = user.userid;
    const token = jwt.sign({ username, userid }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    //success response
    return res.status(StatusCodes.OK).json({
      msg: "User login successful",
      token,
      user,
    });
  } catch (error) {
    console.log("Login error:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error fetching user data" });
  }
};
const checkUser = async (req, res) => {
  const username = req.user.username;
  const userid = req.user.userid;

  try {
    // Get user profile picture from database
    const [users] = await dbConnection.query(
      "SELECT COALESCE(profile_picture, '') as profile_picture FROM users WHERE userid = ?",
      [userid]
    );
    
    const profile_picture = users[0]?.profile_picture || "";

    return res
      .status(StatusCodes.OK)
      .json({ message: "valid user", username, userid, profile_picture });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res
      .status(StatusCodes.OK)
      .json({ message: "valid user", username, userid, profile_picture: "" });
  }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/profile-pictures/";
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `profile-${req.user.userid}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Upload profile picture
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "No file uploaded",
      });
    }

    const userid = req.user.userid;
    const profilePictureUrl = `/uploads/profile-pictures/${req.file.filename}`;

    // Get current profile picture to delete old one
    const [currentUser] = await dbConnection.query(
      "SELECT profile_picture FROM users WHERE userid = ?",
      [userid]
    );

    // Update database with new profile picture URL
    await dbConnection.query(
      "UPDATE users SET profile_picture = ? WHERE userid = ?",
      [profilePictureUrl, userid]
    );

    // Delete old profile picture file if it exists
    if (currentUser[0]?.profile_picture) {
      const oldFilePath = `uploads/profile-pictures/${path.basename(currentUser[0].profile_picture)}`;
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    res.status(StatusCodes.OK).json({
      message: "Profile picture uploaded successfully",
      profilePictureUrl: profilePictureUrl,
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error uploading profile picture",
      error: error.message,
    });
  }
};

// Remove profile picture
const removeProfilePicture = async (req, res) => {
  try {
    const userid = req.user.userid;

    // Get current profile picture
    const [currentUser] = await dbConnection.query(
      "SELECT profile_picture FROM users WHERE userid = ?",
      [userid]
    );

    // Update database to remove profile picture
    await dbConnection.query(
      "UPDATE users SET profile_picture = NULL WHERE userid = ?",
      [userid]
    );

    // Delete profile picture file if it exists
    if (currentUser[0]?.profile_picture) {
      const filePath = `uploads/profile-pictures/${path.basename(currentUser[0].profile_picture)}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(StatusCodes.OK).json({
      message: "Profile picture removed successfully",
    });
  } catch (error) {
    console.error("Error removing profile picture:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error removing profile picture",
      error: error.message,
    });
  }
};
export { login, checkUser, register, upload, uploadProfilePicture, removeProfilePicture };
