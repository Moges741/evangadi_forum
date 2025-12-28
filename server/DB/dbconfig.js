import mysql from "mysql2/promise";
import express from "express";
const app = express();
const dbconnection = mysql.createPool({
  host: "localhost",
  user: "evangadi-admin",
  password: "12MM!@nnAA12",
  database: "evangadi_forum",
  connectionLimit: 11,
});

try {
  await dbconnection.execute("SELECT 'test'");
  console.log("Database connected..."); 
} catch (err) {
  console.log("Database connection failed: ", err.message);
}

const port = 10000;
app.get("/", (req, res) => {
  res.send("DB Config is running...");
});
app.listen(port, () => {
  console.log(`DB Config running on port ${port}  http://localhost:${port}`);
}); 






export default dbconnection;
