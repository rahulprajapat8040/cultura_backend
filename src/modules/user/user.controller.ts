import { Controller, Get, Post, Query, Req } from "@nestjs/common";
import { UserService } from "./user.service";
import { MulterRequest } from "src/types/multer.type";

@Controller("user")
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Post("create-category")
    async createCategory(
        @Req() req: MulterRequest
    ) {
        return this.userService.createCategory(req)
    }

    @Get("get-all-categories")
    async getAllCategories(
        @Query('page') page: string,
        @Query('limit') limit: string
    ) {
        return this.userService.getAllCategories({ page, limit })
    }

    @Post("create-event")
    async createEvent(
        @Req() req: MulterRequest
    ) {
        return this.userService.createEvent(req)
    }

    @Get("get-home-data")
    async getHomeData(
        @Query('latitude') latitude: string,
        @Query('longitude') longitude: string
    ) {
        return this.userService.getHomeData({ latitude, longitude })
    }
}