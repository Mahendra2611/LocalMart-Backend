import express from "express";
import { addShop,updateShop,deleteShop,getShop } from "../controllers/shop.controller.js";
import verifyOwner from "../middlewares/authOwner.middleware.js";

const router = express.Router();

router.post("/add", verifyOwner, addShop); // Add new shop
router.put("/update/:shopId", verifyOwner, updateShop); // Update shop (only non-sensitive fields)
router.delete("/delete/:shopId", verifyOwner, deleteShop); // Delete shop
router.get("/getShop",verifyToken,getShop)
export default router;
