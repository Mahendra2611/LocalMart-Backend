import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    items: [
        {
            itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    profit: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ["Pending", "Accepted", "Dispatched", "Delivered", "Cancelled"], 
        default: "Pending" 
    },
    invoiceId: { type: String, unique: true },
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);
