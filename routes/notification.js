import express from "express";
import {
  getUnreadNotifications,
  markAllAsRead,
  getUnreadNotificationsForCustomer,
  markAllAsReadForCustomer
} from "../controllers/notification.js";
import { authenticateOwner } from "../middlewares/authenticate.js"; // Middleware for authentication
import { authenticateCustomer } from "../middlewares/authenticate.js";
const router = express.Router();

// Get unread notifications for a specific shop
router.get("/:shopId",  getUnreadNotifications);
// Mark all notifications as read for a shop
router.put("/mark-all-read/:shopId",  markAllAsRead);

// Get unread notifications for a specific shop
router.get("/customer", authenticateCustomer, getUnreadNotificationsForCustomer);

// Mark all notifications as read for a shop
router.put("/customer/mark-all-read", authenticateCustomer, markAllAsReadForCustomer);

export default router;
