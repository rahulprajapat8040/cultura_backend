import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import modelName from "src/utils/common/modelName";
import { User } from "./user.model";
import { PostHashtags } from "./postHashtag.model";

@Table({ tableName: modelName.posts, modelName: modelName.posts, paranoid: true })
export class Posts extends Model<Posts, Partial<Posts>> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string
    @Column({
        type: DataType.TEXT("long")
    })
    declare content: string

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    declare authorId: string
    @BelongsTo(() => User)
    declare author: User

    @HasMany(() => PostHashtags)
    declare postHashtags: PostHashtags[]
}