import e from "express";
import { configDotenv } from "dotenv";
const app = e();
configDotenv();
const PORT = process.env.PORT || 3000;
app.get("/",(req,res)=>{
    res.send("hellow")
})
app.listen(PORT,()=>{
    console.log(`Server running on PORT ${PORT}`);
})