import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "src/models";

@Injectable()
export class ArtistService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User,
        // @InjectModel()
    ) { }
}