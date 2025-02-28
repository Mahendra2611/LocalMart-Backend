import e from "express";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
// import shopRoutes from "./routes/shop.route.js"
import productRouter from "./routes/product.js"
import ownerRouter from "./routes/owner.js"
import orderRouter from "./routes/order.js"

import rateLimit from "express-rate-limit"
import errorHandler from "./middlewares/errorHandler.js";
import cors from "cors"
configDotenv();

const limiter = rateLimit({
    windowMs:15*60*1000,
    limit:60,
    message:"To many reques, Please try again later"
})
const corsOption = {
    origin:"http://localhost:5173",
    methods:["POST","GET","PUT","DELETE"],
    credentials: true,
}
const app = e();
app.use(cors(corsOption))
app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
});
app.use(e.json())
app.use(limiter)
app.use(cookieParser())

app.use("/api/order",orderRouter);
app.use("/api/product",productRouter)
app.use("/api/owner",ownerRouter)

app.use(errorHandler)
//Database connected
mongoose.connect(process.env.MONGODB_URL)
.then(()=>console.log("Database connected"))
.catch((e)=>console.log(e))

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server running on PORT ${PORT}`);
})