import {Shop} from "../models/shop.model.js";
import { Owner } from "../models/owner.model.js";
import { ShopCategory } from "../models/shopCategory.model.js";
import bcrypt from "bcrypt";

// Register a new shop
export const registerShop = async (req, res) => {
    try {
      const { user } = req;
      const { ownerName, shopCategory, shopName, address } = req.body;
      const image = req.file ? req.file.path : null; // Get Cloudinary URL
  
      const existingShop = await Owner.findOne({ email: user.email });
      console.log(existingShop)
      if (existingShop?.shopId) return res.status(404).json({ message: "Shop already registered" });
  console.log("after shop")
      const shopCategoryDoc = await ShopCategory.findOne({ categoryName: shopCategory });
      const newShop = await Shop.create({ ownerName, shopCategory, shopName, address, image });
  
      if (shopCategoryDoc) {
        await ShopCategory.findByIdAndUpdate(shopCategoryDoc._id, { $push: { shops: newShop._id } });
      } else {
        await ShopCategory.create({ categoryName: shopCategory, shops: [newShop._id] });
      }
  
      await Owner.findByIdAndUpdate(existingShop._id, { shopId: newShop._id });
  
      res.status(201).json({ message: "Shop registered successfully", shop: newShop });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  };
  

// Get shop details by ID
export const getShopById = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.shopId);
        if (!shop) return res.status(404).json({ message: "Shop not found" });

        res.json(shop);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update shop details
export const updateShop = async (req, res) => {
    try {
        const updatedShop = await Shop.findByIdAndUpdate(req.params.shopId, req.body, { new: true });
        if (!updatedShop) return res.status(404).json({ message: "Shop not found" });

        res.json({ message: "Shop updated successfully", shop: updatedShop });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a shop
export const deleteShop = async (req, res) => {
    try {
        const deletedShop = await Shop.findByIdAndDelete(req.params.shopId);
        if (!deletedShop) return res.status(404).json({ message: "Shop not found" });

        res.json({ message: "Shop deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
