import mongoose from "mongoose";

const salesAnalyticsSchema = new mongoose.Schema({
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true, unique: true },
    totalQuantitySold: { type: Number, default: 0 },
    totalProfit: { type: Number, default: 0 },
    dailyStats: [
        {
            date: { type: Date, required: true },
            quantitySold: { type: Number, default: 0 },
            profit: { type: Number, default: 0 }
        }
    ]
}, { timestamps: true });

export const SalesAnalytics = mongoose.model("SalesAnalytics", salesAnalyticsSchema);
