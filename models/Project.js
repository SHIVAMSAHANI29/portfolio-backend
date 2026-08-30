// models/Project.js
// Represents a single project card shown in the Projects section.

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    technologies: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => Array.isArray(arr),
        message: 'Technologies must be an array of strings'
      }
    },
    github: {
      type: String,
      trim: true,
      default: ''
    },
    demo: {
      type: String,
      trim: true,
      default: ''
    },
    image: {
      type: String, // URL/path to an image, or short text used as the placeholder icon (e.g. "SMS")
      trim: true,
      default: ''
    },
    featured: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0 // lets the admin control display order
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
