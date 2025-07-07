import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import modelName from "src/utils/common/modelName";
import { User } from "./user.model";
import { RoleModel } from "./roles.model";

@Table({ tableName: modelName.subscription, modelName: modelName.subscription, paranoid: true })
export class Subscription extends Model<Subscription, Partial<Subscription>> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string
    @Column({
        type: DataType.DATE
    })
    declare startDate: string
    @Column({
        type: DataType.DATE
    })
    declare endDate: string
    @Column({
        type: DataType.ENUM("active", "expired", "cancelled")
    })
    declare status: "active" | "expired" | "cancelled"
    @Column({
        type: DataType.STRING
    })
    declare stripeSubscriptionId: string

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    declare userId: string

    @BelongsTo(() => User)
    user: User

    @ForeignKey(() => RoleModel)
    @Column({
        type: DataType.UUID
    })
    declare roleId: string
    @BelongsTo(() => RoleModel)
    declare role: RoleModel
}