import express from "express";
import { addShop,updateShop,deleteShop,getShop } from "../controllers/shop.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/add", verifyToken, addShop); // Add new shop
router.put("/update/:shopId", verifyToken, updateShop); // Update shop (only non-sensitive fields)
router.delete("/delete/:shopId", verifyToken, deleteShop); // Delete shop
router.get("/getShop",verifyToken,getShop)
export default router;
