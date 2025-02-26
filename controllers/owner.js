import Owner from '../models/owner.js';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import generateToken from '../utils/generateToken.js';
import cloudinary from '../config/cloudinary.js';

// Register Owner
export const registerOwner = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { mobileNumber, email ,password, shopImage, ...otherDetails } = req.body;
    console.log("email "+email)
   
    if (await Owner.findOne({ $or: [{ mobileNumber: mobileNumber }, { email: email }] })) {
        return res.status(400).json({ message: 'Mobile number or email already registered' });
      }

    //const uploadedImage = await cloudinary.uploader.upload(shopImage, { folder: 'shops' });

    const owner = await Owner.create({
      mobileNumber,
      password,
      shopImage,
      email,
      ...otherDetails,
    });

    generateToken(res, owner._id);

    res.status(201).json({ success: true, owner });
  } catch (error) {
    next(error);
  }
};

// Login Owner
export const loginOwner = async (req, res, next) => {
  try {
    const { mobileNumber, email, password } = req.body;

    const owner = await Owner.findOne({$or:[{ mobileNumber },{ email}]});
    if (!owner || !(await bcrypt.compare(password, owner.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    generateToken(res, owner._id);

    res.json({ success: true, owner });
  } catch (error) {
    next(error);
  }
};

// Get Owner Profile (Optimized - No DB Query)
export const getOwnerProfile = async (req, res, next) => {
  try {
    const owner = await Owner.findById(req.id).select('-password');
    if (!owner) return res.status(404).json({ message: 'Owner not found' });

    res.json(owner);
  } catch (error) {
    next(error);
  }
};



// Update Shop
export const updateShop = async (req, res, next) => {
  try {
    const owner = await Owner.findById(req.id);
    if (!owner) return res.status(404).json({ message: 'Owner not found' });

    const { shopName, shopAddress, shopCategory, itemCategories, shopImage, shopLocation } = req.body;

    if (shopImage) {
      const uploadedImage = await cloudinary.uploader.upload(shopImage, { folder: 'shops' });
      owner.shopImage = uploadedImage.secure_url;
    }

    owner.shopName = shopName || owner.shopName;
    owner.shopAddress = shopAddress || owner.shopAddress;
    owner.shopCategory = shopCategory || owner.shopCategory;
    owner.itemCategories = itemCategories || owner.itemCategories;
    owner.shopLocation = shopLocation || owner.shopLocation;

    await owner.save();

    res.json({ success: true, message: 'Shop updated successfully', owner });
  } catch (error) {
    next(error);
  }
};

// Delete Shop and related data
export const deleteShop = async (req, res, next) => {
  try {
    const owner = await Owner.findById(req.id);
    if (!owner) return res.status(404).json({ message: 'Owner not found' });

    // Delete shop-related data (modify as needed)
    await Order.deleteMany({ shopId: owner._id });
    await Product.deleteMany({ shopId: owner._id });

    // Delete the shop image from Cloudinary
    const imageId = owner.shopImage.split('/').pop().split('.')[0]; // Extract ID from Cloudinary URL
    await cloudinary.uploader.destroy(imageId);

    // Delete owner/shop from database
    await Owner.findByIdAndDelete(req.ownerId);

    res.json({ success: true, message: 'Shop and related data deleted successfully' });
  } catch (error) {
    next(error);
  }
};

