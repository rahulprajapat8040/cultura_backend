import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, SignupDto } from "src/utils/common/dto";
import { AuthGuard } from "src/guards/auth.guard";
import { Request } from "express";
import { User } from "src/models";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post("send-otp")
    async sendOtp(
        @Body('phoneNo') phoneNo: string,
        @Body('countryCode') countryCode: string
    ) {
        return this.authService.sendOtp(phoneNo)
    }

    @Post('signup')
    async signup(
        @Body() signupDto: SignupDto
    ) {
        return this.authService.signup(signupDto)
    }

    @Post("login")
    async login(
        @Body() loginDto: LoginDto
    ) {
        return this.authService.login(loginDto)
    }

    @Get("logout")
    @UseGuards(AuthGuard)
    async logout(
        @Query('deviceId') deviceId: string
    ) {
        return this.authService.logOut(deviceId)
    }

    @Get("log-out-all-devices")
    @UseGuards(AuthGuard)
    async logOutAllDevice(
        @Req() req: Request
    ) {
        return this.authService.logOutAllDevice(req.user as User)
    }
}