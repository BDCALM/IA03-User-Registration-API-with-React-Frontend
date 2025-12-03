//file server.js
import express from "express"; 
import cors from "cors";       
import dotenv from "dotenv";
import { connectDatabase } from "./config/database.js";
import userRoutes from "./route/user.route.js";

dotenv.config(); // Load biến môi trường 

const app = express(); 
const PORT = process.env.PORT || 3000; 

app.use(cors({ 
  origin: 'http://localhost:5173',
  credentials: true 
})); ////kết nối tới frontend (sử dụng vite ) TODO: đổi port khi deploy
app.use(express.json()); 

//route
app.use('/api/user', userRoutes);


const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`\n✅ Server đang chạy tại: http://localhost:${PORT}`);
  });
};

startServer();