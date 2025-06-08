import amqp from 'amqplib';
import dotenv from 'dotenv';
dotenv.config();


let channel: amqp.Channel | null = null;
export const connectRabbitMQ= async()=>{
try {
    const connection = await amqp.connect(
        {
            protocol: 'amqp',
            hostname: process.env.RABBITMQ_HOST || 'localhost',
            port: parseInt(process.env.RABBITMQ_PORT || '5672', 10),
            username: process.env.RABBITMQ_USER || 'guest',
            password: process.env.RABBITMQ_PASSWORD || 'guest',
        });
    channel = await connection.createChannel();
    console.log('✅ Connected to RabbitMQ');
    return channel;
   
} catch (error) {
    console.error('❌ Error connecting to RabbitMQ:', error);
    throw error;
  
    
}
} 

export const publishToQueue = async (queueName: string, message: any) => {
    if (!channel) {
        throw new Error('Channel is not initialized. Call connectRabbitMQ first.');
    }

    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
};

export const invalidateCacheJob= async (cacheKeys: string[]) => {
    try {
        const message = {
            action: 'invalidateCache',
            keys: cacheKeys,
        };  
        await publishToQueue('cacheInvalidationQueue', message);
        console.log('✅ Cache invalidation job published to rabbitMQ');
    } catch (error) {   
        console.error('❌ Error publishing cache invalidation job:', error);
        throw error;
    }
}