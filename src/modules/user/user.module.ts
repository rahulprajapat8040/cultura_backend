import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Models } from "src/models";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { ArtistService } from "../artist/artist.service";
import { FileService } from "../file/file.service";

@Module({
    imports: [SequelizeModule.forFeature(Models)],
    controllers: [UserController],
    providers: [UserService, ArtistService, FileService]
})

export class UserModule { }