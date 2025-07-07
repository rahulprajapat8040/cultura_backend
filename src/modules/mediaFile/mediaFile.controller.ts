import { Controller, Delete, Post, Put, Query, Req, RequestMethod, UseGuards } from "@nestjs/common";
import { MediaFileService } from "./mediaFile.service";
import { MulterRequest } from "src/utils/types/multerRequest";
import { AuthGuard } from "src/guards/auth.guard";

@Controller("media-file")
export class MediaFileController {
    constructor(
        private readonly mediaFileService: MediaFileService
    ) { }

    @Post("add-media-file")
    @UseGuards(AuthGuard)
    async addMediaFile(
        @Query('folder') folder: string,
        @Req() req: MulterRequest
    ) {
        return this.mediaFileService.uploadMediaFile(folder, req)
    }

    @Put("update-media-file")
    @UseGuards(AuthGuard)
    async updateMediaFile(
        @Query('mediaFileId') mediaFileId: string,
        @Query('folder') folder: string,
        @Req() req: MulterRequest
    ) {
        return this.mediaFileService.updateMediaFile(mediaFileId, folder, req);
    };

    @Delete('delete-media-file')
    @UseGuards(AuthGuard)
    async deleteMediaFile(
        @Query('mediaFileId') mediaFileId: string
    ) {
        return this.mediaFileService.deleteFile(mediaFileId)
    }
}