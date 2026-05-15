import Redis from 'ioredis';
import { config } from '../config';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

redis.on('error', (err) => {
  console.error('[Redis Error]', err);
});

redis.on('connect', () => {
  console.log('[Redis] Connected successfully');
});

export class RedisService {
  /**
   * Store an OTP for a specific purpose (verification, reset)
   * @param key Unique key (e.g., `otp:verify:user@example.com`)
   * @param otp The 6-digit code
   * @param ttlSeconds Time to live in seconds (default 15 mins)
   */
  static async setOTP(key: string, otp: string, ttlSeconds: number = 900) {
    await redis.set(key, otp, 'EX', ttlSeconds);
  }

  /**
   * Retrieve and delete an OTP (one-time use)
   */
  static async getAndVerifyOTP(key: string, submittedOtp: string): Promise<boolean> {
    const storedOtp = await redis.get(key);
    if (!storedOtp) return false;
    
    if (storedOtp === submittedOtp) {
      await redis.del(key);
      return true;
    }
    
    return false;
  }

  /**
   * General purpose delete
   */
  static async delete(key: string) {
    await redis.del(key);
  }
}

export default redis;
