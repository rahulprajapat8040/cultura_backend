import { InjectModel } from "@nestjs/sequelize";
import { Events, MediaFiles, Tickets, User } from "src/models";
import { genratePagination, responseSender, SendError } from "src/utils/helper/funcation.helper";
import { FileService } from "../file/file.service";
import { MulterRequest } from "src/utils/types/multerRequest";
import STRINGCONST from "src/utils/common/stringConst";
import { HttpStatus, NotFoundException } from "@nestjs/common";
import { EventStatusType } from "src/utils/types/eventType";

export class EventsService {
    constructor(
        @InjectModel(MediaFiles) private readonly mediaFileModel: typeof MediaFiles,
        @InjectModel(Events) private readonly eventsModel: typeof Events,
        @InjectModel(User) private readonly userModel: typeof User,
        @InjectModel(Tickets) private readonly ticketsModel: typeof Tickets,
        private readonly fileService: FileService
    ) { }

    async createEvent(req: MulterRequest) {
        try {
            const { file, body } = await this.fileService.uploadFile<Events>(req, 'events')
            const user = req.user as User;
            const res = await this.eventsModel.create({
                ...body,
                organizerId: user.id
            })
            for (const [index, item] of file.entries()) {
                await this.mediaFileModel.create({
                    mediaUrl: item.path,
                    mediaType: item.mimetype,
                    usage: 'event',
                    relatedId: res.id,
                    isThumbnail: index === 0,
                    order: index
                })
            }
            return responseSender(STRINGCONST.EVENT_CREATED, HttpStatus.CREATED, true, res)
        } catch (error) {
            SendError(error.message)
        }
    }

    async getYourAllEvents(queryParams, user: User) {
        try {
            let { page, limit } = queryParams;
            page = Number(page) || 1
            limit = Number(limit) || 10
            const offset = Number((page - 1) * limit)
            const events = await this.eventsModel.findAndCountAll({
                where: { organizerId: user.id },
                limit, offset,
            })
            await Promise.all(events.rows.map(async (e) => {
                (e as any).dataValues.mediaFiles = await this.mediaFileModel.findAll(
                    {
                        where: { relatedId: e.id },
                        order: [['order', 'ASC']]
                    }
                );
            }));
            const response = genratePagination(events, page, limit);
            return responseSender(STRINGCONST.DATA_FOUND, HttpStatus.OK, true, response)
        } catch (error) {
            SendError(error.message)
        }
    }

    async getEventDetail(eventId: string) {
        try {
            const event = await this.eventsModel.findByPk(eventId)
            if (!event) {
                throw new NotFoundException(STRINGCONST.DATA_NOT_FOUND)
            }
            return responseSender(STRINGCONST.DATA_FOUND, HttpStatus.OK, true, event)
        } catch (error) {
            SendError(error.message)
        }
    }

    async getArtistiFindingEvents(queryParams) {
        try {
            let { page, limit } = queryParams;
            page = Number(page) || 1
            limit = Number(limit) || 10
            const offset = Number((page - 1) * limit)
            const events = await this.eventsModel.findAndCountAll({
                where: { status: "finding_artist" },
                include: [
                    { model: this.userModel }
                ],
                limit, offset,
            })
            await Promise.all(events.rows.map(async (e) => {
                (e as any).dataValues.mediaFiles = await this.mediaFileModel.findOne(
                    {
                        where: { relatedId: e.id, isThumbnail: true },
                        order: [['order', 'ASC']]
                    }
                );
            }));
            const response = genratePagination(events, page, limit)
            return responseSender(STRINGCONST.DATA_FOUND, HttpStatus.OK, true, response)
        } catch (error) {
            SendError(error.message)
        }
    }
}