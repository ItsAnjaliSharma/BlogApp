import express from 'express';
import dotenv from 'dotenv';
import { sql } from './utils/db.js';
import blogRoutes from './routes/blog.js';
import { v2 as cloudinary } from 'cloudinary';
import { connectRabbitMQ } from './utils/rabbitmq.js';
dotenv.config();
const app = express();
connectRabbitMQ().then(() => {
    console.log('✅ Connected to RabbitMQ');
}).catch((error) => {
    console.error('❌ Error connecting to RabbitMQ:', error);
    process.exit(1); // Exit the process if RabbitMQ connection fails
});
const PORT = process.env.PORT || 5001;
cloudinary.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Cloud_API_Key,
    api_secret: process.env.Cloud_API_Secret // Click 'View API Keys' above to copy your API secret
});
async function initDB() {
    try {
        await sql `
        CREATE TABLE IF NOT EXISTS blogs(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            blogcontent TEXT NOT NULL,
            image VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL,
            author VARCHAR(255) NOT NULL,
            create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ); `;
        await sql `
        CREATE TABLE IF NOT EXISTS comments(
            id SERIAL PRIMARY KEY,
            comment VARCHAR(255) NOT NULL,
            userid VARCHAR(255) NOT NULL,
            username VARCHAR(255) NOT NULL,
            blogid VARCHAR(255) NOT NULL,
            create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ); `;
        await sql `
        CREATE TABLE IF NOT EXISTS savedblogs(
            id SERIAL PRIMARY KEY,
            userid VARCHAR(255) NOT NULL,
            blogid VARCHAR(255) NOT NULL,
            create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ); `;
        console.log('Database initialized successfully');
    }
    catch (error) {
        console.error('Error initializing database:', error);
    }
}
app.use("/api/v1", blogRoutes);
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Author service is running on port ${PORT}`);
    });
});
