import express from "express";
import { addProduct, updateProduct, deleteProduct, getProducts } from "../controllers/product.js";
import { authenticateOwner } from "../middlewares/authenticate.js";

const router = express.Router();

router.post("/:shopId/add", addProduct); // Add item
router.put("/:productId/update",  updateProduct); // Update item
router.delete("/:productId/delete",  deleteProduct); // Delete item
router.get("/:shopId/products", getProducts); // Fetch all products of a shop

export default router;
