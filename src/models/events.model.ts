import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import modelName from "src/utils/common/modelName";
import { User } from "./user.model";
import { Tickets } from "./tickets.model";
import { Venue } from "./venue.model";

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
    declare slug: string
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare evenetName: string
    @Column({
        type: DataType.TEXT("long"),
        allowNull: false
    })
    declare description: string
    @Column({
        type: DataType.TEXT("long"),
        allowNull: false
    })
    declare proposal: string
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare maxTickets: number
    @Column({
        type: DataType.FLOAT,
        allowNull: false
    })
    declare ticketPrice: number
    @Column({
        type: DataType.DATE
    })
    declare startDate: string
    @Column({
        type: DataType.DATE
    })
    declare endDate: string
    @Column({
        type: DataType.ENUM("inrequest", "rejected", "finding_artist", "upcoming", "live", "ended", "canceled", "approved"),
        defaultValue: 'inrequest'
    })
    declare status: "inrequest" | "rejected" | "finding_artist" | "upcoming" | "live" | "ended" | "canceled" | "approved"
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    declare isFree: boolean

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    declare organizerId: string
    @BelongsTo(() => User)
    declare organizer: User

    @ForeignKey(() => Venue)
    @Column({
        type: DataType.UUID
    })
    declare venueId: string

    @HasMany(() => Tickets)
    declare tickets: Tickets[]
}