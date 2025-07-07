import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import modelName from "src/utils/common/modelName";
import { User } from "./user.model";

@Table({ tableName: modelName.venue, modelName: modelName.venue, paranoid: true })
export class Venue extends Model<Venue, Partial<Venue>> {
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
    declare name: string

    @Column({
        type: DataType.STRING
    })
    declare location: string
    @Column({
        type: DataType.FLOAT,
        allowNull: false
    })
    declare latitude: number
    @Column({
        type: DataType.FLOAT,
        allowNull: false
    })
    declare longitude: number
    @Column({
        type: DataType.INTEGER
    })
    declare capacity: number
    @Column({
        type: DataType.FLOAT
    })
    declare price: number
    @Column({
        type: DataType.TEXT("long")
    })
    declare description: string

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    declare ownerId: string
    @BelongsTo(() => User)
    declare owner: User
}