import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
    ownerName:{type:String,required:true,trim:true},
    shopCategory:{type:String, required:true ,trim:true },
    shopName:{type:String, required:true,trim:true },
    address:{type:String, required:true },
    image:{type:String}
},{timestamps:true})

export const Shop = mongoose.model("Shop",shopSchema);