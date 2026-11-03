import type { IncomingHttpHeaders } from "node:http";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../helpers/AppError";
import { SignUpPayload } from "./auth.validation";


export const AuthService = {
    signUp: async (payload: SignUpPayload, reqHeaders: IncomingHttpHeaders) => {
        const { name, password, phone } = payload;
        const email = payload.email.toLowerCase();

        const existingUser = await prisma.user.findFirst({
            where: { email },
            select: { email: true, phone: true },
        });

        if (existingUser?.email === email) {
            throw new AppError("An account with this email already exists", 409);
        }


        const { headers, response } = await auth.api.signUpEmail({
            body: { name, email, password, phone },
            headers: fromNodeHeaders(reqHeaders),
            returnHeaders: true,
        });

        return { user: response.user, headers };
    },
}
