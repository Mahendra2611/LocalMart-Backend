import express from "express";
import {stats} from "../controllers/dashboard.js";
import { authenticateOwner } from "../middlewares/authenticate.js";

const router = express.Router();


router.get("/stats", authenticateOwner,stats);

export default router;
