import { Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { EventsService } from "./events.service";
import { MulterRequest } from "src/utils/types/multerRequest";
import { AuthGuard } from "src/guards/auth.guard";
import { RolesGuard } from "src/guards/roles.guard";
import { Roles } from "src/guards/roles.decorator";
import { Request } from "express";
import { User } from "src/models";

@Controller("event")
export class EventsController {
    constructor(
        private readonly eventsService: EventsService
    ) { }

    @Post("create-event")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("organizer")
    async createEvent(
        @Req() req: MulterRequest
    ) {
        return this.eventsService.createEvent(req)
    }

    @Get("get-your-events")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("organizer")
    async getYourAllEvents(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Req() req: Request
    ) {
        return this.eventsService.getYourAllEvents({ page, limit }, req.user as User)
    }

    @Get("get-event-detail")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("organizer")
    async getEventDetail(
        @Query('eventId') eventId: string
    ) {
        return this.eventsService.getEventDetail(eventId)
    }

    @Get("get-artist-finding-events")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("artist")
    async getArtistiFindingEvents(
        @Query('page') page: number,
        @Query('limit') limit: number
    ) {
        return this.eventsService.getArtistiFindingEvents({ page, limit })
    }
}