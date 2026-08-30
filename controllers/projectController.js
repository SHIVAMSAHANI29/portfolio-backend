// controllers/projectController.js

const { validationResult } = require('express-validator');
const Project = require('../models/Project');
const asyncHandler = require('../utils/asyncHandler');

// @route   GET /api/projects
// @access  Public
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find().sort({ order: 1, createdAt: -1 });
  res.status(200).json({ success: true, count: projects.length, data: projects });
});

// @route   GET /api/projects/:id
// @access  Public
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found.' });
  }
  res.status(200).json({ success: true, data: project });
});

// @route   POST /api/projects
// @access  Private (admin)
const createProject = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
  }

  const project = await Project.create(req.body);
  res.status(201).json({ success: true, message: 'Project created.', data: project });
});

// @route   PUT /api/projects/:id
// @access  Private (admin)
const updateProject = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
  }

  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found.' });
  }

  res.status(200).json({ success: true, message: 'Project updated.', data: project });
});

// @route   DELETE /api/projects/:id
// @access  Private (admin)
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found.' });
  }
  res.status(200).json({ success: true, message: 'Project deleted.' });
});

module.exports = { getProjects, getProjectById, createProject, updateProject, deleteProject };
