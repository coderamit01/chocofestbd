import { UserRole } from "../../generated/prisma/enums";

export interface IActor {
    id: string;
    role: UserRole;
}
