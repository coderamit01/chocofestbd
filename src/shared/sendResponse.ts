import { Response } from "express";
import type { IPaginationMeta } from "./pagination";

interface IResponseData<T> {
    statusCode: number,
    message: string,
    success: boolean,
    data?: T,
    meta?: IPaginationMeta
}

export const sendResponse = <T>(res: Response, responseData: IResponseData<T>) => {
    const { statusCode, message, success, data, meta } = responseData

    res.status(statusCode).json({
        success,
        message,
        data,
        meta
    })
}
