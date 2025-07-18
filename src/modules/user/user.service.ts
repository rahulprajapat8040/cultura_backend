import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Category, Events, EventTicket, User } from "src/models";
import { generatePagination, getPages, responseSender, SendError } from "src/utils/helper/funcation.helper";
import { FileService } from "../files/file.service";
import { MulterRequest } from "src/types/multer.type";
import STRINGCONST from "src/utils/common/stringConst";
import { literal, Op } from "sequelize";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User,
        @InjectModel(Category) private readonly categoryModel: typeof Category,
        @InjectModel(Events) private readonly eventModel: typeof Events,
        @InjectModel(EventTicket) private readonly ticketModel: typeof EventTicket,
        private readonly fileService: FileService
    ) { }

    async createCategory(req: MulterRequest) {
        const { file, body } = await this.fileService.uploadFile(req, 'category')
        try {
            const category = await this.categoryModel.create({
                ...body,
                image: file[0].path ? file[0].path : body.image
            })
            return responseSender(STRINGCONST.DATA_ADDED, HttpStatus.CREATED, true, category)
        } catch (error) {
            SendError(error.message)
        }
    }

    async getAllCategories(queryParams) {
        try {
            const { page, limit, offset } = getPages(queryParams.page, queryParams.limit)
            const category = await this.categoryModel.findAndCountAll({
                limit, offset
            })
            const response = generatePagination(category, page, limit)
            return responseSender(STRINGCONST.DATA_FETCHED, HttpStatus.OK, true, response)
        } catch (error) {
            SendError(error.message)
        }
    }

    async createEvent(req: MulterRequest) {
        const { file, body } = await this.fileService.uploadFile(req, 'events')
        try {
            const user = req.user as User
            const event = await this.eventModel.create({
                ...body,
                hostedById: user.id,
                bannerImage: file[0] ? file[0].path : body.bannerImage
            })
            for (const item of JSON.parse(body.eventTickets)) {
                await this.ticketModel.create({
                    ...item,
                    eventId: event.id
                })
            }
            return responseSender(STRINGCONST.DATA_ADDED, HttpStatus.CREATED, true, event)
        } catch (error) {
            this.fileService.removeFile(file[0].path)
            SendError(error.message)
        }
    }

    async getAllEvents(queryParams) {
        try {
            const { page, limit, offset } = getPages(queryParams.page, queryParams.limit)
            const events = await this.eventModel.findAndCountAll({
                limit, offset,
                include: [{ model: this.ticketModel }]
            })
            const response = generatePagination(events, page, limit)
            return responseSender(STRINGCONST.DATA_FETCHED, HttpStatus.OK, true, response)
        } catch (error) {
            SendError(error.message)
        }
    }

    async getHomeData(queryParams) {
        try {
            const limit = 6;
            const { latitude, longitude } = queryParams;
            const [
                categories,
                locationEvents,
                onlineEvents,
                trendingEvents
            ] = await Promise.all([
                this.categoryModel.findAll({ limit }),
                this.locationEvents(latitude, longitude), // You may later filter based on location
                this.eventModel.findAll({ limit, where: { isOnline: true } }),
                this.eventModel.findAll({ limit }) // Replace with actual trending filter logic
            ]);
            const response = { categories, locationEvents, onlineEvents, trendingEvents }
            return responseSender(STRINGCONST.DATA_FETCHED, HttpStatus.OK, true, response)
        } catch (error) {
            console.log(error)
            SendError(error.message);
        }
    }


    private async locationEvents(latitude?: string, longitude?: string) {
        const limit = 6;
        const DEFAULT_LAT = 19.0760; // Mumbai Latitude
        const DEFAULT_LNG = 72.8777; // Mumbai Longitude

        const lat = parseFloat(latitude || `${DEFAULT_LAT}`);
        const lng = parseFloat(longitude || `${DEFAULT_LNG}`);

        if (isNaN(lat) || isNaN(lng)) {
            throw new Error('Invalid coordinates');
        }

        const distanceFormula = literal(`
          6371 * acos(
            cos(radians(${lat})) *
            cos(radians(latitude)) *
            cos(radians(longitude) - radians(${lng})) +
            sin(radians(${lat})) *
            sin(radians(latitude))
          )
        `);

        const events = await this.eventModel.findAll({
            where: {
                latitude: { [Op.not]: null as any },
                longitude: { [Op.not]: null as any }
            },
            attributes: {
                include: [[distanceFormula, 'distance']]
            },
            order: [[literal('distance'), 'ASC']],
            limit
        });

        return events;
    }

}