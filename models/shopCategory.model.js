import mongoose from "mongoose";

const shopCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true,trim:true },
    shops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Shop" }],
}, { timestamps: true });

export const shopCategoryModel =  mongoose.model("Category", shopCategorySchema);
