import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    salesPrice: { type: Number, required: true },
    costPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
    discount: { type: Number, default: 0 }, // Discount percentage (e.g., 10 for 10% off)
    offerPrice: { type: Number }, // Final price after discount
}, { timestamps: true });

// Calculate offer price before saving
itemSchema.pre("save", function (next) {
    if (this.discount > 0) {
        this.offerPrice = this.salesPrice - (this.salesPrice * this.discount / 100);
    } else {
        this.offerPrice = this.salesPrice;
    }
    next();
});

export const Item = mongoose.model("Item", itemSchema);
