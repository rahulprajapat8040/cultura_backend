import { Column, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import modelName from "src/utils/common/modelName";
import { Events } from "./events.model";

@Table({ tableName: modelName.category, modelName: modelName.category, paranoid: true })
export class Category extends Model<Category, Partial<Category>> {
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
        type: DataType.STRING,
        allowNull: false
    })
    declare image: string

    @HasMany(() => Events)
    declare events: Events[]
}