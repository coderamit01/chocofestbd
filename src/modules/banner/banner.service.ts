import { prisma } from "../../lib/prisma";
import { AppError } from "../../helpers/AppError";
import type { BannerCategoryPayload } from "./banner.validation";

const bannerCategorySelect = {
    id: true,
    name: true,
    createdAt: true,
    updatedAt: true,
    _count: { select: { banners: true } },
} as const;

export const bannerService = {
    createBannerCategory: async (payload: BannerCategoryPayload) => {
        const nameTaken = await prisma.bannerCategory.findFirst({
            where: { name: { equals: payload.name, mode: "insensitive" } },
            select: { id: true },
        });

        if (nameTaken) {
            throw new AppError("A banner category with this name already exists", 409);
        }

        return prisma.bannerCategory.create({
            data: payload,
            select: bannerCategorySelect,
        });
    },

    getAllBannerCategories: async () => {
        return prisma.bannerCategory.findMany({
            select: bannerCategorySelect,
            orderBy: { name: "asc" },
        });
    },

    getBannerCategoryById: async (categoryId: string) => {
        const category = await prisma.bannerCategory.findUnique({
            where: { id: categoryId },
            select: bannerCategorySelect,
        });

        if (!category) {
            throw new AppError("Banner category not found", 404);
        }

        return category;
    },

    updateBannerCategory: async (categoryId: string, payload: BannerCategoryPayload) => {
        const category = await prisma.bannerCategory.findUnique({
            where: { id: categoryId },
            select: { id: true },
        });

        if (!category) {
            throw new AppError("Banner category not found", 404);
        }

        const nameTaken = await prisma.bannerCategory.findFirst({
            where: {
                name: { equals: payload.name, mode: "insensitive" },
                NOT: { id: categoryId },
            },
            select: { id: true },
        });

        if (nameTaken) {
            throw new AppError("A banner category with this name already exists", 409);
        }

        return prisma.bannerCategory.update({
            where: { id: categoryId },
            data: payload,
            select: bannerCategorySelect,
        });
    },

    deleteBannerCategory: async (categoryId: string) => {
        const category = await prisma.bannerCategory.findUnique({
            where: { id: categoryId },
            select: { _count: { select: { banners: true } } },
        });

        if (!category) {
            throw new AppError("Banner category not found", 404);
        }

        if (category._count.banners > 0) {
            throw new AppError("Remove or move the banners in this category before deleting it", 409);
        }

        await prisma.bannerCategory.delete({ where: { id: categoryId } });
    },
}
