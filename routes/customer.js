import express from 'express';
import { signupCustomer, loginCustomer, updateProfile,addAddress, updateAddress } from '../controllers/customer.js';
import { authenticateCustomer } from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/signup', signupCustomer);
router.post('/login', loginCustomer);
router.put('/update/profile',authenticateCustomer,updateProfile);
router.post("/address", authenticateCustomer, addAddress);
router.put("/address/:addressId", authenticateCustomer, updateAddress);
export default router;
