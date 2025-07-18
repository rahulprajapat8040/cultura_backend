import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { SequelizeModule } from "@nestjs/sequelize";
import { jwtConfig } from "src/config/jwt.config";
import { DeviceInfo, User } from "src/models";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

@Module({
    imports: [
        SequelizeModule.forFeature([User, DeviceInfo]),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env'
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: jwtConfig
        })
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [JwtModule, AuthService]
})

export class AuthModule { }