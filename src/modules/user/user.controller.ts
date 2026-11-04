import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { userService } from "./user.service";
import { getAllUsersQuerySchema } from "./user.validation";

export const userController = {
    getAllUsers: catchAsync(async (req: Request, res: Response) => {
        const query = getAllUsersQuerySchema.parse(req.query);
        const { users, meta } = await userService.getAllUsers(query);

        res.setHeader("Cache-Control", "no-store");
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Users retrieved successfully",
            data: users,
            meta,
        });
    }),

    getAllCustomers: catchAsync(async (req: Request, res: Response) => {
        const query = getAllUsersQuerySchema.parse(req.query);
        const { users, meta } = await userService.getAllCustomers(query);

        res.setHeader("Cache-Control", "no-store");
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Customers retrieved successfully",
            data: users,
            meta,
        });
    }),
}
