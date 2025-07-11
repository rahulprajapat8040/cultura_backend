import { ModelCtor } from "sequelize-typescript"
import { DeviceInfo } from "./deviceInfo.model"
import { MediaFiles } from "./mediaFile.model"
import { RoleModel } from "./roles.model"
import { Subscription } from "./Subscription.model"
import { User } from "./user.model"
import { Venue } from "./venue.model"
import { VenueRatings } from "./venueRatings.model"
import { Events } from "./events.model"
import { Tickets } from "./tickets.model"
import { Posts } from "./posts.model"
import { HashTags } from "./hastags.model"
import { PostHashtags } from "./postHashtag.model"
import { Follow } from "./follow.model"
import { PostView } from "./postView.model"
import { PostLike } from "./postLike.model"

export const Models: ModelCtor[] = [
    DeviceInfo, User, RoleModel, Subscription, MediaFiles, Venue, VenueRatings, Events, Tickets, Posts,
    HashTags, PostHashtags, Follow, PostView, PostLike
]
export {
    DeviceInfo, User, RoleModel, Subscription, MediaFiles, Venue, VenueRatings, Events, Tickets, Posts,
    HashTags, PostHashtags, Follow, PostView, PostLike
}