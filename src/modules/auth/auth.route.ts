import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { signInSchema, signUpSchema } from "./auth.validation";
import authentication from "../../middlewares/Authentication";


const router = Router();

router.post("/sign-up", validateRequest(signUpSchema), AuthController.signUp)
router.post("/sign-in", validateRequest(signInSchema), AuthController.signIn)
router.post("/sign-out", AuthController.signOut)
router.post("/sign-out-all", AuthController.signOutAll)

router.get("/me", authentication(), AuthController.getProfile)

export const AuthRoutes = router;
