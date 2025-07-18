import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import modelName from "src/utils/common/modelName";
import { User } from "./user.model";

@Table({ tableName: modelName.deviceInfo, modelName: modelName.deviceInfo })
export class DeviceInfo extends Model<DeviceInfo, Partial<DeviceInfo>> {
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
    declare deviceId: string
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare deviceToken: string
    @Column({
        type: DataType.STRING
    })
    declare otp: string
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    declare otpStatus: boolean
    @Column({
        type: DataType.STRING
    })
    declare accessToken: string

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    declare userId: string
    @BelongsTo(() => User)
    declare user: User
}