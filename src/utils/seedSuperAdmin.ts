import path from "node:path";
import { fileURLToPath } from "node:url";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { envVars } from "../config/env";
import { UserRole } from "../generated/prisma/enums";
import { AppError } from "../helpers/AppError";

export async function seedSuperAdmin() {
  try {
    const superAdmin = await prisma.user.findFirst({
      where: { role: UserRole.SUPER_ADMIN },
    });

    if (superAdmin) {
      console.log("Super admin already exists. Skipping seed.");
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: envVars.ADMIN_EMAIL },
    });

    // Create user
    const userId =
      existingUser?.id ??
      (
        await auth.api.signUpEmail({
          body: {
            name: envVars.ADMIN_NAME,
            email: envVars.ADMIN_EMAIL,
            password: envVars.ADMIN_PASSWORD,
            phone: envVars.ADMIN_PHONE,
          },
        })
      ).user.id;

    await prisma.user.update({
      where: { id: userId },
      data: {
        role: UserRole.SUPER_ADMIN,
        emailVerified: true,
      },
    });

    console.log(`Super admin has created..`);
  } catch (error) {
    if (error instanceof AppError) throw error;

    const message = error instanceof Error ? error.message : String(error);
    throw new AppError(`Failed to seed super admin: ${message}`, 500);
  }
};


seedSuperAdmin().catch((error) => {
  console.log(error.message ?? error);
  process.exitCode = 1;
}).finally(() => prisma.$disconnect())