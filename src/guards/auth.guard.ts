import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { User } from "src/models";

@Injectable()

export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request: Request = context.switchToHttp().getRequest()
        const user = request.user as User
        if (!user) {
            throw new ForbiddenException("Authentication required")
        }
        return true
    }
}