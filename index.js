import e from "express";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import customerRouter from "./routes/customer.js"
import productRouter from "./routes/product.js";
import ownerRouter from "./routes/owner.js";
import orderRouter from "./routes/order.js";
import analyticsRouter from "./routes/salesAnalytics.js"
import notificationRouter from "./routes/notification.js"
import rateLimit from "express-rate-limit";
import errorHandler from "./middlewares/errorHandler.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

configDotenv();

// Rate Limiter
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     limit: 60,
//     message: "Too many requests, Please try again later"
// });

// CORS Configuration
const corsOption = {
    origin: ["http://localhost:5174","http://localhost:5173"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
};

const app = e();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, { cors: corsOption }); // Attach Socket.io to server

// Middleware
app.use(cors(corsOption));
app.use(e.json());


app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
});


// app.use(limiter);

app.use(cookieParser());


// Pass `io` to routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes

 app.use("/api/customer",customerRouter);
 app.use("/api/notifications",notificationRouter);
 app.use("/api/analytics",analyticsRouter);

app.use("/api/order", orderRouter);
app.use("/api/products", productRouter);
app.use("/api/owner", ownerRouter);

// Global Error Handler
app.use(errorHandler);

// Database Connection
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("Database connected"))
    .catch((e) => console.log(e));

// Socket.io Events
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("joinShop", (shopId) => {
        socket.join(shopId);
        console.log(`Shop Owner joined room: ${shopId}`);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});
export { io }
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
