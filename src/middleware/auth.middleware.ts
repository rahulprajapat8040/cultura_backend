import { BadRequestException, ForbiddenException, Injectable, NestMiddleware, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { NextFunction, Request, Response } from "express";
import { User } from "src/models";
import * as jwt from 'jsonwebtoken'
import STRINGCONST from "src/utils/common/stringConst";

@Injectable()

export class AuthMiddleware implements NestMiddleware {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new ForbiddenException("Auth Token Is Missing")
        }
        const token = authHeader.split(" ")[1];
        try {
            const secretKey = process.env.JWT_ACCESS_TOKEN_KEY
            if (!secretKey) throw new Error("JWT_ACCESS_TOKEN_KEY is not defined!");
            const decode = jwt.verify(token, secretKey) as unknown as { userId: string }
            const user: User | null = await this.userModel.findByPk(decode.userId)
            if (!user) {
                throw new NotFoundException(STRINGCONST.USER_NOT_FOUND)
            }
            if (user) {
                req.user = user
            } else {
                req.user = undefined
            }
        } catch (error) {
            throw new BadRequestException(error.message)
        }
        next()
    }
}