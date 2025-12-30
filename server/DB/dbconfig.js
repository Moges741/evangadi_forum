import mysql from "mysql2/promise";
import express from "express";
const app = express();
const dbconnection = mysql.createPool({
  host: "localhost",
  user: "evangadi-admin",
  password: "evangadi@123admin",
  database: "evangadi_forum",
  connectionLimit: 11,
});

export default dbconnection;
