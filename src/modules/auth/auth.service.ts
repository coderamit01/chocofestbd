import type { IncomingHttpHeaders } from "node:http";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../helpers/AppError";
import { SignInPayload, SignUpPayload } from "./auth.validation";


export const AuthService = {
    signUp: async (payload: SignUpPayload, reqHeaders: IncomingHttpHeaders) => {
        const { name, email, password } = payload;

        const existingUser = await prisma.user.findUnique({
            where: { email },
            select: { id: true },
        });

        if (existingUser) {
            throw new AppError("An account with this email already exists", 409);
        }

        const { headers, response } = await auth.api.signUpEmail({
            body: { name, email, password },
            headers: fromNodeHeaders(reqHeaders),
            returnHeaders: true,
        });

        return { user: response.user, headers };
    },

    signIn: async (payload: SignInPayload, reqHeaders: IncomingHttpHeaders) => {
        const { email, password, rememberMe } = payload;

        const { headers, response } = await auth.api.signInEmail({
            body: { email, password, ...(rememberMe !== undefined && { rememberMe }) },
            headers: fromNodeHeaders(reqHeaders),
            returnHeaders: true,
        });

        return { user: response.user, headers };
    },

    signOut: async (reqHeaders: IncomingHttpHeaders) => {
        const { headers } = await auth.api.signOut({
            headers: fromNodeHeaders(reqHeaders),
            returnHeaders: true,
        });
        return { headers };
    },

    signOutAll: async (reqHeaders: IncomingHttpHeaders) => {
        const headers = fromNodeHeaders(reqHeaders);

        await auth.api.revokeOtherSessions({ headers });

        const { headers: responseHeaders } = await auth.api.signOut({
            headers,
            returnHeaders: true,
        });

        return { headers: responseHeaders };
    },
}
