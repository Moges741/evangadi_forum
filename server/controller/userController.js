import { StatusCodes } from "http-status-codes";
// import dbconnection from "../db/dbconfig.js";
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

export { login };
