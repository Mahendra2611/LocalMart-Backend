import { Product } from "../models/product.js";
import { Order } from "../models/order.js";
import mongoose from "mongoose";
export const stats = async (req, res) => {
    try {
      const shopId = req.ownerId; // Assuming shopId is stored in req.user after authentication
  
      if (!shopId) {
        return res.status(400).json({ message: "Shop ID is required" });
      }
      const shopObjectId = new mongoose.Types.ObjectId(shopId);
      // Fetch all stats in a single aggregation pipeline
      const [productStats, orderStats] = await Promise.all([
        Product.aggregate([
          { $match: { shopId: shopObjectId } },  // Ensure correct type
          { 
            $group: { 
              _id: null, 
              totalProducts: { $sum: 1 }, 
              lowStock: { $sum: { $cond: [{ $lt: ["$quantity", "$lowStockThreshold"] }, 1, 0] } } 
            } 
          }
        ]),
        Order.aggregate([
          { $match: { shopId: shopObjectId, status: "Pending" } },  // Ensure correct type
          { $group: { _id: null, pendingOrders: { $sum: 1 } } }
        ])
      ]);
  
      // Extract counts safely
      //console.log(productStats,orderStats)
      const stats = {
        totalProducts: productStats[0]?.totalProducts || 0,
        lowStock: productStats[0]?.lowStock || 0,
        pendingOrders: orderStats[0]?.pendingOrders || 0
      };
  
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Error fetching stats" });
    }
  };
  