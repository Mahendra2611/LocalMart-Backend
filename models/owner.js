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
    shopImage: { type: String, required: true },
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

export const Owner =  mongoose.model('Owner', OwnerSchema);
