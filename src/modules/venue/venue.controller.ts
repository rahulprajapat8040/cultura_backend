import { Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { VenueService } from "./venue.service";
import { MulterRequest } from "src/utils/types/multerRequest";
import { AuthGuard } from "src/guards/auth.guard";
import { RolesGuard } from "src/guards/roles.guard";
import { Roles } from "src/guards/roles.decorator";
import { Request } from "express";
import { User } from "src/models";

@Controller("venue")
export class VenueController {
    constructor(
        private readonly venueService: VenueService
    ) { }

    @Post("create-venue")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("venue_owner")
    async createVenue(
        @Req() req: MulterRequest
    ) {
        return this.venueService.createVenue(req)
    }

    @Get('get-all-venues')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("venue_owner")
    async getAllVenues(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Req() req: Request
    ) {
        return this.venueService.getAllVenues({ page, limit }, req.user as User)
    }
}