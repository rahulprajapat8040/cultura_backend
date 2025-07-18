import { InjectRedis } from "@nestjs-modules/ioredis";
import { Injectable } from "@nestjs/common";
import { Redis } from 'ioredis'

@Injectable()
export class RedisService {
    constructor(@InjectRedis() private readonly redis: Redis) { }

    async set(key: string, value: string, ttl = 300) {
        await this.redis.set(key, value, 'EX', ttl);
    }

    async get(key: string): Promise<string | null> {
        return await this.redis.get(key)
    }

    async del(key: string) {
        await this.redis.del(key)
    }
}