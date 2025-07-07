import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { SequelizeModule } from "@nestjs/sequelize";
import { jwtConfig } from "src/config/jwt.config";
import { DeviceInfo, RoleModel, User } from "src/models";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RedisModule } from "../redis/redis.module";

@Module({
    imports: [
        SequelizeModule.forFeature([User, DeviceInfo, RoleModel]),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env'
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: jwtConfig
        }),
        RedisModule
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtModule],
    exports: [AuthService, JwtModule]
})
export class AuthModule { }