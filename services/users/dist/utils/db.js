import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // Ensure environment variables are loaded
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "blogapp", // Explicitly set database name
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`❌ MongoDB connection error:`, error.message);
        process.exit(1);
    }
};
export default connectDB;
