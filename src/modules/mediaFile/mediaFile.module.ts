import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { MediaFiles } from "src/models";
import { MediaFileController } from "./mediaFile.controller";
import { MediaFileService } from "./mediaFile.service";
import { FileService } from "../file/file.service";

@Module({
    imports: [
        SequelizeModule.forFeature([MediaFiles])
    ],
    controllers: [MediaFileController],
    providers: [MediaFileService, FileService]
})

export class MediaFileModule { }