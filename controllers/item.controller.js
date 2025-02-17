import {Item }from "../models/item.model.js";

// Add an item
export const addItem = async (req, res) => {
    try {
        const { name, price, quantity,category,image } = req.body;
        const { shopId } = req.params;

        const newItem = new Item({ shopId, name, category, price, quantity,image });
        await newItem.save();

        res.status(201).json({ message: "Item added successfully", item: newItem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an item
export const updateItem = async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.itemId, req.body, { new: true });
        if (!updatedItem) return res.status(404).json({ message: "Item not found" });

        res.json({ message: "Item updated successfully", item: updatedItem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an item
export const deleteItem = async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.itemId);
        if (!deletedItem) return res.status(404).json({ message: "Item not found" });

        res.json({ message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
