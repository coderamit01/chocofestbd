import express, { type NextFunction, type Request, type Response } from 'express'
import { auth } from './lib/auth';
import { toNodeHandler } from 'better-auth/node';
import cookieParser from 'cookie-parser';
import { IndexRoutes } from './routes';
import { envVars } from './config/env';
import cors from "cors"
import helmet from 'helmet';
import { ZodError } from 'zod';
import { MulterError } from 'multer';
import path from 'node:path';
import { MAX_FILES } from './middlewares/upload';

const app = express()

app.use(helmet())

app.use(cors({
    origin: envVars.APP_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
}))

app.all('/api/auth/{*any}', toNodeHandler(auth));


app.use(express.json({ limit: "1mb" }))
app.use(cookieParser())

if (envVars.NODE_ENV === "development") {
    app.use("/uploads", express.static(path.resolve(envVars.STORAGE_LOCAL_DIR), {
        dotfiles: "deny",
        index: false,
        setHeaders: (res) => {
            res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        },
    }))
}



app.get("/", (_req, res) => {
    res.json({ success: true, message: "Chocofestbd API is working!" })
})
app.get("/health", (_req, res) => {
    res.json({ success: true, status: "Ok" })
})

app.use('/api/v1', IndexRoutes);

app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
})


app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: err.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        })
    }

    if (err instanceof MulterError) {
        const multerMessages: Partial<Record<MulterError["code"], string>> = {
            LIMIT_FILE_SIZE: "Each image must be 5 MB or smaller",
            LIMIT_FILE_COUNT: `You can upload at most ${MAX_FILES} images`,
            LIMIT_UNEXPECTED_FILE: `Unexpected file field: ${err.field}`,
        };

        return res.status(400).json({
            success: false,
            message: multerMessages[err.code] ?? err.message,
        })
    }

    const statusCode = err.statusCode ?? 500;
    const message = err.message || "Server Error";
    res.status(statusCode).json({
        success: false,
        message
    })
})

export default app;