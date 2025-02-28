import express from "express";
import { getSalesAnalytics } from "../controllers/salesAnalytics.controller.js";
import { authenticateOwner } from "../middleware/auth.middleware.js"; 

const router = express.Router();

router.get("/:shopId", authenticateOwner, getSalesAnalytics);

export default router;
