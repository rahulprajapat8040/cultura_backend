import { RedisModule } from "@nestjs-modules/ioredis";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./auth/auth.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "src/models";
import { VenueModule } from "./venue/venue.module";
import { MediaFileModule } from "./mediaFile/mediaFile.module";

const Modules = [
    SequelizeModule.forFeature([User]),
    DatabaseModule, RedisModule, AuthModule, VenueModule, MediaFileModule
];
export default Modules;