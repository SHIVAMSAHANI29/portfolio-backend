// routes/contactRoutes.js

const express = require('express');
const { body } = require('express-validator');
const { submitContactForm } = require('../controllers/contactController');
const { contactLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

const contactValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Please enter your name.')
    .isLength({ max: 100 })
    .withMessage('Name is too long.')
    .escape(),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Please enter your email.')
    .isEmail()
    .withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Please write a short message.')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message should be between 10 and 2000 characters.')
    .escape()
];

// POST /api/contact
router.post('/', contactLimiter, contactValidationRules, submitContactForm);

module.exports = router;
