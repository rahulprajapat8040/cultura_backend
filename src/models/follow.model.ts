import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import modelName from "src/utils/common/modelName";
import { User } from "./user.model";

@Table({ tableName: modelName.follow, modelName: modelName.follow, paranoid: true })
export class Follow extends Model<Follow, Partial<Follow>> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string
    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    declare followerId: string
    @BelongsTo(() => User, "followerId")
    declare follower: User

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    declare followingId: string
    @BelongsTo(() => User, 'followingId')
    declare following: User
}