import express from "express";


import { addProduct, updateProduct, deleteProduct, getProducts,getLowStockProducts,getShopItemsByCategory,updateProductQuantities } from "../controllers/product.js";

import { authenticateOwner } from "../middlewares/authenticate.js";

const router = express.Router();

router.post("/:shopId/add", addProduct); // Add item
router.put("/:productId/update",  updateProduct); // Update item
router.delete("/:productId/delete",  deleteProduct); // Delete item
router.get("/:shopId/products", getProducts); // Fetch all products of a shop
router.get("/low-stock/:shopId", getLowStockProducts);
router.put("/update-quantities", updateProductQuantities);// Update product quantities



// i added 
router.get("/:shopId/items", getShopItemsByCategory);
export default router;
