import mongoose from "mongoose";

const salesAnalyticsSchema = new mongoose.Schema({
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    date: { type: Date, required: true },
    totalSales: { type: Number, default: 0 },
    totalProfit: { type: Number, default: 0 },
    ordersCount: { type: Number, default: 0 },
}, { timestamps: true });

export const SalesAnalytics = mongoose.model("SalesAnalytics", salesAnalyticsSchema);
