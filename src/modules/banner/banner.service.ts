import { prisma } from "../../lib/prisma";
import { AppError } from "../../helpers/AppError";
import type { Prisma } from "../../generated/prisma/client";
import { paginationMeta, getPagination } from "../../shared/pagination";
import { deleteFile, getFileUrl, uploadFile } from "../../lib/storage";
import type {
    BannerCategoryPayload,
    CreateBannerPayload,
    GetAllBannersQuery,
    UpdateBannerPayload,
} from "./banner.validation";

const bannerCategorySelect = {
    id: true,
    name: true,
    createdAt: true,
    updatedAt: true,
    _count: { select: { banners: true } },
} as const;

const bannerSelect = {
    id: true,
    title: true,
    imageKey: true,
    link: true,
    sortOrder: true,
    isActive: true,
    category: { select: { id: true, name: true } },
    createdAt: true,
    updatedAt: true,
} satisfies Prisma.BannerSelect;

type BannerRecord = Prisma.BannerGetPayload<{ select: typeof bannerSelect }>;

const toBannerResponse = ({ imageKey, ...banner }: BannerRecord) => ({
    ...banner,
    image: getFileUrl(imageKey),
});

const ensureBannerCategoryExists = async (categoryId: string) => {
    const category = await prisma.bannerCategory.findUnique({
        where: { id: categoryId },
        select: { id: true },
    });

    if (!category) {
        throw new AppError("Banner category not found", 404);
    }
};

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

    createBanner: async (payload: CreateBannerPayload, file: Express.Multer.File | undefined) => {
        if (!file) {
            throw new AppError("Banner image is required", 400);
        }

        await ensureBannerCategoryExists(payload.categoryId);

        const { key } = await uploadFile(file, "banners");

        try {
            const banner = await prisma.banner.create({
                data: { ...payload, imageKey: key },
                select: bannerSelect,
            });

            return toBannerResponse(banner);
        } catch (error) {
            await deleteFile(key);
            throw error;
        }
    },

    getAllBanners: async (query: GetAllBannersQuery) => {
        const { categoryId, isActive, searchTerm } = query;

        const where: Prisma.BannerWhereInput = {
            ...(categoryId && { categoryId }),
            ...(isActive !== undefined && { isActive }),
            ...(searchTerm && { title: { contains: searchTerm, mode: "insensitive" } }),
        };

        const [banners, total] = await prisma.$transaction([
            prisma.banner.findMany({
                where,
                select: bannerSelect,
                orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
                ...getPagination(query),
            }),
            prisma.banner.count({ where }),
        ]);

        return { banners: banners.map(toBannerResponse), meta: paginationMeta(query, total) };
    },

    getBannerById: async (bannerId: string) => {
        const banner = await prisma.banner.findUnique({
            where: { id: bannerId },
            select: bannerSelect,
        });

        if (!banner) {
            throw new AppError("Banner not found", 404);
        }

        return toBannerResponse(banner);
    },

    updateBanner: async (bannerId: string, payload: UpdateBannerPayload) => {
        const banner = await prisma.banner.findUnique({
            where: { id: bannerId },
            select: { id: true },
        });

        if (!banner) {
            throw new AppError("Banner not found", 404);
        }

        if (payload.categoryId) {
            await ensureBannerCategoryExists(payload.categoryId);
        }

        const updated = await prisma.banner.update({
            where: { id: bannerId },
            data: payload,
            select: bannerSelect,
        });

        return toBannerResponse(updated);
    },

    deleteBanner: async (bannerId: string) => {
        const banner = await prisma.banner.findUnique({
            where: { id: bannerId },
            select: { id: true },
        });

        if (!banner) {
            throw new AppError("Banner not found", 404);
        }

        await prisma.banner.delete({ where: { id: bannerId } });
    },
}
