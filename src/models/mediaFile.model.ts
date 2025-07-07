import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import modelName from "src/utils/common/modelName";
import { User } from "./user.model";

@Table({ tableName: modelName.mediaFiles, modelName: modelName.mediaFiles, paranoid: true })
export class MediaFiles extends Model<MediaFiles, Partial<MediaFiles>> {
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
    declare mediaUrl: string
    @Column({
        type: DataType.STRING,
        defaultValue: 'image'
    })
    declare mediaType: string
    @Column({
        type: DataType.ENUM('venue', 'event', 'user', 'artist', 'product', 'post')
    })
    declare usage: 'venue' | 'event' | 'user' | 'artist' | 'product' | 'post'
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare relatedId: string
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    declare isThumbnail: boolean
    @Column({
        type: DataType.INTEGER
    })
    declare order: number
    @Column({
        type: DataType.STRING
    })
    declare altText: string

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    declare uploadedById: string
    @BelongsTo(() => User)
    declare uploadedBy: User
}