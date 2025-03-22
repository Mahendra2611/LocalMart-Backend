import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const OwnerSchema = new mongoose.Schema(
  {
    shopName: { type: String, required: true },
    shopAddress: { type: String, required: true },
    ownerName: { type: String, required: true },
    email:{type:String,required:true},
    mobileNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    shopCategory: { type: String, required: true },
    itemCategories: { type: [String], default: [] },
    shopImage: { type: String,  },
    shopLocation: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
  },
  { timestamps: true }
);

// Hash password before saving
OwnerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


OwnerSchema.pre('save', function (next) {
  if (!Array.isArray(this.itemCategories)) {
    this.itemCategories = [];
  }

  if (!this.itemCategories.includes("All")) {
    this.itemCategories.push("All");
  }

 
  this.itemCategories = [...new Set(this.itemCategories)].sort();

  next();
});


export const Owner =  mongoose.model('Owner', OwnerSchema);

Owner.createIndexes({ shopLocation: "2dsphere" });