import express from "express";
import { addProduct,updateProduct,deleteProduct } from "../controllers/product.js";

const router = express.Router();

router.post("/add", addProduct); // Add item
router.put("/:productId/update", updateProduct); // Update item
router.delete("/:productId/delete", deleteProduct); // Delete item

export default router;
