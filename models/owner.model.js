import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema({
    name: {type:String,required:true},
    email: { type: String, unique: true, required: true },
    password: {type:String,required:true},
    shopId:{type:mongoose.Schema.Types.ObjectId,ref:"Shop"},
});

export const Owner =  mongoose.model("Owner", ownerSchema);
