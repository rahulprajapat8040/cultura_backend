import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Follow, HashTags, MediaFiles, PostHashtags, PostLike, Posts, PostView, User } from "src/models";
import { ArtistController } from "./artist.controller";
import { ArtistService } from "./artist.service";
import { FileService } from "../file/file.service";

@Module({
    imports: [SequelizeModule.forFeature([
        User, Posts, HashTags, PostHashtags, MediaFiles, Follow, PostView, PostLike
    ])],
    controllers: [ArtistController],
    providers: [ArtistService, FileService],
})
export class ArtistModule { }