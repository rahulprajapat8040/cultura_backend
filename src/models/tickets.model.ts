import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import modelName from "src/utils/common/modelName";
import { Events } from "./events.model";
import { User } from "./user.model";

@Table({ tableName: modelName.tickets, modelName: modelName.tickets, paranoid: true })
export class Tickets extends Model<Tickets, Partial<Tickets>> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string
    @Column({
        type: DataType.DATE
    })
    declare purchaseDate: string
    @Column({
        type: DataType.FLOAT
    })
    declare paidAmount: number
    @Column({
        type: DataType.STRING
    })
    declare ticketNumber: string
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    declare isCheckedIn: string
    @Column({
        type: DataType.STRING
    })
    declare qrCodeUrl: string

    @ForeignKey(() => Events)
    @Column({
        type: DataType.UUID
    })
    declare eventId: string
    @BelongsTo(() => Events)
    declare event: Events

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    declare purchaseById: string
    @BelongsTo(() => User)
    declare purchaseBy: User
}