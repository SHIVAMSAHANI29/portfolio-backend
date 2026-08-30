// models/Certification.js
// Represents a single certification card.

const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Certification title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    organization: {
      type: String,
      required: [true, 'Issuing organization is required'],
      trim: true,
      maxlength: [150, 'Organization cannot exceed 150 characters']
    },
    date: {
      type: String, // kept as a display string (e.g. "March 2025") to match the existing card design
      required: [true, 'Date is required'],
      trim: true
    },
    certificateUrl: {
      type: String,
      trim: true,
      default: ''
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certification', certificationSchema);
