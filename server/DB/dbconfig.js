import mysql from "mysql2/promise";
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

export default dbconnection;
