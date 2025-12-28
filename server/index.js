import express from "express";
import dotenv from "dotenv";
import userRoutes from  './routes/userRoutes.js'

const app = express();

dotenv.config();
const PORT = process.env.PORT || 3000;

//json middleware 
app.use(express.json());

//userRoutes middleware
app.use('/api',userRoutes)


app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
});