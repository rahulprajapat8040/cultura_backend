import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import modelName from "src/utils/common/modelName";
import { User } from "./user.model";
import { Subscription } from "./Subscription.model";

@Table({ tableName: modelName.roles, modelName: modelName.roles, paranoid: true })
export class RoleModel extends Model<RoleModel, Partial<RoleModel>> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string
    @Column({
        type: DataType.ENUM("user", "artist", "organizer", "vendor", "venue_owner", "admin"),
        defaultValue: 'user'
    })
    declare userRole: "user" | "artist" | "organizer" | "vendor" | "venue_owner" | "admin"
    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    declare userId: string
    @BelongsTo(() => User)
    declare user: User

    @HasMany(() => Subscription)
    subscription: Subscription[]
}