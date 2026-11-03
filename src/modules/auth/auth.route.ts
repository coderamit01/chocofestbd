import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { signInSchema, signUpSchema } from "./auth.validation";


const router = Router();

router.post("/sign-up", validateRequest(signUpSchema), AuthController.signUp)
router.post("/sign-in", validateRequest(signInSchema), AuthController.signIn)
router.post("/sign-out", AuthController.signOut)
router.post("/sign-out-all", AuthController.signOutAll)


export const AuthRoutes = router;
