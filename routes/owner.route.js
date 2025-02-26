import express from 'express';
import { registerOwner, loginOwner, getOwnerProfile } from '../controllers/owner.controller.js';
import { body } from 'express-validator';
import verifyOwner from '../middlewares/authOwner.middleware.js';

const router = express.Router();

router.post(
  '/register',
  [
    body('shopName').notEmpty().withMessage('Shop name is required'),
    body('shopAddress').notEmpty().withMessage('Shop address is required'),
    body('ownerName').notEmpty().withMessage('Owner name is required'),
    body('email').notEmpty().isEmail().withMessage('Email is required'),
    body('mobileNumber').isMobilePhone().withMessage('Valid mobile number is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('shopCategory').notEmpty().withMessage('Shop category is required'),
    body('shopLocation.coordinates').isArray({ min: 2, max: 2 }).withMessage('Valid coordinates are required'),
  ],
  registerOwner
);

router.post('/login', loginOwner);
router.get('/profile', verifyOwner, getOwnerProfile);

export default router;
