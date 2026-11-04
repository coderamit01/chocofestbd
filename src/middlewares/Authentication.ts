import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import { AppError } from "../helpers/AppError";
import { UserRole } from "../generated/prisma/enums";

const authentication = (...roles: UserRole[]) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const session = await auth.api.getSession({
                headers: fromNodeHeaders(req.headers),
            });

            if (!session) {
                throw new AppError("You are not authorized", 401);
            }

            if (roles.length && !roles.includes(session.user.role as UserRole)) {
                throw new AppError("You do not have permission to access this resource", 403);
            }

            req.user = session.user;
            next();
        } catch (error) {
            next(error);
        }
    };
}


export default authentication;
