import * as z from "zod";

export const bannerCategoryIdParamSchema = z.object({
    categoryId: z.string({ error: "Category id is required" }).trim().min(1, { error: "Category id is required" }),
});

export const bannerCategorySchema = z.strictObject({
    name: z
        .string({ error: "Name is required" })
        .trim()
        .min(2, { error: "Name must be at least 2 characters" })
        .max(50, { error: "Name must be at most 50 characters" }),
});

export type BannerCategoryPayload = z.infer<typeof bannerCategorySchema>;
