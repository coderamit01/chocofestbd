import { Router } from "express"
import { authRoutes } from "../modules/auth/auth.route";
import { userRoutes } from "../modules/user/user.route";
import { bannerRoutes } from "../modules/banner/banner.auth";


const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/banners", bannerRoutes);


export const IndexRoutes = router;