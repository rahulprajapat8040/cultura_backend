import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, SignupDto } from "src/utils/dtos/auth.dto";

@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Post("send-otp")
    async sendOtp(
        @Body('email') email: string,
    ) {
        return this.authService.sendOtp(email)
    }

    @Post("signup")
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

    @Get("log-out")
    async logOut(
        @Query('deviceId') deviceId: string
    ) {
        return this.authService.logOut(deviceId)
    }
}