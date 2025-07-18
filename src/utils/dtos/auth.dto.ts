import { IsNotEmpty, IsString } from "class-validator";

export class SignupDto {
    @IsNotEmpty({ message: 'Device Id is required' })
    @IsString({ message: 'Device Id must be a string' })
    deviceId: string;

    @IsNotEmpty({ message: 'Device Token is required' })
    @IsString({ message: 'Device Token must be a string' })
    deviceToken: string;

    @IsNotEmpty({ message: 'Email is required' })
    @IsString({ message: 'Email must be a string' })
    email: string;

    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    name: string;

    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    password: string;

    @IsNotEmpty({ message: 'OTP is required' })
    @IsString({ message: 'OTP must be a string' })
    otp: string;
}


export class LoginDto {
    @IsNotEmpty({ message: 'Device Id is required' })
    @IsString({ message: 'Device Id must be a string' })
    deviceId: string;

    @IsNotEmpty({ message: 'Device Token is required' })
    @IsString({ message: 'Device Token must be a string' })
    deviceToken: string;

    @IsNotEmpty({ message: 'Email is required' })
    @IsString({ message: 'Email must be a string' })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    password: string;
}