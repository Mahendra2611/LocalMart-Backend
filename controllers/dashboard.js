import { Product } from "../models/product.js";
import { Order } from "../models/order.js";
import mongoose from "mongoose";
import { Owner } from "../models/owner.js";
export const stats = async (req, res,next) => {
    try {
      const shopId = req.ownerId; 
  
      if (!shopId) {
        return res.status(400).json({ message: "Shop ID is required" });
      }
      const shopObjectId = new mongoose.Types.ObjectId(shopId);
      const shopStatus = await Owner.findById(shopId).select('shopStatus')
      const [productStats, orderStats] = await Promise.all([
        Product.aggregate([
          { $match: { shopId: shopObjectId } },  
          { 
            $group: { 
              _id: null, 
              totalProducts: { $sum: 1 }, 
              lowStock: { $sum: { $cond: [{ $lt: ["$quantity", "$lowStockThreshold"] }, 1, 0] } } 
            } 
          }
        ]),
        Order.aggregate([
          { $match: { shopId: shopObjectId, status: "Pending" } },  
          { $group: { _id: null, pendingOrders: { $sum: 1 } } }
        ])
      ]);
  
      
      const stats = {
        totalProducts: productStats[0]?.totalProducts || 0,
        lowStock: productStats[0]?.lowStock || 0,
        pendingOrders: orderStats[0]?.pendingOrders || 0
      };
  
      res.status(201).json({stats,shopStatus});
    } catch (error) {
     
      next(error)
    }
  };
  