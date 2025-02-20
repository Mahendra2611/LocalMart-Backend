import e from "express";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import shopRoutes from "./routes/shop.route.js"
import itemRoutes from "./routes/items.route.js"
import ownerAuthRoutes from "./routes/ownerAuth.route.js"
import rateLimit from "express-rate-limit"

configDotenv();

const limiter = rateLimit({
    windowMs:15*60*1000,
    limit:60,
    message:"To many reques, Please try again later"
})
const app = e();

app.use(e.json())
app.use(limiter)
app.use(cookieParser())

app.use("/api/shops",shopRoutes);
app.use("/api/items",itemRoutes)
app.use("/api/ownerAuth",ownerAuthRoutes)

//Database connected
mongoose.connect(process.env.MONGODB_URL)
.then(()=>console.log("Database connected"))
.catch((e)=>console.log(e))

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server running on PORT ${PORT}`);
})