import { HttpStatus, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize";
import { Events, MediaFiles, Tickets, User, Venue, VenueRatings } from "src/models";
import { VenueRatingDto } from "src/utils/common/dto";
import STRINGCONST from "src/utils/common/stringConst";
import { genratePagination, responseSender, SendError } from "src/utils/helper/funcation.helper";
import { MulterRequest } from "src/utils/types/multerRequest";
import { FileService } from "../file/file.service";

export class UserService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User,
        @InjectModel(VenueRatings) private readonly venueRatingModel: typeof VenueRatings,
        @InjectModel(Venue) private readonly venueModel: typeof Venue,
        @InjectModel(MediaFiles) private readonly mediaFileModel: typeof MediaFiles,
        @InjectModel(Events) private readonly eventModel: typeof Events,
        @InjectModel(Tickets) private readonly ticketModel: typeof Tickets,
        private readonly fileService: FileService,
    ) { }

    async getUser(user: User) {
        try {
            const userDetail = await this.userModel.findByPk(user.id)
            if (!userDetail) {
                throw new NotFoundException(STRINGCONST.USER_NOT_FOUND)
            }
            return responseSender(STRINGCONST.DATA_FOUND, HttpStatus.OK, true, userDetail)
        } catch (error) {
            SendError(error.message)
        }
    }

    async updateAccount(req: MulterRequest) {
        const { file, body } = await this.fileService.uploadFile<User>(req, 'profile')
        try {
            const user = req.user as User
            const res = await this.userModel.findByPk(user.id)
            if (!res) {
                throw new NotFoundException(STRINGCONST.DATA_NOT_FOUND)
            }
            if (file.length) {
                this.fileService.removeFile(res.profilePhoto)
            }
            await user.update({
                ...body,
                profilePhoto: file[0] ? file[0].path : body.profilePhoto
            })
            return responseSender(STRINGCONST.USER_UPDATED, HttpStatus.OK, true, user)
        } catch (error) {
            SendError(error.message)
        }
    }

    async addVenueRating(venueRatingDto: VenueRatingDto, user: User) {
        try {
            const rating = await this.venueRatingModel.create({
                ...venueRatingDto,
                ratedById: user.id
            })
            return responseSender(STRINGCONST.VENUE_RATING_ADDED, HttpStatus.CREATED, true, rating)
        } catch (error) {
            SendError(error.message)
        }
    }

    async getYourVenueRatings(queryParams, user: User) {
        try {
            let { page, limit } = queryParams;
            page = Number(page) || 1
            limit = Number(limit) || 10
            const offset = Number((page - 1) * limit)
            const ratings = await this.venueRatingModel.findAndCountAll({
                where: { ratedById: user.id },
                limit, offset,
                include: [{ model: this.venueModel }]
            })
            const response = genratePagination(ratings, page, limit)
            return responseSender(STRINGCONST.DATA_FOUND, HttpStatus.OK, true, response)
        } catch (error) {
            SendError(error.message)
        }
    }

    async updateRating(venueRatingId: string, venueRatingDto: VenueRatingDto) {
        try {
            const rating = await this.venueRatingModel.findByPk(venueRatingId)
            if (!rating) {
                throw new NotFoundException(STRINGCONST.DATA_NOT_FOUND)
            }
            await rating.update({ ...venueRatingDto })
            return responseSender(STRINGCONST.RATING_UPDATED, HttpStatus.OK, true, rating)
        } catch (error) {
            SendError(error.message)
        }
    }

    async deleteVenueRating(venueRatingId: string) {
        try {
            const rating = await this.venueRatingModel.findByPk(venueRatingId)
            if (!rating) {
                throw new NotFoundException(STRINGCONST.DATA_NOT_FOUND)
            }
            await rating.destroy()
            return responseSender(STRINGCONST.RATING_DELETED, HttpStatus.OK, true, null)
        } catch (error) {
            SendError(error.message)
        }
    }

    async getAllVenues(queryParams) {
        try {
            let { page, limit } = queryParams;
            page = Number(page) || 1
            limit = Number(limit) || 10
            const offset = Number((page - 1) * limit)
            const venues = await this.venueModel.findAndCountAll({
                limit, offset,
            })
            const response = genratePagination(venues, page, limit)
            return responseSender(STRINGCONST.DATA_FOUND, HttpStatus.OK, true, response)
        } catch (error) {
            SendError(error.message)
        }
    }

    async getVenueDetail(venueId: string) {
        try {
            const venue = await this.venueModel.findByPk(
                venueId,
                {
                    include: [
                        { model: this.venueRatingModel }
                    ]
                }
            )
            if (!venue) {
                throw new NotFoundException(STRINGCONST.DATA_NOT_FOUND)
            }
            const mediaFiles = await this.mediaFileModel.findOne({ where: { relatedId: venue.id } });
            (venue as any).dataValues.mediaFiles = mediaFiles
            return responseSender(STRINGCONST.DATA_FOUND, HttpStatus.OK, true, venue)
        } catch (error) {
            SendError(error.message)
        }
    }

    async getTopBookedEvents() {
        try {
            const topEvents = await this.ticketModel.findAll({
                attributes: [
                    'eventId',
                    [Sequelize.fn('COUNT', Sequelize.col('Tickets.id')), 'ticketsSold']
                ],
                include: [
                    {
                        model: this.eventModel,
                        as: 'event',
                        attributes: ['id', 'eventName', 'coverImageUrl', 'startDate']
                    }
                ],
                group: ['eventId'],
                order: [[Sequelize.literal('ticketsSold'), 'DESC']],
                limit: 10
            });

            return responseSender('Top events fetched', HttpStatus.OK, true, topEvents);
        } catch (error) {
            SendError(error.message);
        }
    }

}