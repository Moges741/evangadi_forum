import { StatusCodes } from "http-status-codes";
import dbconnection from "../DB/dbconfig.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function register(req, res) {
    const { username, firstname, lastname, email, password } = req.body;
    if (!username || !firstname || !lastname || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "All fields are required" });
    }
    try {
    const [userExists] = await dbConnection.query("SELECT id FROM users WHERE email = ?", [email]);
    if (userExists.length > 0) {
        return res.status(StatusCodes.CONFLICT).json({ message: "User with this email already exists" });
    }
    if (password.length < 8) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Password must be at least 8 characters long" });
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
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
}

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
    const token = jwt.sign({ username, userid }, secret, {
      expiresIn: "1d",
    }); //creating token which expires in 1day

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
const checkUser = async (req, res) => {
  const username = req.user.username;
  const userid = req.user.userid;

  return res
    .status(StatusCodes.OK)
    .json({ message: "valid user", username, userid });
};
export { login, checkUser, register };
