import { Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import modelName from "src/utils/common/modelName";
import { Events } from "./events.model";

@Table({ tableName: modelName.eventRequest, modelName: modelName.eventRequest, paranoid: true })
export class EventRequest extends Model<EventRequest, Partial<EventRequest>> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string
    @ForeignKey(() => Events)
    @Column({
        type: DataType.STRING
    })
    declare eventId: string
}