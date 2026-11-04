import { Router } from "express";
import authentication from "../../middlewares/Authentication";
import { UserRole } from "../../generated/prisma/enums";
import { userController } from "./user.controller";


const router = Router();

router.get("/", authentication(UserRole.SUPER_ADMIN, UserRole.ADMIN), userController.getAllUsers);
router.get("/customers", authentication(UserRole.SUPER_ADMIN, UserRole.ADMIN), userController.getAllCustomers);


export const userRoutes = router;
