import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

// Import Routes & Middlewares
import customerRouter from "./routes/customer.js";
import productRouter from "./routes/product.js";
import ownerRouter from "./routes/owner.js";
import orderRouter from "./routes/order.js";
import analyticsRouter from "./routes/salesAnalytics.js";
import notificationRouter from "./routes/notification.js";
import dashboardRouter from "./routes/dashboard.js";
import paymentRouter from "./routes/payment.js";
import errorHandler from "./middlewares/errorHandler.js";

// Import Passport configuration (ensure proper OAuth strategy is set up)
import "./config/passport.js";

// Load environment variables from .env file
config();

// Define allowed origins for CORS
const allowedOrigins = [
  "https://shopsy-cust-frontend.vercel.app",
  "https://shopsy-frontend-cyan.vercel.app"
];

// Create Express app
const app = express();

// =====================
// CORS Middleware Setup
// =====================
const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
};
app.use(cors(corsOptions));

// ================
// Request Logging
// ================
app.use((req, res, next) => {
  console.log(Incoming request: ${req.method} ${req.url});
  next();
});

// ================
// Middleware Setup
// ================
app.use(express.json());
app.use(cookieParser());

// ====================
// Create HTTP Server & Socket.io Setup
// ====================
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Make Socket.io instance available in requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ====================
// Test Route
// ====================
app.get("/test", (req, res) => {
  res.json("Test successful");
});

// ====================
// API Routes
// ====================
app.use("/api/customer", customerRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/order", orderRouter);
app.use("/api/products", productRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/payments", paymentRouter);

// ====================
// MongoDB Connection
// ====================
if (!process.env.MONGODB_URL) {
  console.error("❌ ERROR: MONGODB_URL is not set in environment variables!");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ Database connected"))
  .catch((err) => {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  });

// ====================
// Socket.io Events
// ====================
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinShop", (shopId) => {
    socket.join(shopId);
    console.log(Shop Owner joined room: ${shopId});
  });

  socket.on("joinCustomer", (customerId) => {
    socket.join(customerId);
    console.log(Customer joined room: ${customerId});
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// ====================
// Error Handling Middleware (should be last middleware)
// ====================
app.use(errorHandler);

// ====================
// Start Server
// ====================
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(🚀 Server running on PORT ${PORT});
});

export { io };
