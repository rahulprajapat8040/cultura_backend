import { InjectModel } from "@nestjs/sequelize";
import { DeviceInfo, User } from "src/models";
import { RedisService } from "../redis/redis.service";
import { otpGenerator, parameterNotFound, responseSender, SendError } from "src/utils/helper/funcation.helper";
import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import STRINGCONST from "src/utils/common/stringConst";
import { LoginDto, SignupDto } from "src/utils/dtos/auth.dto";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User,
        @InjectModel(DeviceInfo) private readonly deviceModel: typeof DeviceInfo,
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService
    ) { }

    async sendOtp(email: string,) {
        try {
            const otp = otpGenerator(6);
            await this.redisService.set(`${email}-otp`, otp, 300)
            return responseSender(STRINGCONST.OTP_SENT, HttpStatus.OK, true, { otp });
        } catch (error) {
            SendError(error.message)
        }
    }

    async signup(signupDto: SignupDto) {
        try {
            const isExist = await this.userModel.findOne({ where: { email: signupDto.email } })
            if (isExist) {
                SendError(STRINGCONST.USER_EXIST)
            }
            const storedOtp = await this.redisService.get(`${signupDto.email}-otp`)
            if (!storedOtp || storedOtp !== signupDto.otp) {
                SendError(STRINGCONST.INVALID_OTP)
            }
            const hashedPass = await bcrypt.hash(signupDto.password, 15)
            const user = await this.userModel.create({ ...signupDto, password: hashedPass })
            const accessToken = await this.jwtService.signAsync({ userId: user.id })
            await this.deviceModel.create({ ...signupDto, userId: user.id, otpStatus: true, accessToken });
            (user as any).dataValues.accessToken = accessToken;
            return responseSender(STRINGCONST.USER_SIGNUP, HttpStatus.CREATED, true, user)
        } catch (error) {
            SendError(error.message)
        }
    }

    async login(loginDto: LoginDto) {
        try {
            const existUser = await this.userModel.findOne({
                where: { email: loginDto.email },
            });

            if (!existUser) {
                throw new NotFoundException(STRINGCONST.USER_NOT_FOUND);
            }

            const isMatched = await bcrypt.compare(
                loginDto.password,
                existUser.password
            );

            if (!isMatched) {
                return SendError(STRINGCONST.INVALID_PASSWORD);
            }

            // Generate JWT access token
            const accessToken = await this.jwtService.sign({
                userId: existUser.id,
            });

            // Upsert device info
            await this.deviceModel.upsert({
                deviceId: loginDto.deviceId,
                deviceToken: loginDto.deviceToken,
                userId: existUser.id,
                accessToken: accessToken
            });
            (existUser as any).dataValues.accessToken = accessToken;
            return responseSender(STRINGCONST.LOGIN_SUCCESS, HttpStatus.OK, true, existUser)
        } catch (error) {
            SendError(error.message)
        }
    }

    async logOut(deviceId: string) {
        try {
            parameterNotFound(deviceId, "deviceId is missing")
            const device = await this.deviceModel.destroy({ where: { deviceId }, force: true })
            return responseSender(STRINGCONST.LOG_OUT, HttpStatus.OK, true, device)
        } catch (error) {
            SendError(error.message)
        }
    }

    // async logOutAllDevices() {
    //     try {
    //         const deivce = await this.deviceModel.destroy({ where: { userId} })
    //     } catch (error) {
    //         SendError(error.message)
    //     }
    // }

}