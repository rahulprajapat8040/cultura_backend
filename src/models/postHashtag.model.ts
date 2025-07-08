import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import modelName from "src/utils/common/modelName";
import { HashTags } from "./hastags.model";
import { Posts } from "./posts.model";

@Table({ tableName: modelName.postHashtags, modelName: modelName.postHashtags, paranoid: true })
export class PostHashtags extends Model<PostHashtags, Partial<PostHashtags>> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string
    @ForeignKey(() => HashTags)
    @Column({
        type: DataType.UUID
    })
    declare hashtagId: string
    @BelongsTo(() => HashTags)
    hashtag: HashTags

    @ForeignKey(() => Posts)
    @Column({
        type: DataType.UUID
    })
    declare postId: string
    @BelongsTo(() => Posts)
    declare post: Posts
}