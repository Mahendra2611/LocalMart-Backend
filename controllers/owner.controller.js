import Owner from '../models/owner.model.js';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import generateToken from '../utils/generateToken.js';
import cloudinary from '../config/cloudinary.config.js';

// Register Owner
export const registerOwner = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { mobileNumber, email ,password, shopImage, ...otherDetails } = req.body;

    if (await Owner.findOne({ $or: [{ mobileNumber: mobileNumber }, { email: email }] })) {
        return res.status(400).json({ message: 'Mobile number or email already registered' });
      }

    const uploadedImage = await cloudinary.uploader.upload(shopImage, { folder: 'shops' });

    const owner = await Owner.create({
      mobileNumber,
      password,
      shopImage: uploadedImage.secure_url,
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
    const { mobileNumber, password } = req.body;

    const owner = await Owner.findOne({ mobileNumber });
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
    const owner = await Owner.findById(req.ownerId).select('-password');
    if (!owner) return res.status(404).json({ message: 'Owner not found' });

    res.json(owner);
  } catch (error) {
    next(error);
  }
};
