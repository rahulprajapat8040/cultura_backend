
export class SignupDto {
    fullName: string
    email: string
    phoneNo: string
    countryCode: string
    dob: string
    gender: 'male' | 'female'
    otp: string
    deviceId: string
    deviceToken: string
}

export class LoginDto {
    deviceId: string
    deviceToken: string
    countryCode: string
    phoneNo: string
    otp: string
}