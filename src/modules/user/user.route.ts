import { Router } from "express";
import { UserRole } from "../../generated/prisma/enums";
import { userController } from "./user.controller";
import Authentication from "../../middlewares/Authentication";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateUserSchema } from "./user.validation";


const router = Router();

router.get("/", Authentication(UserRole.SUPER_ADMIN, UserRole.ADMIN), userController.getAllUsers);
router.get("/customers", Authentication(UserRole.SUPER_ADMIN, UserRole.ADMIN), userController.getAllCustomers);

router.patch("/:userId", Authentication(), validateRequest(updateUserSchema), userController.updateUser);


export const userRoutes = router;
