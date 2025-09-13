import express from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { signup, login } from '../controllers/authController.js';
import validateRequest from '../middlewares/validateRequest.js';

const router = express.Router();

// Login limiter
const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 6,
  message: { success: false, message: 'Too many login attempts. Try again shortly.' }
});

// Validators
const signupValidators = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 chars')
];
const loginValidators = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').exists().withMessage('Password is required')
];

router.post('/signup', signupValidators, validateRequest, signup);
router.post('/login', loginLimiter, loginValidators, validateRequest, login);

export default router;
