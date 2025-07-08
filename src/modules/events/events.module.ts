import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Events, MediaFiles, Tickets, User } from "src/models";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";
import { FileService } from "../file/file.service";

@Module({
    imports: [
        SequelizeModule.forFeature([User, Events, Tickets, MediaFiles])
    ],
    controllers: [EventsController],
    providers: [EventsService, FileService]
})

export class EventsModule { }