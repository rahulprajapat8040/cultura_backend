import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { MediaFiles, User, Venue } from "src/models";
import { VenueController } from "./venue.controller";
import { VenueService } from "./venue.service";
import { FileService } from "../file/file.service";

@Module({
    imports: [
        SequelizeModule.forFeature([User, Venue, MediaFiles])
    ],
    controllers: [VenueController],
    providers: [VenueService, FileService]
})

export class VenueModule { }