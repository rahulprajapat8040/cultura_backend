import { SequelizeModule } from "@nestjs/sequelize";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/db.module";
import { RedisModule } from "./redis/redis.module";
import { User } from "src/models";
import { FileModule } from "./files/file.module";
import { UserModule } from "./user/user.module";

const Modules = [SequelizeModule.forFeature([User]), DatabaseModule, RedisModule, AuthModule, FileModule, UserModule]

export default Modules;