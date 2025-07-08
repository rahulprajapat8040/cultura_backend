import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Models } from "src/models";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports: [SequelizeModule.forFeature(Models)],
    controllers: [UserController],
    providers: [UserService]
})

export class UserModule { }