import { InjectModel } from "@nestjs/sequelize";
import { Events, MediaFiles, User, Venue } from "src/models";
import { genratePagination, parameterNotFound, responseSender, SendError } from "src/utils/helper/funcation.helper";
import { MulterRequest } from "src/utils/types/multerRequest";
import { FileService } from "../file/file.service";
import STRINGCONST from "src/utils/common/stringConst";
import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { Op } from "sequelize";

@Injectable()
export class VenueService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User,
        @InjectModel(Venue) private readonly venueModel: typeof Venue,
        @InjectModel(Events) private readonly eventModel: typeof Events,
        @InjectModel(MediaFiles) private readonly mediaFileModel: typeof MediaFiles,
        private readonly fileService: FileService
    ) { }

    async createVenue(req: MulterRequest) {
        try {
            const { file, body } = await this.fileService.uploadFile<Venue>(req, 'venue')
            const user = req.user as User;
            const venue = await this.venueModel.create({ ...body, ownerId: user.id })
            for (const [index, item] of file.entries()) {
                await this.mediaFileModel.create({
                    mediaUrl: item.path,
                    mediaType: item.mimetype,
                    usage: 'venue',
                    relatedId: venue.id,
                    isThumbnail: index === 0,
                    order: index
                })
            }
            return responseSender(STRINGCONST.VENUE_CREATED, HttpStatus.CREATED, true, venue)
        } catch (error) {
            SendError(error.message)
        }
    }

    async getAllVenues(queryParams, user: User) {
        try {
            let { page, limit } = queryParams;
            page = Number(page) || 1
            limit = Number(limit) || 10
            const offset = Number((page - 1) * limit)
            const venues = await this.venueModel.findAndCountAll({
                where: { ownerId: user.id },
                limit, offset,
            });
            await Promise.all(venues.rows.map(async (v) => {
                (v as any).dataValues.mediaFiles = await this.mediaFileModel.findAll(
                    {
                        where: { relatedId: v.id },
                        order: [['order', 'ASC']]
                    }
                );
            }));
            const response = genratePagination(venues, page, limit);
            return responseSender(STRINGCONST.DATA_FOUND, HttpStatus.OK, true, response);
        } catch (error) {
            SendError(error.message);
        };
    };

    async getVenueDetail(venueId: string) {
        try {
            parameterNotFound(venueId, 'venueId not found')
            const venue = await this.venueModel.findByPk(venueId)
            if (!venue) {
                throw new NotFoundException(STRINGCONST.DATA_NOT_FOUND);
            };
            return responseSender(STRINGCONST.DATA_FOUND, HttpStatus.OK, true, venue)
        } catch (error) {
            SendError(error.message)
        }
    }

    async deleteVenue(venueId: string) {
        try {
            parameterNotFound(venueId, "venueId not found")
            await this.venueModel.destroy({ where: { id: venueId } })
            return responseSender(STRINGCONST.VENUE_DELETED, HttpStatus.OK, true, null)
        } catch (error) {
            SendError(error.message)
        }
    }

    async updateVenue(venueId: string) {
        try {
            parameterNotFound(venueId, "venueId not found");
            const venue = await this.venueModel.findByPk(venueId);
            if (!venue) {
                throw new NotFoundException(STRINGCONST.DATA_NOT_FOUND);
            };
            await venue.update({})
        } catch (error) {
            SendError(error.message)
        }
    }

    async getEventReqForVneue(queryParams, user: User) {
        try {
            let { page, limit } = queryParams;
            page = Number(page) || 1
            limit = Number(limit) || 10
            const offset = Number((page - 1) * limit)
            const venues = await this.venueModel.findAll({ where: { ownerId: user.id } })
            const venueIds = venues.map(i => i.id)
            const events = await this.eventModel.findAndCountAll({
                where: {
                    venueId: { [Op.in]: venueIds },
                    status: "inrequest"
                },
                include: [
                    { model: this.userModel }
                ],
                limit, offset
            })
            await Promise.all(events.rows.map(async (e) => {
                (e as any).dataValues.mediaFiles = await this.mediaFileModel.findOne(
                    {
                        where: { relatedId: e.id, isThumbnail: true },
                        order: [['order', 'ASC']]
                    }
                );
            })); const response = genratePagination(events, page, limit)
            return responseSender(STRINGCONST.DATA_FOUND, HttpStatus.OK, true, response)
        } catch (error) {
            SendError(error.message)
        }
    }

    async approveRejectReq(eventId: string, status: "approved" | "rejected" | "finding_artist") {
        try {
            const req = await this.eventModel.findOne({ where: { id: eventId } })
            if (!req) {
                throw new NotFoundException(STRINGCONST.DATA_NOT_FOUND)
            }
            await req.update({ status: status })
        } catch (error) {
            SendError(error.message)
        }
    }
}