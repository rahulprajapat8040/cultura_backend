import { RequestMethod } from "@nestjs/common";

export const excludeRoutes = [
    { path: '/auth/send-otp', method: RequestMethod.POST },
    { path: '/auth/signup', method: RequestMethod.POST },
    { path: '/auth/login', method: RequestMethod.POST },
    { path: '/user/get-home-data', method: RequestMethod.GET },
]