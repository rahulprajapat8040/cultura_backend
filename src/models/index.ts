import { ModelCtor } from "sequelize-typescript"
import { DeviceInfo } from "./deviceInfo.model"
import { MediaFiles } from "./mediaFile.model"
import { RoleModel } from "./roles.model"
import { Subscription } from "./Subscription.model"
import { User } from "./user.model"
import { Venue } from "./venue.model"

export const Models: ModelCtor[] = [DeviceInfo, User, RoleModel, Subscription, MediaFiles, Venue]
export { DeviceInfo, User, RoleModel, Subscription, MediaFiles, Venue }