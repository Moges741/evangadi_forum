import { StatusCodes } from "http-status-codes";
import dbconnection from "../DB/dbconfig.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  const { email, password } = req.body;
  //validate request

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required values." });
  }
  try {
    const [users] = await dbconnection.query(
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
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign({ username, userid }, "secret", { expiresIn: "1d" }); //creating token which expires in 1day

    //success response
    return res.status(StatusCodes.OK).json({
      msg: "User login successful",
      token,
    });
  } catch (error) {
    console.log("Login error:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error fetching user data" });
  }
};
const register = async (req, res) => {
  const { username, firstname, lastname, email, password } = req.body;

  // 1. Validation
  if (!username || !firstname || !lastname || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Please provide all required information",
    });
  }

  try {
    // 2. Check if user already exists
    const [existingUser] = await dbconnection.execute(
      "SELECT userid FROM users WHERE email = ? OR username = ?",
      [email, username]
    );
    if (password.length < 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Password too short: should be at least 8 characters" });
    }

    if (existingUser.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "User already exists with this email or username",
      });
    }
    //checck passwork length

    // 3. Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Insert user
    await dbconnection.execute(
      "INSERT INTO users (username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)",
      [username, firstname, lastname, email, hashedPassword]
    );

    return res.status(StatusCodes.CREATED).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    console.error("Error code:", error.code);
    console.error("Full error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong! Please try again later",
      error: error.message,
    });
  }
};

export { login, register };
