import { Shop } from "../models/shop.model.js";
import { Item } from "../models/item.model.js";
import { ShopDetails } from "../models/shopDetails.model.js";
import { Owner } from "../models/owner.model.js";

/** ✅ Add a New Shop */
export const addShop = async (req, res) => {
    try {
        const { shopCategory, shopName, address, image, location } = req.body;

        // Validate location format
        if (!Array.isArray(location) || location.length !== 2) {
            return res.status(400).json({ message: "Invalid location format. Use [longitude, latitude]." });
        }

        // Check if user already owns a shop
        const existingShop = await Shop.findOne({ ownerId: req.user.id });
        if (existingShop) {
            return res.status(400).json({ message: "You already own a shop." });
        }

        // Create new shop
        const newShop = new Shop({
            ownerId: req.user.id, // Owner's ID from token
            ownerName: req.user.name,
            shopCategory,
            shopName,
            address,
            image,
            location: {
                type: "Point",
                coordinates: location,
            }
        });

        await newShop.save();

        // Link shop to owner
        await Owner.findByIdAndUpdate(req.user.id, { shopId: newShop._id });

        res.status(201).json({ message: "Shop added successfully!", shop: newShop });
    } catch (error) {
        res.status(500).json({ message: "Error adding shop", error: error.message });
    }
};

/** ✅ Update Shop (Only Non-Sensitive Fields) */
export const updateShop = async (req, res) => {
    try {
        const { shopId } = req.params;
        const { shopCategory, shopName, address, image } = req.body;

        // Find shop and ensure user is the owner
        const shop = await Shop.findById(shopId);
        if (!shop) return res.status(404).json({ message: "Shop not found" });

        if (shop.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to update this shop" });
        }

        // Only update allowed fields
        shop.shopCategory = shopCategory || shop.shopCategory;
        shop.shopName = shopName || shop.shopName;
        shop.address = address || shop.address;
        shop.image = image || shop.image;

        await shop.save();
        res.json({ message: "Shop updated successfully!", shop });
    } catch (error) {
        res.status(500).json({ message: "Error updating shop", error: error.message });
    }
};

/** ✅ Delete Shop (Cascading Deletion) */
export const deleteShop = async (req, res) => {
    try {
        const { shopId } = req.params;

        // Find shop and ensure user is the owner
        const shop = await Shop.findById(shopId);
        if (!shop) return res.status(404).json({ message: "Shop not found" });

        if (shop.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to delete this shop" });
        }

        // Delete shop and its related data
        await Shop.findByIdAndDelete(shopId);
        await Item.deleteMany({ shopId });
        await ShopDetails.deleteMany({ shopId });

        // Remove shop reference from Owner
        await Owner.findByIdAndUpdate(req.user.id, { $unset: { shopId: "" } });

        res.json({ message: "Shop and related data deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting shop", error: error.message });
    }
};
/** ✅ Get Shop Details (For Logged-In Owner) */
export const getShop = async (req, res) => {
    try {
        // Find the shop linked to the logged-in user
        const shop = await Shop.findOne({ ownerId: req.user.id });

        if (!shop) {
            return res.status(404).json({ message: "Shop not found for this owner." });
        }

        res.status(200).json({ message: "Shop retrieved successfully!", shop });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving shop", error: error.message });
    }
};

