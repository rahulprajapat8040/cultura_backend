import { Column, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import modelName from "src/utils/common/modelName";
import { DeviceInfo } from "./deviceInfo.model";

@Table({ tableName: modelName.user, modelName: modelName.user, paranoid: true })
export class User extends Model<User, Partial<User>> {
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
    declare email: string
    @Column({
        type: DataType.STRING
    })
    declare password: string
    @Column({
        type: DataType.STRING
    })
    declare profilePic: string
    @Column({
        type: DataType.STRING
    })
    declare websiteName: string
    @Column({
        type: DataType.STRING
    })
    declare company: string
    @Column({
        type: DataType.STRING
    })
    declare phone: string
    @Column({
        type: DataType.STRING
    })
    declare address: string
    @Column({
        type: DataType.STRING
    })
    declare city: string
    @Column({
        type: DataType.STRING
    })
    declare country: string
    @Column({
        type: DataType.STRING
    })
    declare pinCode: string

    @HasMany(() => DeviceInfo)
    declare devices: DeviceInfo[]
}