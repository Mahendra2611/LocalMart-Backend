import { Router } from "express";
const router = Router();
import { addItem, updateItem, deleteItem } from "../controllers/item.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

router.post("/:shopId/items", verifyToken, addItem);

router.put("/:shopId/items/:itemId", verifyToken, updateItem);

router.delete("/:shopId/items/:itemId", verifyToken, deleteItem);

export default router;
