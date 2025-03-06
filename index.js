import e from "express";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
// import shopRoutes from "./routes/shop.route.js"
// import itemRoutes from "./routes/items.route.js"
import owner from "./routes/owner.js"
import customer from "./routes/customer.js"
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

// app.use("/api/shops",shopRoutes);
// app.use("/api/items",itemRoutes)

app.use("/api/owner",owner)
app.use("/api/customer",customer);

app.use(errorHandler)
//Database connected
mongoose.connect(process.env.MONGODB_URL)
.then(()=>console.log("Database connected"))
.catch((e)=>console.log(e))

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server running on PORT ${PORT}`);
})