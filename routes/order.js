import express from "express";
import {
  createOrder,
  getCustomerOrders,
  getShopOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from "../controllers/order.js";
import { authenticateOwner, authenticateCustomer } from "../middlewares/authenticate.js";

const router = express.Router();

//  Create a new order (Customer)
router.post("/", authenticateCustomer, createOrder);

//  Get orders for a specific customer
router.get("/customer", authenticateCustomer, getCustomerOrders);

//  Get orders for a shop owner
router.get("/shop", authenticateOwner, getShopOrders);

//  Update order status (Owner)
router.put("/:orderId/status", authenticateOwner, updateOrderStatus);

//  Update payment status (Owner)
router.put("/:orderId/payment", authenticateOwner, updatePaymentStatus);

export default router;
