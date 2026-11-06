import { Router } from "express";
import { UserRole } from "../../generated/prisma/enums";
import Authentication from "../../middlewares/Authentication";
import { validateRequest } from "../../middlewares/validateRequest";
import { bannerController } from "./banner.controller";
import { bannerCategorySchema } from "./banner.validation";


const router = Router();

router.post("/categories", Authentication(UserRole.SUPER_ADMIN, UserRole.ADMIN), validateRequest(bannerCategorySchema), bannerController.createBannerCategory);
router.get("/categories", Authentication(UserRole.SUPER_ADMIN, UserRole.ADMIN), bannerController.getAllBannerCategories);
router.get("/categories/:categoryId", Authentication(UserRole.SUPER_ADMIN, UserRole.ADMIN), bannerController.getBannerCategoryById);
router.put("/categories/:categoryId", Authentication(UserRole.SUPER_ADMIN, UserRole.ADMIN), validateRequest(bannerCategorySchema), bannerController.updateBannerCategory);
router.delete("/categories/:categoryId", Authentication(UserRole.SUPER_ADMIN, UserRole.ADMIN), bannerController.deleteBannerCategory);



router.post("/", bannerController.createBanner)





export const bannerRoutes = router;
