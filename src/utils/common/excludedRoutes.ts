import { RequestMethod } from "@nestjs/common";

export const excludeRoutes = [
    { path: '/auth/signup', method: RequestMethod.POST },
    { path: '/auth/login', method: RequestMethod.POST },
]