import express from 'express';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoutes from './routes/user.js';
dotenv.config();
const app = express();
connectDB();
app.use("/api/v1", userRoutes);
// app.use(express.json());
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`User service is running on port http://localhost:${PORT}`);
});
