import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const dbconnection = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  connectionLimit: 11,
});

export default dbconnection;