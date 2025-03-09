import express from "express";
import {
  stats
} from "../controllers/dashboard.js";
import { authenticateOwner, authenticateCustomer } from "../middlewares/authenticate.js";

const router = express.Router();

//  stats
router.get("/stats", authenticateOwner,stats);

export default router;
