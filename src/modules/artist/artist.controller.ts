import { Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ArtistService } from "./artist.service";
import { MulterRequest } from "src/utils/types/multerRequest";
import { AuthGuard } from "src/guards/auth.guard";
import { RolesGuard } from "src/guards/roles.guard";
import { Roles } from "src/guards/roles.decorator";

@Controller("artist")
export class ArtistController {
    constructor(
        private readonly artistService: ArtistService
    ) { }

    @Post("create-post")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("artist")
    async cratePost(
        @Req() req: MulterRequest
    ) {
        return this.artistService.createPost(req)
    }

}