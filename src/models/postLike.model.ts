import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import modelName from "src/utils/common/modelName";
import { Posts } from "./posts.model";
import { User } from "./user.model";

@Table({ tableName: modelName.postLike, modelName: modelName.postLike, paranoid: true })
export class PostLike extends Model<PostLike, Partial<PostLike>> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string
    @ForeignKey(() => Posts)
    @Column({
        type: DataType.UUID
    })
    declare postId: string
    @BelongsTo(() => Posts)
    declare post: Posts

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    declare likedById: string
    @BelongsTo(() => User)
    declare likedBy: User
}