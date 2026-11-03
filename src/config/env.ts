import dotenv from "dotenv"
import { AppError } from "../helpers/AppError";

dotenv.config();

interface EnvConfig {
    PORT: string,
    APP_URL: string,
    DATABASE_URL: string,
    BETTER_AUTH_SECRET: string,
    BETTER_AUTH_URL: string,
    ADMIN_NAME: string,
    ADMIN_EMAIL: string,
    ADMIN_PASSWORD: string,
    ADMIN_PHONE: string,
    // ACCESS_TOKEN_SECRET: string,
    // REFRESH_TOKEN_SECRET: string,
    // ACCESS_TOKEN_EXPIRES_IN: string,
    // REFRESH_TOKEN_EXPIRES_IN: string,
    // CLOUDINARY_CLOUD_NAME: string,
    // CLOUDINARY_API_KEY: string,
    // CLOUDINARY_API_SECRET: string,
    // STRIPE_SECRET_KEY: string,
    // STRIPE_WEBHOOK_SECRET: string,
}

const loadEnvVars = (): EnvConfig => {

    const requitedEnvVars = [
        "PORT",
        "APP_URL",
        "DATABASE_URL",
        "BETTER_AUTH_SECRET",
        "BETTER_AUTH_URL",
        "ADMIN_NAME",
        "ADMIN_PASSWORD",
        "ADMIN_EMAIL",
        "ADMIN_PHONE",
        // "ACCESS_TOKEN_SECRET",
        // "REFRESH_TOKEN_SECRET",
        // "ACCESS_TOKEN_EXPIRES_IN",
        // "REFRESH_TOKEN_EXPIRES_IN",
        // "CLOUDINARY_CLOUD_NAME",
        // "CLOUDINARY_API_KEY",
        // "CLOUDINARY_API_SECRET",
        // "STRIPE_SECRET_KEY",
        // "STRIPE_WEBHOOK_SECRET",
    ];

    requitedEnvVars.forEach((ev) => {
        if (!process.env[ev]) {
            throw new AppError(`Environment variable ${ev} is required. But it's missing in env file`, 500);
        }
    })

    return {
        PORT: process.env.PORT as string,
        APP_URL: process.env.APP_URL as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
        ADMIN_NAME: process.env.ADMIN_NAME as string,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,
        ADMIN_PHONE: process.env.ADMIN_PHONE as string,
        // ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
        // REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
        // ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
        // REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
        // CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
        // CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
        // CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
        // STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
        // STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET as string,
    }
}

export const envVars = loadEnvVars();