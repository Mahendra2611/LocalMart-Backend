import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
    ownerName:{type:String,required:true,trim:true},
    email:{type:String,required:true,unique:true,trim:true},
    password:{type:String, required:true },
    shopCategory:{type:String, required:true ,trim:true },
    shopName:{type:String, required:true,trim:true },
    address:{type:String, required:true },
    image:{type:String}
},{timestamps:true})

export const shopModel = mongoose.model("Shop",shopSchema);