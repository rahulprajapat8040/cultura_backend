import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import modelName from "src/utils/common/modelName";
import { EventTicket } from "./eventTicket.model";
import { User } from "./user.model";
import { Category } from "./category.model";

@Table({ tableName: modelName.events, modelName: modelName.events, paranoid: true })
export class Events extends Model<Events, Partial<Events>> {
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
    declare title: string
    @Column({
        type: DataType.DATEONLY,
        allowNull: false
    })
    declare startDate: string
    @Column({
        type: DataType.TIME,
        allowNull: false
    })
    declare startTime: string
    @Column({
        type: DataType.DATEONLY,
        allowNull: false
    })
    declare endDate: string
    @Column({
        type: DataType.TIME,
        allowNull: false
    })
    declare endTime: string
    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    declare location: string
    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    declare latitude: string
    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    declare longitude: string
    @Column({
        type: DataType.TEXT("long"),
        allowNull: false
    })
    declare description: string
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare bannerImage: string
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    declare isFree: boolean
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    declare isOnline: boolean

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    declare hostedById: string
    @BelongsTo(() => User)
    declare hostedBy: User

    @ForeignKey(() => Category)
    @Column({
        type: DataType.UUID
    })
    declare categoryId: string

    @BelongsTo(() => Category)
    declare category: Category

    @HasMany(() => EventTicket)
    declare eventTickets: EventTicket[]
}