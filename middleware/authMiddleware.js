// middleware/authMiddleware.js
// Protects routes that only the logged-in admin should be able to reach.
// Expects a header: Authorization: Bearer <token>

const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Make sure the admin still exists (e.g. wasn't deleted after the token was issued)
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin account no longer exists.'
      });
    }

    req.admin = { id: admin._id, email: admin.email };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Invalid or expired token.'
    });
  }
};

module.exports = { protect };
