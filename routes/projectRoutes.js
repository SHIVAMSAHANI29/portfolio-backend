// routes/projectRoutes.js

const express = require('express');
const { body } = require('express-validator');
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const projectValidationRules = [
  body('title').trim().notEmpty().withMessage('Title is required.').isLength({ max: 120 }),
  body('description').trim().notEmpty().withMessage('Description is required.').isLength({ max: 500 }),
  body('technologies').optional().isArray().withMessage('Technologies must be an array.'),
  body('github').optional({ checkFalsy: true }).trim().isURL().withMessage('GitHub link must be a valid URL.'),
  body('demo').optional({ checkFalsy: true }).trim().isURL().withMessage('Demo link must be a valid URL.'),
  body('featured').optional().isBoolean()
];

// Public
router.get('/', getProjects);
router.get('/:id', getProjectById);

// Protected (admin only)
router.post('/', protect, projectValidationRules, createProject);
router.put('/:id', protect, projectValidationRules, updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
