import { Router } from "express";
import { login,logout,signup } from "../controllers/ownerAuth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();
router.post("/login",login)
router.get("/logout",verifyToken,logout);
router.post("/signup",signup);

export default router;