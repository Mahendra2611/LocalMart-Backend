import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Owner", required: true }, // Reference to Owner
   
    shopCategory: { type: String, required: true, trim: true },
    shopName: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    image: { type: String },
    location: { 
        type: { type: String, enum: ['Point'], default: 'Point' }, 
        coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
}, { timestamps: true });

// Add a geospatial index for fast location-based searches
shopSchema.index({ location: "2dsphere" });

export const Shop = mongoose.model("Shop", shopSchema);
