import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { signUpSchema } from "./auth.validation";


const router = Router();

router.post("/sign-up", validateRequest(signUpSchema), AuthController.SignUp)


export const AuthRoutes = router;