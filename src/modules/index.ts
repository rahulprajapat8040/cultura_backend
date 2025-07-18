import { SequelizeModule } from "@nestjs/sequelize";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/db.module";
import { RedisModule } from "./redis/redis.module";
import { User } from "src/models";

const Modules = [SequelizeModule.forFeature([User]), DatabaseModule, RedisModule, AuthModule]

export default Modules;