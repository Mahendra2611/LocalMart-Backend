import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    invoiceNumber: { type: String, unique: true, required: true },
    totalAmount: { type: Number, required: true },
    pdfUrl: { type: String, required: true }, // Store generated invoice PDF URL
    sentToEmail: { type: Boolean, default: false },
}, { timestamps: true });

export const Invoice = mongoose.model("Invoice", invoiceSchema);
