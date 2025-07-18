import { RedisModule as NestRedisModule } from "@nestjs-modules/ioredis";
import { Global, Module } from "@nestjs/common";
import { RedisService } from "./redis.service";

@Global()
@Module({
    imports: [
        NestRedisModule.forRoot({
            type: 'single',
            options: {
                host: 'localhost',
                port: 6379
            }
        })
    ],
    providers: [RedisService],
    exports: [RedisService]
})

export class RedisModule { }