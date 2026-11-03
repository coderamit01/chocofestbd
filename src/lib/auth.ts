import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  baseURL: "http://localhost:3000",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: { enabled: true },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    customRules: {
      "/sign-up/email": {
        window: 3600,
        max: 5
      },
      "/sign-in/email": {
        window: 60,
        max: 5
      },
      "/get-session": false,
    }
  }
});
