import { Body, Controller, Delete, Get, Post, Put, Query, Req, RequestMethod, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "src/guards/auth.guard";
import { Request, response } from "express";
import { User } from "src/models";
import { VenueRatingDto } from "src/utils/common/dto";
import { ArtistService } from "../artist/artist.service";
import { MulterRequest } from "src/utils/types/multerRequest";

@Controller("users")
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly artistService: ArtistService
    ) { }

    @Get("get-account-detail")
    @UseGuards(AuthGuard)
    async getAccountDetail(
        @Req() req: Request
    ) {
        return this.userService.getUser(req.user as User)
    }

    @Post("update-account-detail")
    @UseGuards(AuthGuard)
    async updateAccountDetail(
        @Req() req: MulterRequest
    ) {
        return this.userService.updateAccount(req)
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

    @Get("get-all-posts")
    @UseGuards(AuthGuard)
    async getAllPosts(
        @Query('page') page: number,
        @Query('limit') limit: number
    ) {
        return this.artistService.getAllPosts({ page, limit })
    }

    @Post("post-view-increase")
    async postViewInc(
        @Body('postId') postId: string,
        @Req() req: Request
    ) {
        return this.artistService.postViewInc(postId, req.user as User)
    }

    @Post("like-post")
    async likePost(
        @Body('postId') postId: string,
        @Req() req: Request
    ) {
        return this.artistService.likePost(postId, req.user as User)
    }

    @Get("get-likes-and-comments")
    @UseGuards(AuthGuard)
    async getLikesAndComments(
        @Query('postId') postId: string,
        @Req() req: Request
    ) {
        return this.artistService.getLikeAndComments(postId, req.user as User)
    }

    @Get("get-artist-info")
    @UseGuards(AuthGuard)
    async getArtistInfo(
        @Query("artistId") artistId: string,
        @Req() req: Request
    ) {
        return this.artistService.getArtistInfo(artistId, req.user as User)
    }

    @Post("follow-unfollow-artist")
    @UseGuards(AuthGuard)
    async followUnfollowArtist(
        @Body('artistId') artistId: string,
        @Req() req: Request
    ) {
        return this.artistService.followUnfollowArtist(artistId, req.user as User)
    }
}