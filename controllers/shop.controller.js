import {Shop} from "../models/shop.model.js";
import { Owner } from "../models/owner.model.js";
import { ShopCategory } from "../models/shopCategory.model.js";
import bcrypt from "bcrypt";

// Register a new shop
export const registerShop = async (req, res) => {
    try {
        const {user} = req;

        const { ownerName,  shopCategory, shopName, address, image } = req.body;
        
        const existingShop = await Owner.findOne({ email:user.email });
     
        if (existingShop && existingShop.shopId) return res.status(400).json({ message: "Shop already registered" });
        const shop = await ShopCategory.findOne({categoryName:shopCategory})
        const newShop = await Shop.create({ ownerName, shopCategory, shopName, address, image });
       
        const savedShop = await newShop.save();
        if(shop){
            await ShopCategory.findByIdAndUpdate(shop._id,{$push:{shops:savedShop._id}})
        }
        else{
            await ShopCategory.create({categoryName:shopCategory,$push:{shops:savedShop._id}});
        }
        await Owner.findByIdAndUpdate(existingShop._id,{shopId:savedShop._id});

        res.status(201).json({ message: "Shop registered successfully", shop: savedShop });
    } catch (error) {
        console.log(error)
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
