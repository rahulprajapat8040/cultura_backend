import { Column, DataType, HasMany, HasOne, Model, PrimaryKey, Table } from "sequelize-typescript";
import modelName from "src/utils/common/modelName";
import { DeviceInfo } from "./deviceInfo.model";
import { RoleModel } from "./roles.model";
import { Subscription } from "./Subscription.model";
import { Venue } from "./venue.model";
import { MediaFiles } from "./mediaFile.model";
import { VenueRatings } from "./venueRatings.model";
import { Events } from "./events.model";
import { Tickets } from "./tickets.model";
import { Posts } from "./posts.model";
import { Follow } from "./follow.model";
import { PostView } from "./postView.model";
import { PostLike } from "./postLike.model";

@Table({ tableName: modelName.users, modelName: modelName.users, paranoid: true })
export class User extends Model<User, Partial<User>> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare fullName: string
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare email: string
    @Column({
        type: DataType.STRING,
    })
    declare phoneNo: string
    @Column({
        type: DataType.STRING
    })
    declare countryCode: string
    @Column({
        type: DataType.DATEONLY,
        allowNull: false
    })
    declare dob: string
    @Column({
        type: DataType.STRING
    })
    declare aboutYou: string
    @Column({
        type: DataType.ENUM("male", "female")
    })
    declare gender: 'male' | 'female'
    @Column({
        type: DataType.STRING
    })
    declare profilePhoto: string

    @HasMany(() => DeviceInfo)
    declare deviceInfo: DeviceInfo[]
    @HasOne(() => RoleModel)
    declare role: RoleModel
    @HasMany(() => Subscription)
    declare subscription: Subscription[]
    @HasMany(() => Venue)
    declare venues: Venue[]
    @HasMany(() => MediaFiles)
    declare mediaFiles: MediaFiles[]
    @HasMany(() => VenueRatings)
    declare ratedVenues: VenueRatings[]
    @HasMany(() => Events)
    declare events: Events[]
    @HasMany(() => Tickets)
    declare eventTickets: Tickets[]
    @HasMany(() => Posts)
    declare posts: Posts[]
    @HasMany(() => Follow, "followerId")
    declare following: Follow[]
    @HasMany(() => Follow, 'followingId')
    declare followers: Follow[];
    @HasMany(() => PostView)
    declare postView: PostView[]
    @HasMany(() => PostLike)
    declare likedPost: PostLike[]
}