// controllers/messageController.js
// All routes here are protected by authMiddleware — only the logged-in admin can reach them.

const Message = require('../models/Message');
const asyncHandler = require('../utils/asyncHandler');

// @route   GET /api/messages
// @access  Private (admin)
const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: messages.length, data: messages });
});

// @route   GET /api/messages/:id
// @access  Private (admin)
const getMessageById = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) {
    return res.status(404).json({ success: false, message: 'Message not found.' });
  }
  res.status(200).json({ success: true, data: message });
});

// @route   PUT /api/messages/:id/read
// @access  Private (admin)
const markMessageAsRead = asyncHandler(async (req, res) => {
  const message = await Message.findByIdAndUpdate(
    req.params.id,
    { read: true, status: 'read' },
    { new: true }
  );
  if (!message) {
    return res.status(404).json({ success: false, message: 'Message not found.' });
  }
  res.status(200).json({ success: true, message: 'Message marked as read.', data: message });
});

// @route   DELETE /api/messages/:id
// @access  Private (admin)
const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findByIdAndDelete(req.params.id);
  if (!message) {
    return res.status(404).json({ success: false, message: 'Message not found.' });
  }
  res.status(200).json({ success: true, message: 'Message deleted.' });
});

module.exports = { getMessages, getMessageById, markMessageAsRead, deleteMessage };
