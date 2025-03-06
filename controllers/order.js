import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";
import Item from "../models/item.model.js";
import { v4 as uuidv4 } from "uuid"; // For generating unique invoice IDs

/** ✅ Create a New Order */
export const createOrder = async (req, res) => {
    try {
        const { shopId, customerId, items } = req.body;

        // Check if shop exists
        const shop = await Shop.findById(shopId);
        if (!shop) return res.status(404).json({ message: "Shop not found!" });

        let totalAmount = 0;
        let totalProfit = 0;

        // Fetch item details and calculate total amount & profit
        const updatedItems = await Promise.all(
            items.map(async (item) => {
                const product = await Item.findById(item.itemId);
                if (!product) throw new Error(`Item ${item.itemId} not found`);

                const price = product.offerPrice || product.salesPrice;
                totalAmount += price * item.quantity;
                totalProfit += (price - product.costPrice) * item.quantity;

                return { ...item, price };
            })
        );

        // Create Order
        const newOrder = new Order({
            shopId,
            customerId,
            items: updatedItems,
            totalAmount,
            profit: totalProfit,
            status: "Pending",
            invoiceId: uuidv4(),
        });

        await newOrder.save();
        res.status(201).json({ message: "Order created successfully!", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: "Error creating order", error: error.message });
    }
};

/** ✅ Get Orders by Shop ID */
export const getOrdersByShop = async (req, res) => {
    try {
        const { shopId } = req.params;
        const orders = await Order.find({ shopId }).populate("customerId items.itemId");
        res.status(200).json({ message: "Orders retrieved successfully!", orders });
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};

/** ✅ Get Order by Order ID */
export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId).populate("customerId items.itemId");
        if (!order) return res.status(404).json({ message: "Order not found!" });

        res.status(200).json({ message: "Order retrieved successfully!", order });
    } catch (error) {
        res.status(500).json({ message: "Error fetching order", error: error.message });
    }
};

/** ✅ Update Order Status */
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!updatedOrder) return res.status(404).json({ message: "Order not found!" });

        res.status(200).json({ message: "Order status updated!", order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: "Error updating order", error: error.message });
    }
};

/** ✅ Delete Order */
export const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const deletedOrder = await Order.findByIdAndDelete(orderId);
        if (!deletedOrder) return res.status(404).json({ message: "Order not found!" });

        res.status(200).json({ message: "Order deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting order", error: error.message });
    }
};
