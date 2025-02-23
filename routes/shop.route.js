import { Router } from "express";
import { registerShop, getShopById, updateShop, deleteShop } from "../controllers/shop.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
const router = Router();
router.post("/registerShop", verifyToken,upload.single("image"), registerShop);
router.get("/:shopId",verifyToken,getShopById);
router.put("/:shopId",verifyToken,updateShop);
router.delete("/:shopId",verifyToken,deleteShop)
export default router;