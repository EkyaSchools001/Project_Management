import Redis from 'ioredis';

export const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    retryStrategy: (times: number) => {
        if (times > 10) return null;
        return 2000;
    }
};

const redisClient = new Redis(redisConfig);
export const subClient = redisClient.duplicate();

redisClient.on('error', (err) => console.error('[REDIS] ❌ Error:', err));
subClient.on('error', (err) => console.error('[REDIS SUB] ❌ Error:', err));

export default redisClient;
