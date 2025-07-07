import { Column, DataType, HasMany, HasOne, Model, PrimaryKey, Table } from "sequelize-typescript";
import modelName from "src/utils/common/modelName";
import { DeviceInfo } from "./deviceInfo.model";
import { RoleModel } from "./roles.model";
import { Subscription } from "./Subscription.model";
import { Venue } from "./venue.model";
import { MediaFiles } from "./mediaFile.model";

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
}