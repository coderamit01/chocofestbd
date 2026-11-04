import { prisma } from "../../lib/prisma";
import type { Prisma } from "../../generated/prisma/client";
import { UserRole } from "../../generated/prisma/enums";
import { paginationMeta, getPagination } from "../../shared/pagination";
import type { GetAllUsersQuery } from "./user.validation";

const findUsers = async (query: GetAllUsersQuery, filter: Prisma.UserWhereInput = {}) => {
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
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                phoneVerified: true,
                emailVerified: true,
                image: true,
                role: true,
                isBanned: true,
                points: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
            ...getPagination(query),
        }),
        prisma.user.count({ where }),
    ]);

    return {
        users,
        meta: paginationMeta(query, total),
    };
};

export const userService = {
    getAllUsers: async (query: GetAllUsersQuery) => findUsers(query),

    getAllCustomers: async (query: GetAllUsersQuery) => findUsers(query, { role: UserRole.CUSTOMER }),
}
