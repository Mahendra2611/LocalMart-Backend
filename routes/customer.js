import express from 'express';
import { signupCustomer, loginCustomer, updateProfile } from '../controllers/customer.js';
import { authenticateCustomer } from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/signup', signupCustomer);
router.post('/login', loginCustomer);
router.put('/update/profile',authenticateCustomer,updateProfile);

export default router;
