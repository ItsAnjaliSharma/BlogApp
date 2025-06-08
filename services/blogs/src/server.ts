import express from 'express';
import dotenv from 'dotenv';
import blogRoutes from './routes/blog.js';
import { neon } from '@neondatabase/serverless';
import { sql } from './utils/db.js';
import { createClient} from 'redis';
import { startCacheConsumer } from './utils/consumer.js';


dotenv.config();
const app = express();

const PORT = process.env.PORT || 5002;

startCacheConsumer();

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.connect().then(() => {
  console.log('Connected to Redis');
}
).catch((err) => {
  console.error('Error connecting to Redis:', err);
});

app.use("/api/v1", blogRoutes);

app.listen(PORT, () => {
  console.log(`Blogs service is running on port ${PORT}`);
});