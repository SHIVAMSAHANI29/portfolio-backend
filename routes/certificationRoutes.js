// routes/certificationRoutes.js

const express = require('express');
const { body } = require('express-validator');
const {
  getCertifications,
  getCertificationById,
  createCertification,
  updateCertification,
  deleteCertification
} = require('../controllers/certificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const certificationValidationRules = [
  body('title').trim().notEmpty().withMessage('Title is required.').isLength({ max: 150 }),
  body('organization').trim().notEmpty().withMessage('Organization is required.').isLength({ max: 150 }),
  body('date').trim().notEmpty().withMessage('Date is required.'),
  body('certificateUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Certificate URL must be valid.')
];

// Public
router.get('/', getCertifications);
router.get('/:id', getCertificationById);

// Protected (admin only)
router.post('/', protect, certificationValidationRules, createCertification);
router.put('/:id', protect, certificationValidationRules, updateCertification);
router.delete('/:id', protect, deleteCertification);

module.exports = router;
