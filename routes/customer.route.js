import express from 'express';
import { signupCustomer, loginCustomer } from '../controllers/customer.controllers.js';

const router = express.Router();

router.post('/signup', signupCustomer);
router.get('/login', loginCustomer);

export default router;
