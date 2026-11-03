import { Router } from "express";
import { AuthController } from "./auth.controller";


const router = Router();

router.post("/sign-up", AuthController.SignUp)


export const AuthRoutes = router;