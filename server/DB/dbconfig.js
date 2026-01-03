import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const dbconnection = mysql.createPool({
  host: "localhost",
  user: "forum@User",
  password: "Forum@User123!",
  database: "FORUM_DB",
  connectionLimit: 11,
});

export default dbconnection;
