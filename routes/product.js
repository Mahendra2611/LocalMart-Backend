import express from "express";
import { addProduct,updateProduct,deleteProduct } from "../controllers/product.js";
import { authenticateOwner } from "../middlewares/authenticate.js";
const router = express.Router();

router.post("/add", authenticateOwner,addProduct); // Add item
router.put("/:productId/update", authenticateOwner,updateProduct); // Update item
router.delete("/:productId/delete", authenticateOwner,deleteProduct); // Delete item

export default router;
