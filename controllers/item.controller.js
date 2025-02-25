import { Item } from "../models/item.model.js";

// 📌 Add a new item
export const addItems = async (req, res) => {
    try {
        const { shopId } = req.params;
        const items = req.body.items;

        const newItems = items.map(item => ({
            ...item,
            shopId,
            offerPrice: item.discount > 0 ? item.salesPrice - (item.salesPrice * item.discount / 100) : item.salesPrice
        }));

        const savedItems = await Item.insertMany(newItems);
        res.status(201).json({ success: true, message: "Items added successfully", items: savedItems });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error adding items", error: error.message });
    }
};


// 📌 Update an existing item
export const updateItem = async (req, res) => {
    try {
        const { shopId } = req.params;
        const { name, category, salesPrice, costPrice, quantity, image, discount } = req.body;

        const updatedItem = await Item.findByIdAndUpdate(
            shopId,
            {
                name,
                category,
                salesPrice,
                costPrice,
                quantity,
                image,
                discount,
                offerPrice: discount > 0 ? salesPrice - (salesPrice * discount / 100) : salesPrice,
            },
            { new: true } // Return updated item
        );

        if (!updatedItem) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        res.json({ success: true, message: "Item updated successfully", item: updatedItem });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating item", error: error.message });
    }
};

// 📌 Delete an item
export const deleteItem = async (req, res) => {
    try {
        const { shopId } = req.params;
        const deletedItem = await Item.findByIdAndDelete(shopId);

        if (!deletedItem) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        res.json({ success: true, message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting item", error: error.message });
    }
};
