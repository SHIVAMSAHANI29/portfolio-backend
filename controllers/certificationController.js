// controllers/certificationController.js

const { validationResult } = require('express-validator');
const Certification = require('../models/Certification');
const asyncHandler = require('../utils/asyncHandler');

// @route   GET /api/certifications
// @access  Public
const getCertifications = asyncHandler(async (req, res) => {
  const certifications = await Certification.find().sort({ order: 1, createdAt: -1 });
  res.status(200).json({ success: true, count: certifications.length, data: certifications });
});

// @route   GET /api/certifications/:id
// @access  Public
const getCertificationById = asyncHandler(async (req, res) => {
  const certification = await Certification.findById(req.params.id);
  if (!certification) {
    return res.status(404).json({ success: false, message: 'Certification not found.' });
  }
  res.status(200).json({ success: true, data: certification });
});

// @route   POST /api/certifications
// @access  Private (admin)
const createCertification = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
  }

  const certification = await Certification.create(req.body);
  res.status(201).json({ success: true, message: 'Certification created.', data: certification });
});

// @route   PUT /api/certifications/:id
// @access  Private (admin)
const updateCertification = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
  }

  const certification = await Certification.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!certification) {
    return res.status(404).json({ success: false, message: 'Certification not found.' });
  }

  res.status(200).json({ success: true, message: 'Certification updated.', data: certification });
});

// @route   DELETE /api/certifications/:id
// @access  Private (admin)
const deleteCertification = asyncHandler(async (req, res) => {
  const certification = await Certification.findByIdAndDelete(req.params.id);
  if (!certification) {
    return res.status(404).json({ success: false, message: 'Certification not found.' });
  }
  res.status(200).json({ success: true, message: 'Certification deleted.' });
});

module.exports = {
  getCertifications,
  getCertificationById,
  createCertification,
  updateCertification,
  deleteCertification
};
