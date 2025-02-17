import {Shop} from "../models/shop.model.js";
import bcrypt from "bcrypt";

// Register a new shop
export const registerShop = async (req, res) => {
    try {
        const { ownerName,  shopCategory, shopName, address, image } = req.body;

        // Check if email already exists
        const existingShop = await Shop.findOne({ email });
        if (existingShop) return res.status(400).json({ message: "Email already registered" });

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newShop = new Shop({ ownerName, email, password: hashedPassword, shopCategory, shopName, address, image });
        await newShop.save();

        res.status(201).json({ message: "Shop registered successfully", shop: newShop });
    } catch (error) {
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
