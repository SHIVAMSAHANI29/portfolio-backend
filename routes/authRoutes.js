// routes/authRoutes.js

const express = require('express');
const { body } = require('express-validator');
const { login } = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

const loginValidationRules = [
  body('email').trim().notEmpty().withMessage('Email is required.').isEmail().withMessage('Invalid email.'),
  body('password').notEmpty().withMessage('Password is required.')
];

// POST /api/auth/login
router.post('/login', authLimiter, loginValidationRules, login);

module.exports = router;
