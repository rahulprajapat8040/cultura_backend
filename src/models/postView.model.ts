import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import modelName from "src/utils/common/modelName";
import { Posts } from "./posts.model";
import { User } from "./user.model";

@Table({ tableName: modelName.postView, modelName: modelName.postView, paranoid: true })
export class PostView extends Model<PostView, Partial<PostView>> {
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
    declare viewerId: string
    @BelongsTo(() => User)
    declare viewer: User
}