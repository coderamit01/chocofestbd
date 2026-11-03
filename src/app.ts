import express, { type NextFunction, type Request, type Response } from 'express'
import { auth } from './lib/auth';
import { toNodeHandler } from 'better-auth/node';
import cookieParser from 'cookie-parser';
import { IndexRoutes } from './routes';
import { envVars } from './config/env';
import cors from "cors"
import helmet from 'helmet';
import { ZodError } from 'zod';

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

    const statusCode = err.statusCode ?? 500;
    const message = err.message || "Server Error";
    res.status(statusCode).json({
        success: false,
        message
    })
})

export default app;