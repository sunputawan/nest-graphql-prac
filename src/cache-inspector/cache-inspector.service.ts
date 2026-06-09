import { Injectable, Inject } from '@nestjs/common';
import { REDIS_CLIENT } from 'src/redis/redis.module';
import Redis from 'ioredis';
import { CacheEntryType } from 'src/products/dto/cache-entry.type';

@Injectable()
export class CacheInspectorService {
  constructor(@Inject(REDIS_CLIENT) private redis: Redis) {}

  async getKeys(pattern: string = '*'): Promise<string[]> {
    return this.redis.keys(pattern);
  }

  async getEntry(key: string): Promise<CacheEntryType> {
    const [value, ttl] = await Promise.all([
      this.redis.get(key),
      this.redis.ttl(key),
    ]);

    return {
      key,
      value,
      ttl,
    };
  }

  async getStats(): Promise<string> {
    return this.redis.info('stats');
  }

  async invalidate(key: string): Promise<boolean> {
    const result = await this.redis.del(key);
    return result > 0;
  }

  /***
   * สวัสดี
   */
  async flush(): Promise<boolean> {
    await this.redis.flushall();
    return true;
  }
}
