import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image:{type:String,required:true}
}, { timestamps: true });

export const Item =  mongoose.model("Item", itemSchema);
