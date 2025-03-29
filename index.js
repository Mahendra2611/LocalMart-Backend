import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import customerRouter from "./routes/customer.js";
import productRouter from "./routes/product.js";
import ownerRouter from "./routes/owner.js";
import orderRouter from "./routes/order.js";
import analyticsRouter from "./routes/salesAnalytics.js";
import notificationRouter from "./routes/notification.js";
import dashboardRouter from "./routes/dashboard.js";
import paymentRouter from "./routes/payment.js";
import errorHandler from "./middlewares/errorHandler.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

config(); // Load environment variables

// CORS Configuration
const corsOption = {
    origin: ["https://shopsy-cust-frontend.vercel.app", "https://shopsy-frontend-cyan.vercel.app"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: corsOption });

// Middleware

app.use(express.json());
app.use(cors(corsOption));
app.use(cookieParser());


// ✅ Debugging Session Issues
app.use((req, res, next) => {
    console.log("Session Data:", req.session);
    next();
});



// Request Logging Middleware
app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
});

// Pass `io` to routes
app.use((req, res, next) => {
    req.io = io;
    next();
});



// Test Route
app.get("/test", (req, res) => {
    return res.json("Test successful");
});

// API Routes
app.use("/api/customer", customerRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/order", orderRouter);
app.use("/api/products", productRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/payments", paymentRouter);

// ✅ Ensure Database Connection is Secure
if (!process.env.MONGODB_URL) {
    console.error("❌ ERROR: MONGODB_URL is not set in environment variables!");
    process.exit(1);
}

mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("✅ Database connected"))
    .catch((e) => console.log("❌ Database connection error:", e));

// Socket.io Events
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("joinShop", (shopId) => {
        socket.join(shopId);
        console.log(`Shop Owner joined room: ${shopId}`);
    });

    socket.on("joinCustomer",(customerId)=>{
        socket.join(customerId)
        console.log(`Customer joined room: ${customerId}`)
    })
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

// Error Handling Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on PORT ${PORT}`);
});

export { io };
