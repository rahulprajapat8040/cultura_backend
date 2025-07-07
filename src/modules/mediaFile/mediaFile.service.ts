import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { MediaFiles } from "src/models";
import { parameterNotFound, responseSender, SendError } from "src/utils/helper/funcation.helper";
import { MulterRequest } from "src/utils/types/multerRequest";
import { FileService } from "../file/file.service";
import STRINGCONST from "src/utils/common/stringConst";

@Injectable()
export class MediaFileService {
    constructor(
        @InjectModel(MediaFiles) private readonly mediaFileModel: typeof MediaFiles,
        private readonly fileService: FileService,
    ) { }

    async uploadMediaFile(folder: string, req: MulterRequest) {
        const { file, body } = await this.fileService.uploadFile<MediaFiles>(req, folder)
        try {
            if (file.length > 0) {
                for (const [index, item] of file.entries()) {
                    await this.mediaFileModel.create({
                        ...body,
                        order: index,
                        isThumbnail: index === 0
                    })
                }
            }
            return responseSender(STRINGCONST.FILES_UPLOADED, HttpStatus.CREATED, true, null)
        } catch (error) {
            SendError(error.message)
        }
    }

    async updateMediaFile(mediaFileId: string, folder: string, req: MulterRequest) {
        const { file, body } = await this.fileService.uploadFile<MediaFiles>(req, folder)
        try {
            parameterNotFound(mediaFileId, "mediaFileId not found")
            const mediaFile = await this.mediaFileModel.findByPk(mediaFileId)
            if (!mediaFile) {
                throw new NotFoundException(STRINGCONST.DATA_NOT_FOUND);
            };
            if (file.length) {
                this.fileService.removeFile(mediaFile.mediaUrl)
            }
            await mediaFile.update({
                mediaUrl: file[0] ? file[0].path : body.mediaUrl
            })
            return responseSender(STRINGCONST.FILE_UPDATED, HttpStatus.OK, true, null)
        } catch (error) {
            SendError(error.message);
        };
    };

    async deleteFile(mediaFileId: string) {
        try {
            parameterNotFound(mediaFileId, "mediaFileId not found")
            const mediaFile = await this.mediaFileModel.findByPk(mediaFileId)
            if (!mediaFile) {
                throw new NotFoundException(STRINGCONST.DATA_NOT_FOUND);
            };
            this.fileService.removeFile(mediaFile.mediaUrl)
            await mediaFile.destroy()
            return responseSender(STRINGCONST.FILE_REMOVED, HttpStatus.OK, true, null)
        } catch (error) {
            SendError(error.message);
        };
    };
}