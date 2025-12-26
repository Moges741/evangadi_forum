const mysql = require('mysql2');
const dbconnection = mysql.createPool({
  host: 'localhost',
  user: 'evangadi-admin',
  password: 'evangadi@123admin',
  database: 'evangadi_forum',
  connectionLimit: 11,
});
dbconnection.execute("SELECT 'test'",(err, results)=>{
    if(err){
    console.log('Database connection failed:', err.message);
    } else {
    console.log('Database connected:', results[0].result);
    }
} );