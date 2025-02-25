import express from "express";
import { addItems, updateItem, deleteItem } from "../controllers/item.controller.js";

const router = express.Router();

router.post("/addItem", addItems); // Add item
router.put("/:shopId/updateItem", updateItem); // Update item
router.delete("/:shopId/deleteItem", deleteItem); // Delete item

export default router;
