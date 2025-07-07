import { ConflictException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { DeviceInfo, RoleModel, User } from "src/models";
import { LoginDto, SignupDto } from "src/utils/common/dto";
import STRINGCONST from "src/utils/common/stringConst";
import { otpGenerator, parameterNotFound, responseSender, SendError } from "src/utils/helper/funcation.helper";
import { RedisService } from "../redis/redis.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(DeviceInfo) private readonly deviceInfoModel: typeof DeviceInfo,
        @InjectModel(User) private readonly userModel: typeof User,
        @InjectModel(RoleModel) private readonly roleModel: typeof RoleModel,
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService,
    ) { }

    async sendOtp(phoneNo: string) {
        try {
            const otp = otpGenerator(6).toString()
            await this.redisService.set(`otp:${phoneNo}`, otp, 300)
            return responseSender(STRINGCONST.OTP_SENT, HttpStatus.OK, true, { otp })
        } catch (error) {
            SendError(error.message)
        }
    }

    async signup(singupDto: SignupDto) {
        try {
            const { fullName, email, phoneNo, countryCode, dob, gender, otp, deviceId, deviceToken } = singupDto
            const existingPhone = await this.userModel.findOne({ where: { phoneNo } })
            const existingEmail = await this.userModel.findOne({ where: { email } })
            const storedOtp = await this.redisService.get(`otp:${phoneNo}`)
            if (existingPhone) {
                throw new ConflictException(STRINGCONST.PHONE_NUM_EXIST)
            } else if (existingEmail) {
                throw new ConflictException(STRINGCONST.PHONE_NUM_EXIST)
            }
            if (!storedOtp || storedOtp !== otp) {
                SendError(STRINGCONST.INVALID_OTP)
            }
            const user = await this.userModel.create({
                fullName, email, phoneNo,
                countryCode, dob, gender
            })
            const payload = { userId: user.id }
            const accessToken = await this.jwtService.signAsync(payload);
            await this.deviceInfoModel.create({ deviceId, deviceToken, accessToken, otp: String(storedOtp), otpStatus: true, userId: user.id })
            await this.redisService.del(`otp:${phoneNo}`);
            await this.roleModel.create({ userRole: 'user', userId: user.id });
            (user as any).dataValues.accessToken = accessToken
            return responseSender(STRINGCONST.USER_SIGNUP, HttpStatus.CREATED, true, user)
        } catch (error) {
            SendError(error.message)
        }
    }

    async login(loginDto: LoginDto) {
        try {
            const { deviceId, deviceToken, phoneNo, countryCode, otp } = loginDto
            const user = await this.userModel.findOne({
                where: { phoneNo, countryCode },
                include: [this.roleModel]
            })
            if (!user) {
                throw new NotFoundException(STRINGCONST.USER_NOT_FOUND)
            }
            const storedOtp = await this.redisService.get(`otp:${phoneNo}`)
            if (!storedOtp || storedOtp !== otp) {
                SendError(STRINGCONST.INVALID_OTP)
            }
            const payload = { userId: user.id, role: user.role.userRole }
            const accessToken = await this.jwtService.signAsync(payload)
            await this.deviceInfoModel.create({ deviceId, deviceToken, accessToken, otp, otpStatus: true, userId: user.id })
            await this.redisService.del(`otp:${phoneNo}`);
            (user as any).dataValues.accessToken = accessToken
            return responseSender(STRINGCONST.USER_LOGIN, HttpStatus.OK, true, user)
        } catch (error) {
            SendError(error.message)
        };
    }

    async logOut(deviceId: string) {
        try {
            parameterNotFound(deviceId, "deviceId not found")
            await this.deviceInfoModel.destroy({ where: { deviceId: deviceId }, force: true })
            return responseSender(STRINGCONST.USER_LOGOUT, HttpStatus.OK, true, null)
        } catch (error) {
            SendError(error.message)
        }
    }

    async logOutAllDevice(user: User) {
        try {
            await this.deviceInfoModel.destroy({ where: { userId: user.id }, force: true })
            return responseSender(STRINGCONST.USER_LOGOUT, HttpStatus.OK, true, null)
        } catch (error) {
            SendError(error.message)
        }
    }
}