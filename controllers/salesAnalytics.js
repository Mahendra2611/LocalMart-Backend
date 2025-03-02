import { SalesAnalytics } from "../models/salesAnalytics.js";
import { Order } from "../models/order.js";

// Update sales analytics when an order is placed or modified
export const updateSalesAnalytics = async (shopId, products, profit, paymentMethod) => {
    try {
        const today = new Date().toISOString().split("T")[0]; // Get today's date

        const update = {
            $inc: { 
                totalQuantitySold: 0, 
                totalProfit: profit, 
                totalSuccessfulOrders: 1 // Increment successful orders count
            },
            $setOnInsert: { shopId },
        };

        // Update quantity for each product
        products.forEach(product => {
            update.$inc.totalQuantitySold += product.quantity;
        });

        // Track revenue breakdown based on payment method
        if (paymentMethod === "online") {
            update.$inc["revenueBreakdown.onlinePayments"] = profit;
        } else if (paymentMethod === "cash") {
            update.$inc["revenueBreakdown.cashPayments"] = profit;
        }

        // Update daily stats
        update.$set = {
            "dailyStats.$[element].quantitySold": update.$inc.totalQuantitySold,
            "dailyStats.$[element].profit": update.$inc.totalProfit
        };

        await SalesAnalytics.findOneAndUpdate(
            { shopId },
            update,
            {
                upsert: true,
                arrayFilters: [{ "element.date": today }],
                new: true
            }
        );

    } catch (error) {
        console.error("Error updating sales analytics:", error);
    }
};


// Get sales analytics
export const getSalesAnalytics = async (req, res, next) => {
    try {
        const { shopId } = req.params;
        const { startDate, endDate } = req.query; // Optional date range filter

        let filter = { shopId };

        if (startDate && endDate) {
            filter["dailyStats.date"] = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const analytics = await SalesAnalytics.findOne(filter);

        res.status(200).json({ success: true, salesAnalytics: analytics || {} });
    } catch (error) {
        next(error);
    }
};
