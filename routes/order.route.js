import express from "express";
import {
    createOrder,
    getOrdersByShop,
    getOrderById,
    updateOrderStatus,
    deleteOrder
} from "../controllers/order.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/createOrder", verifyToken, createOrder); // ✅ Create Order
router.get("/order/:shopId", verifyToken, getOrdersByShop); // ✅ Get Orders by Shop ID
router.get("/order/:orderId", verifyToken, getOrderById); // ✅ Get Order by Order ID
router.put("/updateOrder/:orderId", verifyToken, updateOrderStatus); // ✅ Update Order Status
router.delete("/deleteOrder/:orderId", verifyToken, deleteOrder); // ✅ Delete Order

export default router;
