import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { UserRole } from "../generated/prisma/enums";

export const auth = betterAuth({
  baseURL: "http://localhost:3000",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      role: {
        type: Object.values(UserRole),
        required: false,
        input: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      address: {
        type: "string",
        required: false,
        input: false
      },
      isBanned: {
        type: "boolean",
        input: false
      },
      points: {
        type: "number",
        required: false,
        input: false,
      },
    },
  },
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
