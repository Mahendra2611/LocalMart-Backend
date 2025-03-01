import express from "express";
import { addProduct, updateProduct, deleteProduct, getProducts } from "../controllers/product.js";
import { authenticateOwner } from "../middlewares/authenticate.js";

const router = express.Router();

router.post("/add", addProduct); // Add item
router.put("/:productId/update", authenticateOwner, updateProduct); // Update item
router.delete("/:productId/delete", authenticateOwner, deleteProduct); // Delete item
router.get("/:shopId/products", getProducts); // Fetch all products of a shop

export default router;
