import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema({
    name: {type:String,required:true},
    email: { type: String, unique: true, required: true },
    password: {type:String,required:true},
    refreshToken: { type: String } // Store refresh token in DB
});

export const Owner =  mongoose.model("Owner", ownerSchema);
