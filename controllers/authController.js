// controllers/authController.js

const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const asyncHandler = require('../utils/asyncHandler');

function generateToken(adminId) {
  return jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
  }

  const { email, password } = req.body;

  // Explicitly select the password since the schema hides it by default
  const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

  // Deliberately vague message — don't reveal whether the email or password was wrong
  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const token = generateToken(admin._id);

  res.status(200).json({
    success: true,
    message: 'Login successful.',
    token,
    admin: { id: admin._id, email: admin.email }
  });
});

module.exports = { login };
