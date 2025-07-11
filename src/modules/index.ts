import { RedisModule } from "@nestjs-modules/ioredis";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./auth/auth.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "src/models";
import { VenueModule } from "./venue/venue.module";
import { MediaFileModule } from "./mediaFile/mediaFile.module";
import { UserModule } from "./user/user.module";
import { EventsModule } from "./events/events.module";
import { ArtistModule } from "./artist/artist.module";

const Modules = [
    SequelizeModule.forFeature([User]),
    DatabaseModule, RedisModule, AuthModule, VenueModule, MediaFileModule, UserModule, EventsModule,
    ArtistModule
];
export default Modules;