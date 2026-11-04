import * as z from "zod";
import { UserRole } from "../../generated/prisma/enums";
import { paginationQuerySchema } from "../../shared/pagination";

export const getAllUsersQuerySchema = paginationQuerySchema.extend({
    searchTerm: z.string().trim().min(1).optional()
});

export type GetAllUsersQuery = z.infer<typeof getAllUsersQuerySchema>;
