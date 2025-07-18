import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import modelName from "src/utils/common/modelName";
import { Events } from "./events.model";

@Table({ tableName: modelName.eventTicket, modelName: modelName.eventTicket, paranoid: true })
export class EventTicket extends Model<EventTicket, Partial<EventTicket>> {
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
        type: DataType.FLOAT,
        allowNull: false
    })
    declare price: number

    @ForeignKey(() => Events)
    @Column({
        type: DataType.UUID
    })
    declare eventId: string

    @BelongsTo(() => Events)
    declare event: Events
}