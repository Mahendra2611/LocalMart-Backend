import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import "./config/passport.js"; // Ensure OAuth strategy is correctly configured

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

const app = express();
const server = http.createServer(app);

// ✅ *1. Define Allowed Origins*
const allowedOrigins = [
    "https://shopsy-cust-frontend.vercel.app",
    "https://shopsy-frontend-cyan.vercel.app"
];

// ✅ *2. Setup CORS Middleware for Express*
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
};

// ✅ *3. Apply CORS Before Other Middlewares*
app.use(cors(corsOptions));

// ✅ *4. Handle Preflight Requests*
app.options("*", cors(corsOptions));

// ✅ *5. Setup WebSocket CORS*
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// ✅ *6. Middleware Setup*
app.use(express.json());
app.use(cookieParser());

// ✅ *7. Session Setup*
app.use(session({
    name: "session",
    secret: process.env.SESSION_SECRET || "secretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
}));

app.use(passport.initialize());
app.use(passport.session());

// ✅ *8. Debugging Logs*
app.use((req, res, next) => {
    console.log(Request: ${req.method} ${req.url});
    console.log("Session Data:", req.session);
    next();
});

// ✅ *9. Pass io to Routes*
app.use((req, res, next) => {
    req.io = io;
    next();
});

// ✅ *10. OAuth Routes*
app.get("/oauth/:provider", (req, res, next) => {
    const provider = req.params.provider;
    if (provider === "google") {
        passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
    } else {
        return res.status(400).json({ message: "Invalid OAuth provider" });
    }
});

app.get("/oauth/:provider/callback", (req, res, next) => {
    const provider = req.params.provider;
    if (provider === "google") {
        passport.authenticate("google", { failureRedirect: "/" })(req, res, next);
    } else {
        return res.status(400).json({ message: "Invalid OAuth provider" });
    }
}, (req, res) => {
    res.redirect("/dashboard"); // Redirect after successful login
});

// ✅ *11. Test Route*
app.get("/test", (req, res) => {
    return res.json("Test successful");
});

// ✅ *12. API Routes*
app.use("/api/customer", customerRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/order", orderRouter);
app.use("/api/products", productRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/payments", paymentRouter);

// ✅ *13. Ensure Database Connection is Secure*
if (!process.env.MONGODB_URL) {
    console.error("❌ ERROR: MONGODB_URL is not set in environment variables!");
    process.exit(1);
}

mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("✅ Database connected"))
    .catch((e) => console.log("❌ Database connection error:", e));

// ✅ *14. Setup WebSocket Events*
io.on("connection", (socket) => {
    console.log(A user connected: ${socket.id});

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

// ✅ *15. Error Handling Middleware*
app.use(errorHandler);

// ✅ *16. Start Server*
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
    console.log(🚀 Server running on PORT ${PORT});
});

export { io };
