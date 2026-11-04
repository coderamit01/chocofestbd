import * as z from "zod";

export interface IPaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export const paginationQuerySchema = z.object({
    page: z.coerce.number().int().min(1, { error: "Page must be at least 1" }).default(1),
    limit: z.coerce.number().int().min(1, { error: "Limit must be at least 1" }).max(100, { error: "Limit must be at most 100" }).default(20),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export const getPagination = ({ page, limit }: PaginationQuery) => ({
    skip: (page - 1) * limit,
    take: limit,
});

export const paginationMeta = ({ page, limit }: PaginationQuery, total: number): IPaginationMeta => ({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
});
