import amqp from 'amqplib';
import dotenv from 'dotenv';
import { redisClient } from '../server.js';
import { sql } from './db.js';

dotenv.config();

interface CacheInvalidationMessage {
    action: string;
    keys: string[];
}

export const startCacheConsumer = async () => {
    try {
        const connection = await amqp.connect({
            protocol: 'amqp',
            hostname: process.env.RABBITMQ_HOST || 'localhost',
            port: parseInt(process.env.RABBITMQ_PORT || '5672', 10),
            username: process.env.RABBITMQ_USER || 'guest',
            password: process.env.RABBITMQ_PASSWORD || 'guest',
        });

        const channel = await connection.createChannel();
        const queueName = 'cacheInvalidationQueue';

        await channel.assertQueue(queueName, { durable: true });

        console.log('✅ Connected to RabbitMQ');
        console.log('✅ Blog Service cache consumer started');

        channel.consume(queueName, async (msg) => {
            if (msg) {
                try {
                    const content: CacheInvalidationMessage = JSON.parse(msg.content.toString());
                    console.log('📩 Received message:', content);

                    if (content.action === 'invalidateCache') {
                        for (const pattern of content.keys) {
                            const keys = await redisClient.keys(pattern); // Note: wildcard patterns allowed

                            if (keys.length > 0) {
                                await redisClient.del(keys);
                                console.log(`✅ Cache invalidated for keys: ${keys.join(', ')}`);
                            }

                            // Optionally rehydrate cache for a specific pattern
                            if (pattern.startsWith('blogs:')) {
                                // Extract query params if needed
                                const parts = pattern.split(':'); // blogs:searchQuery:category
                                const searchQuery = parts[1] || '';
                                const category = parts[2] || '';

                                const blogs = await sql`
                                    SELECT * FROM blogs
                                    ORDER BY create_at DESC;
                                `;
await redisClient.set(pattern, JSON.stringify(blogs), {
  EX: 60 * 60, // 1 hour
});

                                console.log(`✅ Cache rehydrated for pattern: ${pattern}`);
                            }
                        }
                    }

                    channel.ack(msg); // Acknowledge message only after successful processing
                } catch (err) {
                    console.error('❌ Error processing message:', err);
              
              channel.nack(msg, false); // Reject message without requeueing}
            }
        }
    }); // Important: noAck = false to allow manual acknowledgement

    } catch (error) {
        console.error('❌ Error connecting to RabbitMQ:', error);
        throw error;
    }
};
