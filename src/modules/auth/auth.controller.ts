import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { AuthService } from "./auth.service";


export const AuthController = {
    SignUp: catchAsync(async (req: Request, res: Response) => {
        const { user, headers } = await AuthService.signUp(req.body, req.headers);

        const cookies = headers.getSetCookie();
        if (cookies.length) res.setHeader("Set-Cookie", cookies);

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Account created successfully",
            data: user,
        });
    }),

    SignIn:  catchAsync(async(req:Request,res: Response) => {

    }),
}
