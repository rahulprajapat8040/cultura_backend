import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import modelName from "src/utils/common/modelName";
import { Venue } from "./venue.model";
import { User } from "./user.model";

@Table({ tableName: modelName.venueRatings, modelName: modelName.venueRatings, paranoid: true })
export class VenueRatings extends Model<VenueRatings, Partial<VenueRatings>> {
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
    declare review: string
    @Column({
        type: DataType.FLOAT,
        allowNull: false
    })
    declare rating: number

    @ForeignKey(() => Venue)
    @Column({
        type: DataType.UUID
    })
    declare venueId: string
    @BelongsTo(() => Venue)
    declare venue: Venue

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    declare ratedById: string
    @BelongsTo(() => User)
    declare ratedBy: User
}