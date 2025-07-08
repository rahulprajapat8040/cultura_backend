import { Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import modelName from "src/utils/common/modelName";
import { Events } from "./events.model";

@Table({ tableName: modelName.homeBaner, modelName: modelName.homeBaner, paranoid: true })
export default class HomeBanner extends Model<HomeBanner, Partial<HomeBanner>> {
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
    declare bannerImage: string
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare bannerTitle: string
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare ctaButton: string

    @ForeignKey(() => Events)
    @Column({
        type: DataType.UUID
    })
    declare eventId: string
}