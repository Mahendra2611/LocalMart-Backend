import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { v4 as uuidv4 } from "uuid";

// 🛒 **Create a New Order (Customer)**
export const createOrder = async (req, res, next) => {
  try {
    const { shopId, products, paymentMethod, deliveryAddress } = req.body;
    const customerId = req.user.id; // Extracted from auth middleware

    // Fetch product details
    const productDetails = await Product.find({
      _id: { $in: products.map((item) => item.productId) },
    });

    if (productDetails.length !== products.length) {
      return res.status(400).json({ success: false, message: "Invalid product IDs" });
    }

    // Calculate total amount & attach product details
    let totalAmount = 0;
    const finalProducts = products.map((item) => {
      const product = productDetails.find((p) => p._id.toString() === item.productId);
      totalAmount += product.offerPrice * item.quantity;
      return {
        productId: product._id,
        name: product.name,
        image: product.image,
        category: product.category,
        quantity: item.quantity,
        price: product.offerPrice,
      };
    });

    // Create order
    const order = new Order({
      shopId,
      customerId,
      products: finalProducts,
      totalAmount,
      profit: totalAmount, // Profit calculation can be improved
      invoiceId: uuidv4(),
      paymentMethod,
      deliveryAddress,
    });

    await order.save();
    res.status(201).json({ success: true, message: "Order placed successfully", order });
  } catch (error) {
    next(error);
  }
};

// 👤 **Get Orders for a Customer**
export const getCustomerOrders = async (req, res, next) => {
  try {
    const customerId = req.user.id;
    const orders = await Order.find({ customerId }).populate("shopId", "shopName");
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// 🏪 **Get Orders for a Shop Owner**
export const getShopOrders = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const orders = await Order.find({ shopId: ownerId }).populate("customerId", "name");
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// ✅ **Update Order Status (Owner)**
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!["Pending", "Accepted", "Cancelled", "Delivered"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    next(error);
  }
};

// 💰 **Update Payment Status (Owner)**
export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    if (!["Pending", "Paid", "Failed"].includes(paymentStatus)) {
      return res.status(400).json({ success: false, message: "Invalid payment status" });
    }

    const order = await Order.findByIdAndUpdate(orderId, { paymentStatus }, { new: true });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Payment status updated", order });
  } catch (error) {
    next(error);
  }
};
