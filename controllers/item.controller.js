import mongoose from "mongoose";
import {Item }from "../models/item.model.js";
import { ShopDetails } from "../models/shopDetails.model.js";
// Add an item

export const addItem = async (req, res,next) => {
   
    try {
        const { name, price, quantity, category } = req.body;
        const { shopId } = req.params;
        const image = req.file ? req.file.path : null;
        console.log(shopId)
        const shopObjectId = new mongoose.Types.ObjectId(shopId);
    
        const newItem = new Item({ shopId: shopObjectId, name, category, price, quantity, image });
        const savedNewItem = await newItem.save();

     
        let shopDetails = await ShopDetails.findOneAndUpdate(
            { shopId: shopObjectId },
            {
              $addToSet: { itemsCategories: category, items: savedNewItem._id }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true } // upsert creates a new doc if it doesn't exist
          );
          
          console.log(shopDetails);
          

        res.status(201).json({ message: "Item added successfully", item: savedNewItem, shopDetails });
    } catch (error) {
       next(error)
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
