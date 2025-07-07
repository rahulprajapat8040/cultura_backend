import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLE_KEY } from "./roles.decorator";
import { Request } from "express";
import { RoleModel, User } from "src/models";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        @InjectModel(User) private userModel: typeof User,
        private reflector: Reflector
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        if (!requiredRoles) return true
        const request: Request = context.switchToHttp().getRequest()
        const userPayload = request.user as User;
        if (!userPayload) {
            throw new UnauthorizedException('User not found in request.');
        }
        const user = await this.userModel.findByPk(userPayload.id, {
            include: [{ model: RoleModel }],
        });
        if (!user || !user.role) {
            throw new ForbiddenException('Role not assigned.');
        }
        const hasRole = requiredRoles.includes(user.role.userRole);
        if (!hasRole) {
            throw new ForbiddenException('You do not have permission.');
        }
        return true
    }
}