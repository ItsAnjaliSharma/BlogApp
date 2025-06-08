import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoutes from "./routes/user.js"; // Make sure this is a `.js` path if compiled
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';

dotenv.config();

  cloudinary.config({ 
        cloud_name: process.env.Cloud_Name, 
        api_key: process.env.Cloud_API_Key, 
        api_secret: process.env.Cloud_API_Secret // Click 'View API Keys' above to copy your API secret
    });



const app = express();

app.use(express.json()); // Body parser
app.use(cors()); // Enable CORS for all routes
app.use("/api/v1", userRoutes); // 💥 This must be a function (a router)

connectDB(); // Connect to the database

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
