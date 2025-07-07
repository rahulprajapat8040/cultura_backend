import { InjectRedis } from "@nestjs-modules/ioredis";
import { Injectable } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService {
    constructor(
        @InjectRedis() private readonly redis: Redis
    ) { }

    async set(key: string, value: string, ttl?: number) {
        if (ttl) {
            await this.redis.set(key, value, "EX", ttl)
        } else {
            await this.redis.set(key, value)
        }
    }

    async get(key: string): Promise<string | null> {
        return await this.redis.get(key)
    }

    async del(key: string) {
        await this.redis.del(key)
    }

    async incr(key: string): Promise<number> {
        return this.redis.incr(key)
    }

    async expire(key: string, seconds: string) {
        return this.redis.expire(key, seconds)
    }
}