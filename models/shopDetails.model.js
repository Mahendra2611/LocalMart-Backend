import mongoose from "mongoose";

const shopDetailsSchema = new mongoose.Schema({
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    categories: [{ type: String,trim:true }], 
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }], // Items in shop
}, { timestamps: true });

export const ShopDetailsModel =  mongoose.model("ShopDetails", shopDetailsSchema);
