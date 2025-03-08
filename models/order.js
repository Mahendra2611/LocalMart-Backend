import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid"; // Install with `npm i uuid`

const orderSchema = new mongoose.Schema(
  {
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Owner", required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },

    products: [
      {
        name: { type: String, required: true }, // Snapshot of product name
        category: { type: String, required: true }, // Store product category
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      }
    ],

    totalAmount: { type: Number, required: true },
    profit: { type: Number }, // Will be auto-calculated
    status: { type: String, enum: ["Pending", "Accepted", "Cancelled", "Delivered"], default: "Pending" },

    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
    paymentMethod: { type: String, enum: ["cash","online"], required: true },

    invoiceId: { type: String, unique: true, default: uuidv4 }, // Auto-generate unique ID
    deliveryAddress: { type: String, required: true }, // Needed for delivery
    estimatedDeliveryDate: { type: Date }, // Optional
    estimatedDeliveryTime: { type: String }

  },
  { timestamps: true }
);

// Auto-calculate profit before saving order
orderSchema.pre("save", function (next) {
  this.profit = this.products.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  next();
});

export const Order = mongoose.model("Order", orderSchema);
