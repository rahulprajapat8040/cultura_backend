import { Column, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import modelName from "src/utils/common/modelName";
import { PostHashtags } from "./postHashtag.model";

@Table({ tableName: modelName.hashtags, modelName: modelName.hashtags, paranoid: true })
export class HashTags extends Model<HashTags, Partial<HashTags>> {
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
    declare tag: string

    @HasMany(() => PostHashtags)
    declare postHashtags: PostHashtags[]
}