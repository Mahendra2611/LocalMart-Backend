import Customer from '../models/customer.model.js';
import jwt from 'jsonwebtoken';
import generateToken from '../utils/generateToken.js';

// Signup Controller
export const signupCustomer = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;
    // console.log(name);
    
    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({email});
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer already exists with this email.' });
    }
    // console.log("after email");
    

    // Create customer (avatar is optional)
    const customer = await Customer.create({
      name,
      email,
      password,
      avatar: avatar || '', // Optional avatar
    });

    // Generate token after signup
    generateToken(res, customer._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      customer: {
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        avatar: customer.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login Controller
export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if all fields are present
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    // Find customer by email and select password
    const customer = await Customer.findOne({ email }).select('+password');
    if (!customer) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare entered password with hashed password
    const isPasswordMatch = await customer.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate token after login
    generateToken(res, customer._id);

    // Return customer data with token
    res.status(200).json({
      success: true,
      message: 'Login successful!',
      customer: {
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        avatar: customer.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
