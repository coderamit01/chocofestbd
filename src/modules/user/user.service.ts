import { prisma } from "../../lib/prisma";
import type { Prisma } from "../../generated/prisma/client";
import { UserRole } from "../../generated/prisma/enums";
import { AppError } from "../../helpers/AppError";
import { paginationMeta, getPagination } from "../../shared/pagination";
import type { GetAllUsersQuery, UpdateUserPayload } from "./user.validation";
import { IActor } from "./user.interface";


const userSelect = {
    id: true,
    name: true,
    email: true,
    phone: true,
    phoneVerified: true,
    emailVerified: true,
    image: true,
    role: true,
    isBanned: true,
    address: true,
    points: true,
    createdAt: true,
    updatedAt: true,
} satisfies Prisma.UserSelect;

export const userService = {
    getAllUsers: async (query: GetAllUsersQuery, filter: Prisma.UserWhereInput = {}) => {
        const { searchTerm } = query;

        const where: Prisma.UserWhereInput = {
            ...filter,
            ...(searchTerm && {
                OR: [
                    { name: { contains: searchTerm, mode: "insensitive" } },
                    { email: { contains: searchTerm, mode: "insensitive" } },
                    { phone: { contains: searchTerm } },
                ],
            }),
        };

        const [users, total] = await prisma.$transaction([
            prisma.user.findMany({
                where,
                select: userSelect,
                orderBy: { createdAt: "desc" },
                ...getPagination(query),
            }),
            prisma.user.count({ where }),
        ]);

        return { users, meta: paginationMeta(query, total) };
    },

    getAllCustomers: async (query: GetAllUsersQuery) => {
        return userService.getAllUsers(query, { role: UserRole.CUSTOMER });
    },

    updateUser: async (actor: IActor, userId: string, payload: UpdateUserPayload) => {
        const target = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true, phone: true },
        });

        if (!target) {
            throw new AppError("User not found", 404);
        }

        if (actor.role === UserRole.ADMIN) {
            if (target.role === UserRole.SUPER_ADMIN) {
                throw new AppError("Admin cannot update a super admin", 403);
            }
            if (payload.role === UserRole.SUPER_ADMIN) {
                throw new AppError("Admin cannot assign the super admin role", 403);
            }
        }

        if (actor.role !== UserRole.SUPER_ADMIN && actor.role !== UserRole.ADMIN) {
            if (actor.id !== userId) {
                throw new AppError("You can only update your own profile", 403);
            }
            if (payload.role !== undefined || payload.isBanned !== undefined) {
                throw new AppError("You cannot update role or ban status", 403);
            }
        }

        const phoneChanged = payload.phone !== undefined && payload.phone !== target.phone;

        if (phoneChanged && payload.phone) {
            const phoneTaken = await prisma.user.findFirst({
                where: { phone: payload.phone, NOT: { id: userId } },
                select: { id: true },
            });

            if (phoneTaken) {
                throw new AppError("An account with this phone number already exists", 409);
            }
        }

        const roleChanged = payload.role !== undefined && payload.role !== target.role;
        const signOutUser = roleChanged || payload.isBanned === true;

        const [user] = await prisma.$transaction([
            prisma.user.update({
                where: { id: userId },
                data: { ...payload, ...(phoneChanged && { phoneVerified: false }) },
                select: userSelect,
            }),
            ...(signOutUser ? [prisma.session.deleteMany({ where: { userId } })] : []),
        ]);

        return user;
    },
}
