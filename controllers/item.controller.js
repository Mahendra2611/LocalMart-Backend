import mongoose from "mongoose";
import {Item }from "../models/item.model.js";
import { ShopDetails } from "../models/shopDetails.model.js";
// Add an item
export const addItem = async (req, res) => {
    try {
        const { name, price, quantity, category, image } = req.body;
        const { shopId } = req.params;

        const shopObjectId = new mongoose.Types.ObjectId(shopId);

        const newItem = new Item({ shopId: shopObjectId, name, category, price, quantity, image });
        const savedNewItem = await newItem.save();

     
        let shopDetails = await ShopDetails.findOne({ shopId: shopObjectId });

        if (shopDetails) {
          
            await ShopDetails.updateOne(
                { shopId: shopObjectId },
                { 
                    $addToSet: { itemsCategories: category, items: savedNewItem._id } 
                }
            );
        } else {
         
            shopDetails = new ShopDetails({
                shopId: shopObjectId,
                itemsCategories: [category],
                items: [savedNewItem._id],
            });
            await shopDetails.save();
        }

        res.status(201).json({ message: "Item added successfully", item: savedNewItem, shopDetails });
    } catch (error) {
        console.error(error);
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
export const getItem = async(req,res)=>{
try {
    const {shopId} = req.params;
    if(!shopId){
        return res.status(400).json({message:"Provide correct shop id"})
    }
    console.log(shopId)
    const shop = await ShopDetails.findOne({shopId:new mongoose.Types.ObjectId(shopId)});
    console.log(shop)
    return res.status(200).json({message:"Items fetched successfully",shop})
} catch (error) {
    res.status(500).json({ error: error.message });
}
}
