import { Body, Controller, Delete, Get, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "src/guards/auth.guard";
import { Request, response } from "express";
import { User } from "src/models";
import { VenueRatingDto } from "src/utils/common/dto";

@Controller("users")
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Get("get-account-detail")
    @UseGuards(AuthGuard)
    async getAccountDetail(
        @Req() req: Request
    ) {
        return this.userService.getUser(req.user as User)
    }

    @Post("add-venue-rating")
    @UseGuards(AuthGuard)
    async addVenueRating(
        @Body() venueRatingDto: VenueRatingDto,
        @Req() req: Request
    ) {
        return this.userService.addVenueRating(venueRatingDto, req.user as User)
    }

    @Get("get-your-venue-ratings")
    @UseGuards(AuthGuard)
    async getYourVenueRatings(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Req() req: Request
    ) {
        return this.userService.getYourVenueRatings({ page, limit }, req.user as User)
    }

    @Put("update-venue-rating")
    @UseGuards(AuthGuard)
    async updateVenueRating(
        @Query('venueRatingId') venueRatingId: string,
        @Body() veneuRatingDto: VenueRatingDto
    ) {
        return this.userService.updateRating(venueRatingId, veneuRatingDto)
    }

    @Delete("delete-venue-rating")
    @UseGuards(AuthGuard)
    async deleteVenueRating(
        @Query('venueRatingId') venueRatingId: string
    ) {
        return this.userService.deleteVenueRating(venueRatingId)
    }

    @Get("get-all-venues")
    @UseGuards(AuthGuard)
    async getAllVenues(
        @Query('page') page: number,
        @Query('limit') limit: number,
    ) {
        return this.userService.getAllVenues({ page, limit })
    }

    @Get('get-venue-detail')
    @UseGuards(AuthGuard)
    async getVenueDetail(
        @Query('venueId') venueId: string
    ) {
        return this.userService.getVenueDetail(venueId)
    }

    @Get("get-top-bookings-events")
    async getTopBookedEvents() {
        return this.userService.getTopBookedEvents()
    }
}